import { motion } from "framer-motion";

interface TimerProps {
  timeLeft: number;
}

export const Timer = ({ timeLeft }: TimerProps) => {
  return (
    <motion.span 
      className="text-white text-xs font-medium"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {timeLeft}s
    </motion.span>
  );
};