"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

const NSFW_WORDS = [
  // Explicit Content
  "nsfw", "nude", "naked", "xxx", "porn", "pornographic", "adult content",
  
  // Body Parts
  "breasts", "boobs", "tits", "nipples", "cleavage",
  "penis", "dick", "cock", "phallus",
  "vagina", "pussy", "cunt",
  "ass", "butt", "buttocks", "anus",
  "genitals", "genitalia", "private parts",
  "armpit", "crotch", "groin",
  
  // Actions & States
  "sex", "sexy", "sexual", "erotic", "aroused", "arousing",
  "fucking", "fuck", "fucked",
  "masturbate", "masturbation",
  "orgasm", "cum", "cumming",
  "horny", "aroused", "lewd",
  "strip", "striptease", "undress",
  
  // Clothing Related
  "lingerie", "thong", "bikini", "underwear",
  "topless", "bottomless", "half-naked",
  "revealing", "see-through",
  
  // Inappropriate Descriptors
  "slutty", "whore", "bitch",
  "kinky", "bondage", "bdsm",
  "seductive", "sensual", "erotic",
  
  // Age-Related (Protection)
  "small girl", "young girl", "little girl",
  "underage", "minor", "teen", "teenage",
  "loli", "shotacon", "jailbait",
  
  // Violence & Gore
  "gore", "blood", "bloody",
  "mutilation", "dismember",
  "torture", "abuse",
  
  // Phrases
  "take off clothes",
  "remove clothing",
  "without clothes",
  "no clothes",
  "barely covered",
  "barely dressed",
  "scantily clad",
  
  // Common Variations
  "n*de", "n*ked", "s*x", "p*rn",
  "b00bs", "t1ts", "d1ck",
  
  // Euphemisms
  "making love", "doing it",
  "adult fun", "adult play",
  "pleasuring", "pleasure",
  
  // Context Words
  "explicit", "inappropriate",
  "18+", "adult only", "xxx",
  "restricted content"
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')  // Remove special characters
    .replace(/[0-9]/g, '')        // Remove numbers
    .replace(/\s+/g, ' ')         // Normalize spaces
    .trim();
}

function containsNSFW(text: string): boolean {
  const normalizedText = normalizeText(text);
  const words = normalizedText.split(' ');
  
  // Check each word and its variations
  for (const word of words) {
    // Check for direct matches
    if (NSFW_WORDS.includes(word)) return true;
    
    // Check for partial matches (e.g., "pornographic" contains "porn")
    if (NSFW_WORDS.some(nsfwWord => 
      word.includes(nsfwWord) || nsfwWord.includes(word)
    )) return true;
  }

  // Check for phrases and word combinations
  for (let i = 0; i < words.length - 1; i++) {
    const twoWordPhrase = `${words[i]} ${words[i + 1]}`;
    const threeWordPhrase = i < words.length - 2 ? 
      `${words[i]} ${words[i + 1]} ${words[i + 2]}` : '';

    // Check common NSFW phrases
    const phrases = [
      'no clothes', 'take off', 'removed clothes', 'without clothes',
      'not wearing', 'fully naked', 'get naked', 'show skin',
      'remove dress', 'take clothes', 'wearing nothing', 'no dress',
      'adult content', 'sexy girl', 'hot girl', 'nsfw content'
    ];

    if (phrases.some(phrase => 
      twoWordPhrase.includes(phrase) || 
      threeWordPhrase.includes(phrase)
    )) return true;
  }

  // Additional pattern checks
  const patterns = [
    /n+\s*[s5]\s*f+\s*w+/i,      // Matches "nsfw" with variations
    /p+\s*[o0]\s*r+\s*n+/i,      // Matches "porn" with variations
    /s+\s*[e3]\s*x+/i,           // Matches "sex" with variations
    /n+\s*[u4]\s*d+\s*[e3]/i,    // Matches "nude" with variations
    /b+\s*[o0]{2}\s*b+s*/i,     // Matches "boobs" with variations
  ];

  if (patterns.some(pattern => pattern.test(text))) return true;

  return false;
}

export default function CreatePage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!prompt) {
      toast.info("Please enter a prompt to generate an image");
      return;
    }

    if (containsNSFW(prompt)) {
      setError("Your prompt contains inappropriate content");
      toast.error("NSFW content is not allowed");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate image");
      }

      setImage(data.url);
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
            className="flex gap-2"
          >
            <Input
              placeholder="Describe the image you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              className="h-12 text-base"
            />
            <Button
              onClick={handleSubmit}
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
