import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiLogOut } from "react-icons/fi";
import { MeetingContext } from "../../hooks/context/MeetingContext";
import ConfirmDialog from "../../components/ConfirmDialog";

const Meeting = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();

  const meetingContext = useContext(MeetingContext);
  if (!meetingContext) return null;

  const { stream, setStream } = meetingContext;

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  /* ----------------------------------------------------
     Ensure we ALWAYS have a live media stream
  ---------------------------------------------------- */
  useEffect(() => {
    const ensureStream = async () => {
      if (
        !stream ||
        !stream.active ||
        stream.getVideoTracks().length === 0
      ) {
        console.log("🎥 Acquiring fresh media stream...");

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(newStream);
      }
    };

    ensureStream().catch(console.error);
  }, []);

  /* ----------------------------------------------------
     Attach stream to video element
  ---------------------------------------------------- */
  useEffect(() => {
    if (!videoRef.current || !stream) return;

    videoRef.current.srcObject = stream;
    videoRef.current.muted = true;

    videoRef.current
      .play()
      .catch((err) => console.warn("Autoplay blocked:", err));
  }, [stream]);

  /* ----------------------------------------------------
     Controls
  ---------------------------------------------------- */
  const toggleMic = () => {
    if (!stream) return;
    const track = stream.getAudioTracks()[0];
    if (!track) return;

    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  const toggleCamera = () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (!track) return;

    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  };

  const leaveMeeting = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    navigate("/");
  };

  /* ----------------------------------------------------
     Debug (optional – safe to remove later)
  ---------------------------------------------------- */
  useEffect(() => {
    if (!stream) return;
    console.log(
      "🧪 Stream tracks:",
      stream.getTracks().map((t) => ({
        kind: t.kind,
        enabled: t.enabled,
        state: t.readyState,
      }))
    );
  }, [stream]);

  return (
    <>
      <div className="h-screen bg-gray-900 flex flex-col">
        {/* VIDEO AREA */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center text-white bg-black/60">
                Camera Off
              </div>
            )}
          </div>
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
        onConfirm={leaveMeeting}
      />
    </>
  );
};

export default Meeting;
