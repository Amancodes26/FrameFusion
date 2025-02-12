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
            Transform your ideas into stunning visuals using our AI-powered
            image generation
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex gap-2">
              <Input
                placeholder="Describe the image you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                className="h-12 text-base"
              />
              <Select
                value={model}
                onValueChange={(value: ImageModel) => setModel(value)}
                disabled={loading}
              >
                <SelectTrigger className="h-12 w-[120px]">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MODEL_DESCRIPTIONS).map(([key, desc]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{key}</span>
                        <span title={desc}>
                          <Info className="h-8 w-4" />
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!prompt || loading}
              className="w-full h-12 px-6 font-medium"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
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
                <p className="text-muted-foreground animate-pulse">
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
              className="relative aspect-square bg-card/50 backdrop-blur-sm rounded-1xl overflow-hidden"
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
