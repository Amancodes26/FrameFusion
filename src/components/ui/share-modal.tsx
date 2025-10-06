"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Copy, Check, Twitter, Facebook, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  prompt: string;
  imageUrl: string;
}

export function ShareModal({ isOpen, onClose, postId, prompt, imageUrl }: ShareModalProps) {
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        const data = await response.json();
        setShareUrl(data.shareUrl);
        toast.success("Share link created!");
      } else {
        throw new Error("Failed to create share link");
      }
    } catch (error) {
      toast.error("Failed to create share link");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareToSocial = (platform: string) => {
    if (!shareUrl) return;

    const text = `Check out this amazing AI-generated image created with FrameFusion! "${prompt}"`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(shareUrl);

    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  const handleNativeShare = async () => {
    if (!shareUrl) return;

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: `AI Generated Art: ${prompt}`,
          text: `Check out this amazing AI-generated image created with FrameFusion!`,
          url: shareUrl,
        });
      } catch {
        // User canceled or error occurred
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Your Creation
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Preview */}
            <div className="mb-6">
              <div className="aspect-square w-24 h-24 mx-auto mb-3 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={imageUrl}
                  alt={prompt}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-white/80 text-sm text-center line-clamp-2">
                {prompt}
              </p>
            </div>

            {!shareUrl ? (
              /* Generate Share Link */
              <div className="space-y-4">
                <p className="text-white/70 text-sm text-center">
                  Create a public link to share your creation with others
                </p>
                <Button
                  onClick={generateShareLink}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-600 to-orange-500 hover:opacity-90"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  ) : (
                    <Link2 className="w-4 h-4 mr-2" />
                  )}
                  {loading ? "Creating Link..." : "Create Share Link"}
                </Button>
              </div>
            ) : (
              /* Share Options */
              <div className="space-y-4">
                {/* Copy Link */}
                <div className="space-y-2">
                  <label className="text-sm text-white/70 font-medium">Share Link</label>
                  <div className="flex gap-2">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white shrink-0"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Social Media Buttons */}
                <div className="space-y-3">
                  <label className="text-sm text-white/70 font-medium">Share on Social Media</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => shareToSocial("twitter")}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                    <Button
                      onClick={() => shareToSocial("facebook")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                  </div>
                </div>

                {/* Native Share (Mobile) */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <Button
                    onClick={handleNativeShare}
                    className="w-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    More Sharing Options
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}