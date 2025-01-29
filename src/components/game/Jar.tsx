import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface JarProps {
  type: "swear" | "smart" | "roundup" | "forget";
  position: number;
  onDragEnd: (position: number) => void;
}

const jarLabels = {
  swear: "Swear Jar",
  smart: "Smart Save",
  roundup: "Round Ups",
  forget: "Set & Forget",
};

const jarColors = {
  swear: "bg-[#9b87f5]",
  smart: "bg-[#F2FCE2]",
  roundup: "bg-[#FEF7CD]",
  forget: "bg-[#FEC6A1]",
};

const jarIcons = {
  swear: "/lovable-uploads/23a85ca1-ae41-43a6-abde-b3d517ee3f8a.png",
  smart: "/lovable-uploads/8dc3eaae-45c8-4d66-bac4-3779663514ec.png",
  roundup: "/lovable-uploads/dda069ed-901c-40c5-8e5e-67df4c2a5e59.png",
  forget: "/lovable-uploads/c6bc090b-88ff-4851-bbd0-79b39c596673.png",
};

export const Jar = ({ type, position, onDragEnd }: JarProps) => {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      whileDrag={{ scale: 1.1 }}
      onDragEnd={(_, info) => onDragEnd(position + info.offset.x)}
      className={cn(
        "absolute bottom-4 w-24 h-32 cursor-grab active:cursor-grabbing",
        "flex flex-col items-center justify-end pb-2",
        "rounded-3xl",
        jarColors[type],
        "shadow-lg",
        "transition-all duration-300",
        "before:content-[''] before:absolute before:top-2 before:left-1/2 before:-translate-x-1/2",
        "before:w-16 before:h-4 before:bg-white/20 before:rounded-full",
        "after:content-[''] after:absolute after:top-[-10px] after:left-1/2 after:-translate-x-1/2",
        "after:w-12 after:h-3 after:rounded-full after:bg-white/30"
      )}
      style={{ 
        left: position,
        background: `linear-gradient(135deg, ${jarColors[type].replace('bg-[', '').replace(']', '')}ee, ${jarColors[type].replace('bg-[', '').replace(']', '')}99)`,
      }}
    >
      <div className="absolute -top-12 flex flex-col items-center gap-1">
        <img 
          src={jarIcons[type]} 
          alt={jarLabels[type]} 
          className="w-8 h-8 object-contain"
        />
        <div className="text-sm font-bold text-game-primary whitespace-nowrap bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
          {jarLabels[type]}
        </div>
      </div>
      
      {/* Glass reflection effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
    </motion.div>
  );
};