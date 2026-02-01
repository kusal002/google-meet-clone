import React, { useEffect, useRef } from "react";

interface ParticipantTileProps {
  participant: {
    isLocal: boolean;
    isCameraOn: boolean;
    name: string;
  };
  stream: MediaStream | null;
}

const ParticipantTile: React.FC<ParticipantTileProps> = ({
  participant,
  stream,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {}); // autoplay safety
    } else {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={participant.isLocal}
        className="h-full w-full object-cover"
      />

      {/* Camera Off Overlay (UI only) */}
      {!participant.isCameraOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
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
