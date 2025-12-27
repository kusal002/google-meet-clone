import React, { useEffect, useRef } from "react";

interface ParticipantTileProps {
  participant: any;
  stream: MediaStream | null;
}

const ParticipantTile: React.FC<ParticipantTileProps> = ({ participant, stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (stream && participant.isCameraOn) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.srcObject = null; // camera off
      }
    }
  }, [stream, participant.isCameraOn]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted={participant.isLocal}
        playsInline
        className="h-full w-full object-cover"
      />
      {!participant.isCameraOn && (
        <div className="absolute inset-0 flex items-center justify-center text-white bg-black/50">
          Camera Off
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 rounded-md text-sm text-white">
        {participant.name}
      </div>
    </div>
  );
};

export default ParticipantTile;
