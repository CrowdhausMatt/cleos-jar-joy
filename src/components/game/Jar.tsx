import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Timer } from "./Timer";

interface JarProps {
  position: number;
  onMove: (direction: "left" | "right") => void;
  timeLeft: number;
}

export const Jar = ({ position, timeLeft }: JarProps) => {
  return (
    <div className="absolute bottom-4 w-full flex flex-col items-center">
      <motion.div
        style={{ x: position - window.innerWidth / 2 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={cn(
          "w-24 h-32 relative",
          "flex items-center justify-center flex-col",
          "rounded-3xl",
          "bg-gradient-to-br from-purple-400 to-purple-600",
          "shadow-lg",
          "before:content-[''] before:absolute before:top-2 before:left-1/2 before:-translate-x-1/2",
          "before:w-16 before:h-4 before:bg-white/20 before:rounded-full",
          "after:content-[''] after:absolute after:top-[-10px] after:left-1/2 after:-translate-x-1/2",
          "after:w-12 after:h-3 after:rounded-full after:after:bg-white/30",
          "jar-hitbox border-2 border-purple-50",
          "bg-opacity-90"
        )}
      >
        <img 
          src="/lovable-uploads/23a85ca1-ae41-43a6-abde-b3d517ee3f8a.png"
          alt="Savings Jar"
          className="w-12 h-12 object-contain"
        />
        <span className="text-white text-sm font-semibold mt-1">Swear Jar</span>
        <Timer timeLeft={timeLeft} />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
};