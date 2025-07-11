import { toast } from "sonner";

const useShare = () => {
  const canShare = !!navigator.share;

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

  const share = async (url: string, title: string, description: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        copy(description);
      }
    } else {
      console.error("Web Share API not supported");
      copy(url);
    }
  };

  return { copy, share, canShare };
};

export default useShare;
