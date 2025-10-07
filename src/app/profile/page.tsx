"use client";
import { Post } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { ShareModal } from "@/components/ui/share-modal";

export default function Page() {
  const { data: session, status } = useSession();
  const [loading, setloading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const openShareModal = (post: Post) => {
    setSelectedPost(post);
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
    setSelectedPost(null);
  };

  const fetchPosts = async () => {
    try {
      setloading(true);
      const response = await fetch("/api/images");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `framefusion-${prompt.slice(0, 50).replace(/[^a-zA-Z0-9]/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download image");
      console.error('Download error:', error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchPosts();
    } else {
      setloading(false);
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
          <h2 className="text-2xl font-bold text-primary">Access Required</h2>
          <p className="text-muted-foreground">
            Please sign in to view your profile and creations.
          </p>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-400">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">
              Loading your creations...
            </p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No creations yet. Start creating!</p>
              <Button asChild className="mt-4 bg-gradient-to-r from-blue-600 to-blue-400">
                <Link href="/create">Create New</Link>
              </Button>
            </div>
          ) : (
            posts.map((post, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={post.id}
                className="group bg-card/50 backdrop-blur-sm hover:bg-accent/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    alt={post.prompt}
                    src={post.url}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Action buttons overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                    <Button
                      onClick={() => downloadImage(post.url, post.prompt)}
                      size="sm"
                      className="bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => openShareModal(post)}
                      size="sm"
                      className="bg-gradient-to-r from-pink-600 to-orange-500 hover:opacity-90 text-white backdrop-blur-sm"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-b from-background/90 to-background border-t border-border/50">
                  <div className="space-y-2">
                    <p className="text-xs text-primary/80 uppercase tracking-wider font-medium">
                      Prompt
                    </p>
                    <p className="text-sm font-medium text-primary/90 line-clamp-2">
                      {post.prompt}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
      
      {/* Share Modal */}
      {selectedPost && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={closeShareModal}
          postId={selectedPost.id}
          prompt={selectedPost.prompt}
          imageUrl={selectedPost.url}
        />
      )}
    </div>
  );
}
