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

export const Jar = ({ type, position, onDragEnd }: JarProps) => {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => onDragEnd(position + info.offset.x)}
      className={cn(
        "absolute bottom-4 w-24 h-32 rounded-lg bg-game-jar cursor-grab active:cursor-grabbing",
        "flex flex-col items-center justify-end pb-2",
        "border-4 border-game-primary"
      )}
      style={{ left: position }}
    >
      <div className="absolute -top-2 text-sm font-bold text-game-primary whitespace-nowrap">
        {jarLabels[type]}
      </div>
    </motion.div>
  );
};