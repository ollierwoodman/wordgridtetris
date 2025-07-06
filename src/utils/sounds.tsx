import { useState } from "react";
import type { ReactNode } from "react";
import { SoundContext } from "../hooks/sounds";

// Sound provider component
interface SoundProviderProps {
  children: ReactNode;
}

export function SoundProvider({ children }: SoundProviderProps) {
  const initialIsMuted = localStorage.getItem("isMuted") === "true";
  const [isMuted, setIsMuted] = useState<boolean>(initialIsMuted);

  const handleMuteChange = (newIsMuted: boolean) => {
    setIsMuted(newIsMuted);
    localStorage.setItem("isMuted", newIsMuted.toString());
  };

  return (
    <SoundContext.Provider value={{ isMuted, setIsMuted: handleMuteChange }}>
      {children}
    </SoundContext.Provider>
  );
}
