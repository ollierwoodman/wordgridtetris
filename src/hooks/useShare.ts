import { toast } from "sonner";
import { useTrackSharedResult } from "./useTrackGoals";

const useShare = () => {
  const trackSharedResults = useTrackSharedResult();
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

  // title is often ignored, url is by default the current page
  const share = async (text = "", url = "") => {
    if (canShare) {
      try {
        await navigator.share({
          text: text,
          url: url,
        }).then(() => {
          trackSharedResults();
        });
      } catch (error) {
        console.error("Error sharing:", error);
        void copy(text);
      }
    } else {
      console.error("Web Share API not supported");
      void copy(url).then(() => {
        trackSharedResults();
      });
    }
  };

  return { copy, share, canShare };
};

export default useShare;
