import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface AlertItemProps {
  type: "critical" | "warning";
  location: string;
  message: string;
  time: string;
  delay?: number;
}

export const AlertItem = ({ type, location, message, time, delay = 0 }: AlertItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-start gap-3 p-4 rounded-xl glass-hover"
    >
      <div
        className={`p-2 rounded-lg animate-pulse-glow ${
          type === "critical"
            ? "bg-destructive/20 text-destructive"
            : "bg-warning/20 text-warning"
        }`}
      >
        <AlertCircle className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-sm">{location}</span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </motion.div>
  );
};
