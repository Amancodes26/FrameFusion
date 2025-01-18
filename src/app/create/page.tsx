"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Create() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    try {
      setLoading(true);
      const response = await fetch("api/images", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.status == 200) {
        setImage(data.url);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while generating the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-white/75 bg-clip-text text-transparent">
            Create Your Image
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into stunning visuals using our AI-powered image generation
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            <Input
              placeholder="a cat and dog marriage in India ..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              className="h-12 text-base"
            />
            <Button
              onClick={generateImage}
              disabled={!prompt || loading}
              className="h-12 px-6 font-medium"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate
                </div>
              )}
            </Button>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-destructive/10 text-destructive rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}
        </div>

        {/* Result Section */}
        <motion.div
          layout
          className="max-w-2xl mx-auto rounded-2xl overflow-hidden"
        >
          {loading && (
            <div className="aspect-square bg-card/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground animate-pulse">Creating your masterpiece...</p>
              </div>
            </div>
          )}

          {image && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden"
            >
              <img
                src={image}
                alt={prompt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white/90 text-sm line-clamp-2">{prompt}</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
