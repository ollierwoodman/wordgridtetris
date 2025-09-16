import { cn } from "@sglara/cn";
import { useGameSounds } from "../../hooks/useSounds";

export const BigRoundButton: React.FC<{
  title: string;
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  playSound?: () => void;
  className?: string;
  disabled?: boolean;
  hasBadge?: boolean;
}> = ({ title, children, onClick, playSound, className, disabled, hasBadge }) => {
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
        "relative flex items-center justify-center bg-gray-600 dark:bg-gray-800 text-white text-base md:text-xl rounded-full aspect-square p-2 md:p-4 shadow-xl/20 dark:shadow-xl/40 cursor-pointer hover:opacity-80 transition-opacity",
        className,
        disabled && "opacity-50 cursor-not-allowed hover:opacity-50"
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {hasBadge && (
        <div className="absolute -top-0.5 -right-0.5 bg-red-500 rounded-full h-1/3 aspect-square flex items-center justify-center">
          <span className="sr-only">Unread</span>
        </div>
      )}
      {children}
    </button>
  );
};
