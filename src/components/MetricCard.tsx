import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  color: "green" | "cyan" | "orange" | "yellow";
  delay?: number;
}

const colorClasses = {
  green: "text-primary bg-primary/20 glow-green",
  cyan: "text-secondary bg-secondary/20 glow-cyan",
  orange: "text-warning bg-warning/20 glow-orange",
  yellow: "text-solar bg-solar/20",
};

export const MetricCard = ({
  icon: Icon,
  label,
  value,
  change,
  changeType,
  color,
  delay = 0,
}: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="glass-hover p-6 rounded-2xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            changeType === "positive"
              ? "bg-primary/20 text-primary"
              : "bg-destructive/20 text-destructive"
          }`}
        >
          {change}
        </span>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
};
