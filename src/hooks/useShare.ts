import { toast } from "sonner";

const useShare = () => {
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
  const share = async (text = "", url = "", title = "") => {
    if (canShare) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        void copy(text);
      }
    } else {
      console.error("Web Share API not supported");
      void copy(url);
    }
  };

  return { copy, share, canShare };
};

export default useShare;
