"use client";
import { useState } from "react";
import { containsRestrictedContent } from "@/lib/content-safety"; // Updated import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";
import { toast } from "sonner";
import type { ImageModel } from "@/types/image";
import { MODEL_DESCRIPTIONS } from "@/types/image";
import { useSession } from "next-auth/react";

export default function CreatePage() {
  const { data: session, update: updateSession } = useSession();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<ImageModel>("flux");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!session?.user) {
      toast.error("Please sign in to generate images");
      return;
    }

    if (session.user.credits <= 0) {
      toast.error("Insufficient credits. Please upgrade your plan.");
      return;
    }

    if (!prompt) {
      toast.info("Please enter a prompt to generate an image");
      return;
    }

    const { isRestricted, matches } = containsRestrictedContent(prompt);
    if (isRestricted) {
      setError(`Your prompt contains inappropriate content: ${matches.join(", ")}`);
      toast.error("NSFW content is not allowed");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt,
          model,
          width: 1024,
          height: 1024
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate image");
      }

      setImage(data.url);
      // Update session with new credits
      await updateSession();
      toast.success("Image generated successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12 max-w-5xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            AI Image Creation
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Transform your ideas into stunning visuals using our advanced AI image generation
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10"
          >
            <div className="flex gap-3">
              <Input
                placeholder="Describe your imagination..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                className="h-14 text-base bg-black/40 border-white/10 focus:border-white/20 text-white placeholder:text-gray-400"
              />
              <Select
                value={model}
                onValueChange={(value: ImageModel) => setModel(value)}
                disabled={loading}
              >
                <SelectTrigger className="h-14 w-[140px] bg-black/40 border-white/10 focus:border-white/20">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {Object.entries(MODEL_DESCRIPTIONS).map(([key, desc]) => (
                    <SelectItem key={key} value={key} className="hover:bg-white/5">
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{key}</span>
                        <Info className="h-4 w-4 text-gray-400" title={desc} />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!prompt || loading}
              className="w-full h-14 px-6 font-medium bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/10 transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating Your Masterpiece...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Generate with {model}
                </div>
              )}
            </Button>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center backdrop-blur-sm"
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
            <div className="aspect-square bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                <p className="text-gray-400 animate-pulse">
                  Creating your masterpiece...
                </p>
              </div>
            </div>
          )}

          {image && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square rounded-2xl overflow-hidden border border-white/10"
            >
              <img
                src={image}
                alt={prompt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm bg-black/30">
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
