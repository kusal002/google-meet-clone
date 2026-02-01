import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiLogOut } from "react-icons/fi";
import ConfirmDialog from "../../components/ConfirmDialog";
import ParticipantTile from "../../components/ParticipantTile";
import { useWebRTC } from "../../hooks/webrtc/useWebRTC";

const Meeting = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();

  if (!meetingId) return null;

  // ✅ Determine if host based on hash
  const isHost = !window.location.hash.includes("join");

  const { localStream, remoteStream, createOffer, joinMeeting, leaveMeeting } =
    useWebRTC({ meetingId, isHost });

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const didLeaveManually = useRef(false);

  /* ----------------------------------------------------
     HOST vs JOINER
  ---------------------------------------------------- */
  useEffect(() => {
    if (isHost) {
      createOffer();
    } else {
      joinMeeting();
    }

    return () => {
      // cleanup ONLY if user didn't click Leave
      if (!didLeaveManually.current) {
        leaveMeeting();
      }
    };
  }, [meetingId]);

  /* ----------------------------------------------------
     Participants (LOCAL + REMOTE)
  ---------------------------------------------------- */
  const participants = [
    {
      id: "local",
      name: "You",
      isMuted: micOn,
      isCameraOn: cameraOn,
      isLocal: true,
      stream: localStream,
    },
    {
      id: "remote",
      name: "Guest",
      isMuted: false,
      isCameraOn:
        remoteStream?.getVideoTracks().some((track) => track.enabled) ?? false,
      isLocal: false,
      stream: remoteStream,
    },
  ];

  /* ----------------------------------------------------
     Controls
  ---------------------------------------------------- */
  const toggleMic = () => {
    if (!localStream) return;
    const track = localStream.getAudioTracks()[0];
    if (!track) return;

    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  const toggleCamera = () => {
    if (!localStream) return;
    const track = localStream.getVideoTracks()[0];
    if (!track) return;

    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  };

 const handleLeave = () => {
  didLeaveManually.current = true;
  navigate("/");
  leaveMeeting(); // fire-and-forget
};


  return (
    <>
      <div className="h-screen bg-gray-900 flex flex-col">
        {/* PARTICIPANTS GRID */}
        <div className="flex-1 grid grid-cols-2 gap-4 p-4">
          {participants.map((p) => (
            <ParticipantTile key={p.id} participant={p} stream={p.stream} />
          ))}
        </div>

        {/* CONTROLS */}
        <div className="h-20 bg-gray-800 flex justify-center gap-6 items-center">
          <button
            onClick={toggleMic}
            className={`p-4 rounded-full ${
              micOn ? "bg-gray-700" : "bg-red-600"
            } text-white`}
          >
            {micOn ? <FiMic /> : <FiMicOff />}
          </button>

          <button
            onClick={toggleCamera}
            className={`p-4 rounded-full ${
              cameraOn ? "bg-gray-700" : "bg-red-600"
            } text-white`}
          >
            {cameraOn ? <FiVideo /> : <FiVideoOff />}
          </button>

          <button
            onClick={() => setShowLeaveDialog(true)}
            className="p-4 rounded-full bg-red-600 text-white"
          >
            <FiLogOut />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showLeaveDialog}
        title="Leave Meeting"
        message="Camera and microphone will be disconnected."
        confirmText="Leave"
        cancelText="Stay"
        onCancel={() => setShowLeaveDialog(false)}
        onConfirm={handleLeave}
      />
    </>
  );
};

export default Meeting;
