"use client";
import { Post } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function page() {
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
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group bg-card hover:bg-accent rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
            >
              <div className="aspect-square relative overflow-hidden">
                <Image
                  alt={post.prompt}
                  src={post.url}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4 bg-gradient-to-b from-background/80 to-background border-t border-border/50">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Prompt
                  </p>
                  <p className="text-sm font-medium text-primary line-clamp-2">
                    {post.prompt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
