import { motion } from "framer-motion";
import { Sprout, Trash2, Droplet, Zap } from "lucide-react";
import { MetricCard } from "../MetricCard";
import { AlertItem } from "../AlertItem";
import { LiveClock } from "../LiveClock";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section id="overview" className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-4">
            <span className="text-gradient-green">Smart Green Campus</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            IIT Roorkee – AI-Powered Environmental Intelligence
          </p>
          <LiveClock />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            icon={Sprout}
            label="Plantation Zones"
            value="8"
            change="+3"
            changeType="positive"
            color="green"
            delay={0.1}
          />
          <MetricCard
            icon={Trash2}
            label="Waste Detected"
            value="23"
            change="-12%"
            changeType="positive"
            color="orange"
            delay={0.2}
          />
          <MetricCard
            icon={Droplet}
            label="Water Usage"
            value="2.3K L"
            change="+18%"
            changeType="negative"
            color="cyan"
            delay={0.3}
          />
          <MetricCard
            icon={Zap}
            label="Energy Generated"
            value="532 kW"
            change="+15%"
            changeType="positive"
            color="yellow"
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse-glow" />
              Critical Alerts
            </h3>
            <div className="space-y-3">
              <AlertItem
                type="critical"
                location="Library Block"
                message="Waste detected"
                time="10 mins ago"
                delay={0.1}
              />
              <AlertItem
                type="warning"
                location="Hostel 3"
                message="Water leak"
                time="25 mins ago"
                delay={0.2}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold mb-4">Campus Heatmap</h3>
            <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-warning/20 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.3),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(251,146,60,0.3),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(6,182,212,0.3),transparent_50%)]" />
              <p className="text-muted-foreground relative z-10">Active Monitoring Zones</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
