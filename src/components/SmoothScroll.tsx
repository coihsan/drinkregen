import { motion } from "framer-motion";

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  return <motion.main>{children}</motion.main>;
};

export default SmoothScroll;