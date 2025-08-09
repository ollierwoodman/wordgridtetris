import React from "react";
import {
  CheckSquareIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  Volume2Icon,
  VolumeOffIcon,
  XSquareIcon,
} from "lucide-react";
import { useGameSounds, useSoundContext } from "../../hooks/useSounds";
import { useTheme } from "../../hooks/useTheme";
import { useMatomoOptOut } from "../../hooks/useTrackingOptOut";

const Settings: React.FC = () => {
  const { theme, cycleTheme, getNextTheme } = useTheme();
  const { isMuted, setIsMuted } = useSoundContext();
  const { playMenuClick } = useGameSounds();

  const handleThemeChange = () => {
    playMenuClick();
    cycleTheme();
  };

  const handleSoundToggle = () => {
    playMenuClick({
      forceSoundEnabled: true,
    });
    setIsMuted(!isMuted);
  };

  const { isOptedOut, setOptedOut } = useMatomoOptOut();
  const handleTrackingToggle = () => {
    playMenuClick();
    setOptedOut(!isOptedOut);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Theme Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center dark:text-gray-200 w-full gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold">Theme</h3>
            <p className="text-gray-800 dark:text-gray-300">Change theme</p>
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
      {/* Sound Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center dark:text-gray-200 w-full gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold">Sound</h3>
            <p className="text-gray-800 dark:text-gray-300">
              Turn sound on/off
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
      {/* Tracking Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center dark:text-gray-200 w-full gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold">Tracking</h3>
            <p className="text-gray-800 dark:text-gray-300">
              Allow us track gameplay
            </p>
          </div>
          {isOptedOut ? (
            <XSquareIcon className="size-8 ml-auto" />
          ) : (
            <CheckSquareIcon className="size-8 ml-auto" />
          )}
        </div>
        <button
          type="button"
          title="Toggle tracking"
          onClick={handleTrackingToggle}
          className="cursor-pointer rounded-full w-full bg-gray-200 text-gray-800 hover:opacity-80 px-4 py-2"
        >
          {isOptedOut ? "Opt into tracking" : "Opt out of tracking"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
