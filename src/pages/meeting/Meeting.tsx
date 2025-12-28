import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiLogOut } from "react-icons/fi";
import { MeetingContext } from "../../hooks/context/MeetingContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import ParticipantTile from "../../components/ParticipantTile";

const Meeting = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();

  const meetingContext = useContext(MeetingContext);
  if (!meetingContext) return null;

  const { stream, setStream, participants, setParticipants } = meetingContext;
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const localParticipant = participants.find((p) => p.isLocal);

  // Ensure tracks ON when meeting starts
  useEffect(() => {
    if (!stream) return;

    stream.getVideoTracks().forEach((t) => (t.enabled = true));
    stream.getAudioTracks().forEach((t) => (t.enabled = true));
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      setStream(null);
      setParticipants([]);
    };
  }, []);

  const toggleMic = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));

    setParticipants((prev) =>
      prev.map((p) =>
        p.isLocal ? { ...p, isMuted: !p.isMuted } : p
      )
    );
  };

  const toggleCamera = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));

    setParticipants((prev) =>
      prev.map((p) =>
        p.isLocal ? { ...p, isCameraOn: !p.isCameraOn } : p
      )
    );
  };

  const leaveMeeting = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setParticipants([]);
    navigate("/");
  };

  return (
    <>
      <div className="h-screen bg-gray-900 flex flex-col">
        <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map((p) => (
            <ParticipantTile
              key={p.id}
              participant={p}
              stream={p.isLocal ? stream : null}
            />
          ))}
        </div>

        <div className="h-20 bg-gray-800 flex justify-center gap-6 items-center">
          <button
            onClick={toggleMic}
            className={`p-4 rounded-full ${
              localParticipant?.isMuted ? "bg-red-600" : "bg-gray-700"
            } text-white`}
          >
            {localParticipant?.isMuted ? <FiMicOff /> : <FiMic />}
          </button>

          <button
            onClick={toggleCamera}
            className={`p-4 rounded-full ${
              !localParticipant?.isCameraOn ? "bg-red-600" : "bg-gray-700"
            } text-white`}
          >
            {localParticipant?.isCameraOn ? <FiVideo /> : <FiVideoOff />}
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
