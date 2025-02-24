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
import { ModelInfoSidebar } from "@/components/ui/model-info-sidebar";

export default function CreatePage() {
  const { data: session, update: updateSession } = useSession();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<ImageModel>("flux");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ImageModel | null>(null);

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
    <div className="container max-w-5xl mx-auto px-4 py-24"> {/* Changed py-16 to py-24 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12" // Changed space-y-8 to space-y-12
      >
        {/* Header Section */}
        <div className="text-center space-y-8 mb-8"> {/* Changed space-y-7 to space-y-8 and added mb-8 */}
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 pb-2">
            Transform Your Imagination
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create stunning visuals with our state-of-the-art AI models
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl"
          >
            <div className="flex gap-3">
              <Input
                placeholder="Describe your dream image..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                className="h-12 text-base bg-black/40 border-white/10 focus:border-pink-500/50 transition-colors"
              />
              <Select
                value={model}
                onValueChange={(value: ImageModel) => {
                  setModel(value);
                  setSelectedModel(value);
                }}
                disabled={loading}
              >
                <SelectTrigger className="h-12 w-[140px] bg-black/40 border-white/10 hover:border-pink-500/50 transition-colors">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10">
                  {Object.entries(MODEL_DESCRIPTIONS).map(([key, desc]) => (
                    <SelectItem 
                      key={key} 
                      value={key} 
                      className="hover:bg-pink-500/10 focus:bg-pink-500/10 transition-colors"
                      onMouseEnter={() => setSelectedModel(key as ImageModel)}
                      onMouseLeave={() => setSelectedModel(model)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{key}</span>
                        <Info className="h-4 w-4 text-pink-500/70" aria-label={desc} />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!prompt || loading}
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating Magic...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
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
            <div className="aspect-square bg-gradient-to-br from-pink-500/5 to-purple-500/5 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-pink-500/20 border-t-pink-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin-slow" />
                </div>
                <p className="text-pink-500/70 animate-pulse font-medium">
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
              className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group"
            >
              <img
                src={image}
                alt={prompt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm bg-black/30">
                  <p className="text-white/90 text-sm line-clamp-2">{prompt}</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
        <ModelInfoSidebar selectedModel={selectedModel} />
      </motion.div>
    </div>
  );
}
//create page end