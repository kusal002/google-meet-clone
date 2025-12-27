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
}

export const MeetingContext = createContext<MeetingContextType | null>(null);

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      name: "Kusal (You)",
      isMuted: false,
      isCameraOn: true,
      isLocal: true,
    },
    {
      id: "2",
      name: "Alex",
      isMuted: true,
      isCameraOn: false,
      isLocal: false,
    },
    {
      id: "3",
      name: "Riya",
      isMuted: false,
      isCameraOn: true,
      isLocal: false,
    },
  ]);

  return (
    <MeetingContext.Provider
      value={{
        stream,
        setStream,
        participants,
        setParticipants,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};

