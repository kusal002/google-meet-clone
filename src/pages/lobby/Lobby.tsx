import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from "react-icons/fi";
import { MeetingContext } from "../../hooks/context/MeetingContext";

const Lobby = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const meetingContext = useContext(MeetingContext);
  if (!meetingContext) return null;

  const { stream, setStream } = meetingContext;
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const stopMedia = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Request camera + mic permissions on mount
  useEffect(() => {
    let activeStream: MediaStream;

    async function getMedia() {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(activeStream);

        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
          videoRef.current.play();
        }
      } catch {
        setError("Camera or microphone permission denied.");
      }
    }

    getMedia();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      setStream(null);
    };
  }, []);

  // Toggle camera
  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraOn(videoTrack.enabled);
      }
    }
  };

  // Toggle mic
  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicOn(audioTrack.enabled);
      }
    }
  };

  return (
    <div className="min-h-screen from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Meeting Lobby</h1>
        <button
          onClick={() => {
            stopMedia();
            navigate("/");
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          Back
        </button>
      </header>

      {/* Meeting Info */}
      <p className="text-gray-600 mb-6">
        Meeting Code:{" "}
        <span className="font-mono text-indigo-600">{meetingId}</span>
      </p>

      {/* Video Preview */}
      <div className="relative w-full max-w-md rounded-xl overflow-hidden bg-black aspect-video mb-6">
        {error ? (
          <div className="flex items-center justify-center h-full text-white">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${
              !cameraOn ? "opacity-40" : ""
            }`}
            autoPlay
            muted
          />
        )}

        {/* Overlay mic/camera status */}
        {!cameraOn && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-xl bg-black/40">
            Camera Off
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={toggleMic}
          className={`p-3 rounded-full border ${
            micOn
              ? "bg-green-500 border-green-600 text-white"
              : "bg-red-500 border-red-600 text-white"
          }`}
        >
          {micOn ? <FiMic size={20} /> : <FiMicOff size={20} />}
        </button>

        <button
          onClick={toggleCamera}
          className={`p-3 rounded-full border ${
            cameraOn
              ? "bg-green-500 border-green-600 text-white"
              : "bg-red-500 border-red-600 text-white"
          }`}
        >
          {cameraOn ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
        </button>

        <button
          onClick={() => {
            navigate(`/meeting/${meetingId}`);
          }}
          className="ml-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Join Meeting
        </button>
      </div>

      {/* Optional: instructions */}
      {error && (
        <p className="text-red-500 text-sm">
          Enable camera/mic to join the meeting
        </p>
      )}
    </div>
  );
};

export default Lobby;
