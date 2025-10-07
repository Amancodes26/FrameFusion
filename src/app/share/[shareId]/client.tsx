"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Share2, ArrowLeft, Calendar, Palette, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SharedPost {
  id: string;
  prompt: string;
  url: string;
  seed: number;
  model: string;
  createdAt: Date;
  sharedAt: Date | null;
  User: {
    name: string | null;
    image: string | null;
  };
}

interface SharedImageClientProps {
  post: SharedPost;
}

export default function SharedImageClient({ post }: SharedImageClientProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const downloadImage = async () => {
    if (!post) return;
    
    try {
      const response = await fetch(post.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `framefusion-${post.prompt.slice(0, 50).replace(/[^a-zA-Z0-9]/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch {
      toast.error("Failed to download image");
    }
  };

  const shareImage = async () => {
    const shareUrl = window.location.href;
    
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: `AI Generated Art: ${post?.prompt}`,
          text: `Check out this amazing AI-generated image created with FrameFusion!`,
          url: shareUrl,
        });
      } catch {
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="p-6">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to FrameFusion
        </Link>
      </nav>

      <div className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Image Section */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <Image
                  src={post.url}
                  alt={post.prompt}
                  fill
                  className={`object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
                  </div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-3"
              >
                <Button
                  onClick={downloadImage}
                  className="flex-1 bg-card/50 hover:bg-accent text-primary backdrop-blur-sm border border-border"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={shareImage}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90 text-white"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </motion.div>
            </div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  {/* Creator Info */}
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="border-2 border-border">
                      <AvatarImage src={post.User.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                        {post.User.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-primary font-medium">{post.User.name}</p>
                      <p className="text-muted-foreground text-sm">Created with FrameFusion</p>
                    </div>
                  </div>

                  {/* Prompt */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Palette className="w-4 h-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">Prompt</span>
                    </div>
                    <p className="text-primary text-lg leading-relaxed bg-card/30 p-4 rounded-lg border border-border/50">
                      {post.prompt}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Hash className="w-4 h-4" />
                        <span>Model</span>
                      </div>
                      <p className="text-primary font-medium">{post.model}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Created</span>
                      </div>
                      <p className="text-primary font-medium">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Share2 className="w-4 h-4" />
                        <span>Shared</span>
                      </div>
                      <p className="text-primary font-medium">
                        {post.sharedAt ? new Date(post.sharedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="bg-gradient-to-r from-pink-500/10 to-orange-500/10 backdrop-blur-sm border-pink-500/20">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-primary mb-3">
                    Create Your Own AI Art
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Join thousands of creators using FrameFusion to bring their imagination to life
                  </p>
                  <Link href="/create">
                    <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90 text-white">
                      Start Creating
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}