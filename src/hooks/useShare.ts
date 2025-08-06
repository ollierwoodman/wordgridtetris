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

  const share = async (text = "", url = "") => {
    if (canShare) {
      try {
        // using text and url with space as per https://developer.apple.com/forums/thread/724641
        await navigator.share({
          text: text,
          url: `${url} `,
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
