import React, { createContext, useState } from "react";

export type Participant = {
  id: string;
  name: string;
  isMuted: boolean;
  isCameraOn: boolean;
  isLocal: boolean;
};

interface MeetingContextType {
  stream: MediaStream | null;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;

  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;

  meetingId: string | null;
  createMeeting: () => string;
  joinMeeting: (id: string) => void;
}

export const MeetingContext = createContext<MeetingContextType | null>(null);

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [meetingId, setMeetingId] = useState<string | null>(null);

  const createMeeting = () => {
    const id = crypto.randomUUID();
    setMeetingId(id);
    return id;
  };

  const joinMeeting = (id: string) => {
    setMeetingId(id);
  };

  return (
    <MeetingContext.Provider
      value={{
        stream,
        setStream,
        participants,
        setParticipants,
        meetingId,
        createMeeting,
        joinMeeting,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
