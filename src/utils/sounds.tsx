import { useIsMuted } from "../hooks/useLocalStorage";
import { SoundContext } from "../hooks/useSounds";

// Sound provider component
interface SoundProviderProps {
  children: React.ReactNode;
}

export function SoundProvider({ children }: SoundProviderProps) {
  const [isMuted, setIsMuted] = useIsMuted();

  return (
    <SoundContext.Provider value={{ isMuted, setIsMuted }}>
      {children}
    </SoundContext.Provider>
  );
}
