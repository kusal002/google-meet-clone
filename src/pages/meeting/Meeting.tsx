import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiLogOut } from "react-icons/fi";
import { MeetingContext } from "../../hooks/context/MeetingContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import ParticipantTile from "../../components/ParticipantTile";

const Meeting = () => {
  const navigate = useNavigate();

  const meetingContext = useContext(MeetingContext);
  if (!meetingContext) return null;

  const { stream, setStream, participants, setParticipants } = meetingContext;

  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const localParticipant = participants.find((p) => p.isLocal);

  // Toggle microphone
  const toggleMic = () => {
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setParticipants((prev) =>
      prev.map((p) =>
        p.isLocal ? { ...p, isMuted: !p.isMuted } : p
      )
    );
  };

  // Toggle camera
  const toggleCamera = () => {
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setParticipants((prev) =>
      prev.map((p) =>
        p.isLocal ? { ...p, isCameraOn: !p.isCameraOn } : p
      )
    );
  };

  // Leave meeting
  const leaveMeeting = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setParticipants([]);
    navigate("/");
  };

  return (
    <>
      <div className="h-screen bg-gray-900 flex flex-col">
        {/* VIDEO GRID */}
        <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map((p) => (
            <ParticipantTile
              key={p.id}
              participant={p}
              stream={p.isLocal ? stream : null}
            />
          ))}
        </div>

        {/* CONTROL BAR */}
        <div className="h-20 bg-gray-800 flex items-center justify-center gap-6">
          {/* Mic */}
          <button
            onClick={toggleMic}
            className={`p-4 rounded-full ${
              localParticipant?.isMuted ? "bg-red-600" : "bg-gray-700"
            } text-white`}
          >
            {localParticipant?.isMuted ? (
              <FiMicOff size={20} />
            ) : (
              <FiMic size={20} />
            )}
          </button>

          {/* Camera */}
          <button
            onClick={toggleCamera}
            className={`p-4 rounded-full ${
              !localParticipant?.isCameraOn ? "bg-red-600" : "bg-gray-700"
            } text-white`}
          >
            {localParticipant?.isCameraOn ? (
              <FiVideo size={20} />
            ) : (
              <FiVideoOff size={20} />
            )}
          </button>

          {/* Leave */}
          <button
            onClick={() => setShowLeaveDialog(true)}
            className="p-4 rounded-full bg-red-600 text-white"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>

      {/* Confirm Leave Dialog */}
      <ConfirmDialog
        open={showLeaveDialog}
        title="Leave Meeting"
        message="Are you sure you want to leave the meeting? Your camera and microphone will be disconnected."
        confirmText="Leave"
        cancelText="Stay"
        onCancel={() => setShowLeaveDialog(false)}
        onConfirm={leaveMeeting}
      />
    </>
  );
};

export default Meeting;
