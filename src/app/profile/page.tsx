"use client";
import { Post } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [loading, setloading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const fetchPosts = async () => {
    try {
      setloading(true);
      const response = await fetch("/api/images");
      const data = await response.json();
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
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
          {posts.map((post, index) => (
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
          ))}
        </motion.div>
      )}
    </div>
  );
}
