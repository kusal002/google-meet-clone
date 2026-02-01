import { useEffect, useRef, useState } from "react";
import {
  getDatabase,
  ref,
  set,
  push,
  onChildAdded,
  onValue,
  remove,
} from "firebase/database";

type UseWebRTCProps = {
  meetingId: string;
  isHost: boolean;
};

export const useWebRTC = ({ meetingId, isHost }: UseWebRTCProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);

  const db = getDatabase();

  const roomRef = ref(db, `meetings/${meetingId}`);
  const offerRef = ref(db, `meetings/${meetingId}/offer`);
  const answerRef = ref(db, `meetings/${meetingId}/answer`);
  const callerCandidatesRef = ref(db, `meetings/${meetingId}/callerCandidates`);
  const calleeCandidatesRef = ref(db, `meetings/${meetingId}/calleeCandidates`);

  // 🎥 Get media
  const getMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    return stream;
  };

  // 🔗 Create PeerConnection
  // const createPeerConnection = (stream: MediaStream) => {
  //   const pc = new RTCPeerConnection({
  //     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  //   });

  //   // Add local tracks
  //   stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  //   // Create remote stream
  //   const remote = new MediaStream();
  //   setRemoteStream(remote);

  //   // On remote track
  //   // pc.ontrack = (event) => {
  //   //   event.streams[0].getTracks().forEach((track) => {
  //   //     remote.addTrack(track);

  //   //     // Listen for remote camera/mute changes
  //   //     track.onmute = () => setRemoteStream(new MediaStream([...remote.getTracks()]));
  //   //     track.onunmute = () => setRemoteStream(new MediaStream([...remote.getTracks()]));
  //   //   });
  //   // };

  //   pc.ontrack = (event) => {
  //     const [stream] = event.streams;
  //     if (!stream) return;
  //     setRemoteStream(stream);
  //   };

  //   // ICE candidates
  //   pc.onicecandidate = (event) => {
  //     if (!event.candidate) return;
  //     const targetRef = isHost ? callerCandidatesRef : calleeCandidatesRef;
  //     push(targetRef, event.candidate.toJSON());
  //   };

  //   pcRef.current = pc;
  //   return pc;
  // };

  const createPeerConnection = (stream: MediaStream) => {
  if (pcRef.current) return pcRef.current;

  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  pc.ontrack = (event) => {
    const [stream] = event.streams;
    if (stream) setRemoteStream(stream);
  };

  pc.onicecandidate = (event) => {
    if (!event.candidate) return;
    const targetRef = isHost ? callerCandidatesRef : calleeCandidatesRef;
    push(targetRef, event.candidate.toJSON());
  };

  pcRef.current = pc;
  return pc;
};


  // 🧑‍💻 Host
  const createOffer = async () => {
    const stream = await getMedia();
    const pc = createPeerConnection(stream);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await set(offerRef, offer);

    // Listen for answer
    onValue(answerRef, async (snapshot) => {
      const answer = snapshot.val();
      if (!answer || pc.currentRemoteDescription) return;
      await pc.setRemoteDescription(answer);
    });

    // Listen for callee ICE
    onChildAdded(calleeCandidatesRef, (snapshot) => {
      pc.addIceCandidate(snapshot.val());
    });
  };

  // 🙋 Guest
 const joinMeeting = async () => {
  const stream = await getMedia();

  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  pcRef.current = pc;

  // Remote stream
  const remote = new MediaStream();
  setRemoteStream(remote);

  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remote.addTrack(track);
    });
  };

  pc.onicecandidate = (event) => {
    if (!event.candidate) return;
    push(calleeCandidatesRef, event.candidate.toJSON());
  };

  // 🔥 Wait for offer FIRST
  onValue(offerRef, async (snapshot) => {
    const offer = snapshot.val();
    if (!offer || pc.currentRemoteDescription) return;

    await pc.setRemoteDescription(offer);

    // 🔥 Add local tracks AFTER remote description
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await set(answerRef, answer);
  });

  onChildAdded(callerCandidatesRef, (snapshot) => {
    pc.addIceCandidate(snapshot.val());
  });
};


  // 🚪 Leave meeting
  const leaveMeeting = async () => {
    // Close PC
    pcRef.current?.close();
    pcRef.current = null;

    // Stop tracks
    localStream?.getTracks().forEach((t) => t.stop());
    remoteStream?.getTracks().forEach((t) => t.stop());

    // Clean only your data
    if (isHost) {
      await remove(callerCandidatesRef);
      await remove(offerRef);
    } else {
      await remove(calleeCandidatesRef);
      await remove(answerRef);
    }

    setLocalStream(null);
    setRemoteStream(null);
  };

  return { localStream, remoteStream, createOffer, joinMeeting, leaveMeeting };
};
