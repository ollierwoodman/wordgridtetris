import React from "react";
import {
  MonitorIcon,
  MoonIcon,
  SunIcon,
  Volume2Icon,
  VolumeOffIcon,
} from "lucide-react";
import { useGameSounds, useSoundContext } from "../../hooks/sounds";
import { useTheme } from "../../hooks/useTheme";

const Settings: React.FC = () => {
  const { theme, cycleTheme, getNextTheme } = useTheme();
  const { isMuted, setIsMuted } = useSoundContext();
  const { playMenuClick } = useGameSounds();

  const handleThemeChange = () => {
    playMenuClick();
    cycleTheme();
  };

  const handleSoundToggle = () => {
    playMenuClick();
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4">
        {/* Theme Section */}
        <div className="flex items-center dark:text-gray-200 w-full gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold">Theme</h3>
            <p className="text-gray-800 dark:text-gray-300">
              Set theme to light, dark, or system
            </p>
          </div>
          {theme === "light" && <SunIcon className="size-8 ml-auto" />}
          {theme === "dark" && <MoonIcon className="size-8 ml-auto" />}
          {theme === "system" && <MonitorIcon className="size-8 ml-auto" />}
        </div>
        <button
          type="button"
          title="Cycle through themes"
          onClick={handleThemeChange}
          className="cursor-pointer rounded-full w-full bg-gray-200 text-gray-800 hover:opacity-80 px-4 py-2"
        >
          {getNextTheme(theme) === "light" && "Switch to light theme"}
          {getNextTheme(theme) === "dark" && "Switch to dark theme"}
          {getNextTheme(theme) === "system" && "Revert to system theme"}
        </button>
      </div>
      <div className="flex flex-col items-center gap-4">
        {/* Sound Section */}
        <div className="flex items-center dark:text-gray-200 w-full gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold">Sound</h3>
            <p className="text-gray-800 dark:text-gray-300">
              Toggle sound effects on or off
            </p>
          </div>
          {isMuted ? (
            <VolumeOffIcon className="size-8 ml-auto" />
          ) : (
            <Volume2Icon className="size-8 ml-auto" />
          )}
        </div>
        <button
          type="button"
          title="Toggle sound"
          onClick={handleSoundToggle}
          className="cursor-pointer rounded-full w-full bg-gray-200 text-gray-800 hover:opacity-80 px-4 py-2"
        >
          {isMuted ? "Unmute sound" : "Mute sound"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
