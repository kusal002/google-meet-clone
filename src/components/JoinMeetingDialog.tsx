import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface JoinMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinMeetingDialog: React.FC<JoinMeetingDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [meetingCode, setMeetingCode] = useState("");
  const navigate = useNavigate();
  const isDisabled = meetingCode.trim() === "";


    useEffect(() => {
    if (!isOpen) {
      setMeetingCode("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleJoin = () => {
    if (!meetingCode.trim()) return;

    navigate(`/lobby`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-semibold">Join a meeting</h2>

        <p className="mt-2 text-gray-600">
          Enter a meeting link or code to join instantly.
        </p>

        <input
          type="text"
          placeholder="Meeting code or link"
          value={meetingCode}
          onChange={(e) => setMeetingCode(e.target.value)}
          className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleJoin}
            disabled={isDisabled}
            className={`rounded-lg px-4 py-2 text-white transition ${
                isDisabled
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            >
            Join meeting
            </button>

        </div>
      </div>
    </div>
  );
};

export default JoinMeetingDialog;
