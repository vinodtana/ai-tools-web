import React, { useMemo, useState } from "react";
import { Share2, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

type ShareModalProps = {
  className?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link";
  buttonLabel?: string;
  show?: boolean;
  handleClose?: () => void;
  url?: string;
  title?: string;
  onCopyClick?: () => void;
};

const ShareModal: React.FC<ShareModalProps> = ({
  className,
  buttonVariant = "outline",
  buttonLabel = "Share",
  show,
  handleClose,
  url,
  title = "Share this page",
  onCopyClick,
}) => {
  const defaultUrl = useMemo(() => {
    if (typeof window !== "undefined") return window.location.href;
    return "";
  }, []);

  const shareUrl = url || defaultUrl;

  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    if (onCopyClick) {
      onCopyClick();
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(false);
    }
  };

  const networks = [
    {
      key: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      bg: "bg-[#1877F2]",
      iconSrc: "https://cdn.simpleicons.org/facebook/FFFFFF",
    },
    {
      key: "twitter",
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}`,
      bg: "bg-[#1DA1F2]",
      iconSrc: "https://cdn.simpleicons.org/twitter/FFFFFF",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      bg: "bg-[#0A66C2]",
      iconSrc: "https://cdn.simpleicons.org/linkedin/FFFFFF",
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        shareUrl
      )}`,
      bg: "bg-[#25D366]",
      iconSrc: "https://cdn.simpleicons.org/whatsapp/FFFFFF",
    },
    {
      key: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`,
      bg: "bg-[#26A5E4]",
      iconSrc: "https://cdn.simpleicons.org/telegram/FFFFFF",
    },
    {
      key: "reddit",
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(
        shareUrl
      )}`,
      bg: "bg-[#FF4500]",
      iconSrc: "https://cdn.simpleicons.org/reddit/FFFFFF",
    },
    {
      key: "email",
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(
        "Check this out"
      )}&body=${encodeURIComponent(shareUrl)}`,
      bg: "bg-gray-600",
      iconSrc: "",
    },
  ];

  const isControlled = typeof show !== "undefined";

  return (
    <Dialog
      open={isControlled ? show : undefined}
      onOpenChange={isControlled ? (open) => !open && handleClose?.() : undefined}
    >
      {!isControlled && (
        <DialogTrigger asChild>
          <Button
            variant={buttonVariant}
            className={
              className || "border border-black text-black hover:bg-black/5"
            }
            aria-label="Share"
            title="Share"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {buttonLabel}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Choose a platform to share the current URL.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-row flex-nowrap gap-4 overflow-x-auto pb-2">
          {networks.map((n) => (
            <a
              key={n.key}
              href={n.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-12 h-12 rounded-full ${n.bg} text-white flex items-center justify-center`}
              >
                {n.key === "email" ? (
                  <Mail className="w-6 h-6" />
                ) : (
                  <img
                    src={n.iconSrc}
                    alt={`${n.label} icon`}
                    className="w-6 h-6"
                    loading="lazy"
                  />
                )}
              </div>
              <span className="text-xs">{n.label}</span>
            </a>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <Input value={shareUrl} readOnly className="flex-1" />
          <Button onClick={copyToClipboard} aria-label="Copy URL">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" /> Copied
              </>
            ) : (
              "Copy"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
