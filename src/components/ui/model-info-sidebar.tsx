"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ImageModel } from "@/types/image";
import { Info, Stars, Zap, Sparkles, Layers, Palette, Camera } from "lucide-react";

const MODEL_DETAILS: Record<ImageModel, {
  icon: React.ReactNode;
  title: string;
  description: string;
  strengths: string[];
  speed: "Fast" | "Medium" | "Slow";
}> = {
  'flux': {
    icon: <Stars className="w-6 h-6 text-blue-500" />,
    title: "Flux - General Purpose",
    description: "Versatile model suitable for most types of images",
    strengths: ["Balanced quality", "Wide subject range", "Good details"],
    speed: "Medium"
  },
  'flux-realism': {
    icon: <Camera className="w-6 h-6 text-green-500" />,
    title: "Flux Realism",
    description: "Specialized in photorealistic outputs",
    strengths: ["Photorealistic results", "Natural lighting", "Texture detail"],
    speed: "Slow"
  },
  'any-dark': {
    icon: <Palette className="w-6 h-6 text-purple-500" />,
    title: "Dark Artistic",
    description: "Perfect for moody and dramatic artistic styles",
    strengths: ["Dramatic lighting", "Dark themes", "Artistic flair"],
    speed: "Medium"
  },
  'flux-anime': {
    icon: <Sparkles className="w-6 h-6 text-pink-500" />,
    title: "Anime Style",
    description: "Specialized in anime and manga-style illustrations",
    strengths: ["Anime aesthetics", "Character design", "Stylized art"],
    speed: "Fast"
  },
  'flux-3d': {
    icon: <Layers className="w-6 h-6 text-orange-500" />,
    title: "3D Graphics",
    description: "Optimized for 3D-style rendered images",
    strengths: ["3D rendering", "Depth perception", "Material simulation"],
    speed: "Slow"
  },
  'turbo': {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Turbo - Quick Gen",
    description: "Fastest generation with good quality balance",
    strengths: ["Quick results", "Good quality", "Efficient processing"],
    speed: "Fast"
  }
};

interface ModelInfoSidebarProps {
  selectedModel: ImageModel | null;
}

export function ModelInfoSidebar({ selectedModel }: ModelInfoSidebarProps) {
  if (!selectedModel) return null;

  const modelInfo = MODEL_DETAILS[selectedModel];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed right-4 top-1/2 -translate-y-1/2 w-64 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4"
      >
        <div className="flex items-center gap-3">
          {modelInfo.icon}
          <div>
            <h3 className="font-medium text-white">{modelInfo.title}</h3>
            <div className="flex items-center gap-1.5 text-xs">
              <Info className="w-3 h-3 text-white/70" />
              <span className={`
                ${modelInfo.speed === 'Fast' ? 'text-green-400' : ''}
                ${modelInfo.speed === 'Medium' ? 'text-yellow-400' : ''}
                ${modelInfo.speed === 'Slow' ? 'text-red-400' : ''}
              `}>
                {modelInfo.speed} Generation
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/80">
          {modelInfo.description}
        </p>

        <div className="space-y-2">
          <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">
            Strengths
          </h4>
          <ul className="text-sm space-y-1">
            {modelInfo.strengths.map((strength, i) => (
              <li key={i} className="flex items-center gap-2 text-white/80">
                <div className="w-1 h-1 rounded-full bg-white/40" />
                {strength}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
