"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ImageModel } from "@/types/image";
import { Info, Stars, Zap, Sparkles, Layers, Camera } from "lucide-react";

const MODEL_DETAILS: Record<ImageModel, {
  icon: React.ReactNode;
  title: string;
  description: string;
  strengths: string[];
  speed: "Fast" | "Medium" | "Slow";
}> = {
  'flux': {
    icon: <Stars className="w-6 h-6 text-blue-500" />,
    title: "Flux",
    description: "Fast and reliable text-to-image model for most prompts",
    strengths: ["Fast generation", "Reliable output", "Great default model"],
    speed: "Fast"
  },
  'kontext': {
    icon: <Layers className="w-6 h-6 text-cyan-500" />,
    title: "Kontext",
    description: "Strong prompt adherence with in-context composition",
    strengths: ["Prompt fidelity", "Composition control", "Consistent style"],
    speed: "Medium"
  },
  'gptimage': {
    icon: <Camera className="w-6 h-6 text-green-500" />,
    title: "GPT Image",
    description: "High quality output with strong realism",
    strengths: ["Photorealism", "High detail", "Natural textures"],
    speed: "Medium"
  },
  'zimage': {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Z-Image",
    description: "Turbo-like fast model with upscaled output",
    strengths: ["Very fast", "Good sharpness", "Great for iterations"],
    speed: "Fast"
  },
  'klein': {
    icon: <Sparkles className="w-6 h-6 text-orange-500" />,
    title: "Klein",
    description: "Balanced creative model with clean details",
    strengths: ["Creative outputs", "Balanced quality", "Versatile scenes"],
    speed: "Medium"
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
