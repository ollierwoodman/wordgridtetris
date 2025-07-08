import { cn } from "@sglara/cn";
import { useGameSounds } from "../../hooks/sounds";

export const BigRoundButton: React.FC<{
  title: string;
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  playSound?: () => void;
  className?: string;
  disabled?: boolean;
}> = ({ title, children, onClick, playSound, className, disabled }) => {
  const { playMenuClick } = useGameSounds();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (playSound) {
      playSound();
    } else {
      playMenuClick();
    }
    onClick(e);
  };

  return (
    <button
      title={title}
      className={cn(
        "flex items-center justify-center bg-gray-600 dark:bg-gray-800 text-white rounded-full p-4 shadow-xl/20 dark:shadow-xl/40 cursor-pointer hover:opacity-80 transition-opacity",
        className,
        disabled && "opacity-50 cursor-not-allowed hover:opacity-50"
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
