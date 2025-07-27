import { toast } from "sonner";
import { GOAL_IDS, useTrackMatomoGoalById } from "./useTrackGoals";

const useShare = () => {
  const trackGoal = useTrackMatomoGoalById();

  const canShare = !!navigator.share as boolean;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text).then(() => {
        toast.success("Copied to clipboard", {
          description: "Share the link to your friends",
        });
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy text to clipboard");
    }
  };

  const share = async (text = "", url = "") => {
    if (canShare) {
      try {
        // using title and text to cater to iOS as per https://adactio.com/journal/15972
        await navigator.share({
          title: text,
          url: url,
        }).then(() => {
          trackGoal(GOAL_IDS.CLICKED_SHARE_BUTTON);
        });
      } catch (error) {
        console.error("Error sharing:", error);
        void copy(text);
      }
    } else {
      console.error("Web Share API not supported");
      void copy(url).then(() => {
        trackGoal(GOAL_IDS.CLICKED_COPY_BUTTON);
      });
    }
  };

  return { copy, share, canShare };
};

export default useShare;
