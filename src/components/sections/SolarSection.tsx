import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Sun, Zap, TrendingUp, Activity } from "lucide-react";

const solarData = [
  { hour: "06:00", output: 50 },
  { hour: "08:00", output: 180 },
  { hour: "10:00", output: 380 },
  { hour: "12:00", output: 532 },
  { hour: "14:00", output: 495 },
  { hour: "16:00", output: 320 },
  { hour: "18:00", output: 150 },
];

export const SolarSection = () => {
  const [currentOutput, setCurrentOutput] = useState(532);
  const [efficiency, setEfficiency] = useState(87.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOutput((prev) => prev + (Math.random() - 0.5) * 10);
      setEfficiency((prev) => Math.min(100, Math.max(80, prev + (Math.random() - 0.5) * 2)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="solar" className="min-h-screen py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-solar to-warning bg-clip-text text-transparent">
              Solar Potential & Energy Analytics
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">Real-time renewable energy monitoring</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass p-8 rounded-2xl mb-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-solar/10 to-warning/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-solar/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Sun className="w-16 h-16 text-solar" />
            </motion.div>
            <h3 className="text-5xl md:text-6xl font-bold mb-2">
              <motion.span
                key={currentOutput}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-solar"
              >
                {currentOutput.toFixed(0)} kW
              </motion.span>
            </h3>
            <p className="text-muted-foreground">Current Solar Output</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-hover p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-solar/20 text-solar">
                <Zap className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Efficiency</p>
            <p className="text-3xl font-bold">{efficiency.toFixed(1)}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-hover p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/20 text-primary">
                <Activity className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Energy Today</p>
            <p className="text-3xl font-bold">4.2 MWh</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-hover p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-secondary/20 text-secondary">
                <Sun className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                <span className="text-xs text-primary font-semibold">Optimal</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Panel Health</p>
            <p className="text-3xl font-bold">98.5%</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass p-6 rounded-2xl"
        >
          <h3 className="text-xl font-bold mb-6">Hourly Solar Power Generation</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={solarData}>
              <defs>
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--solar))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--solar))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="output"
                stroke="hsl(var(--solar))"
                strokeWidth={3}
                fill="url(#solarGradient)"
                dot={{ fill: "hsl(var(--solar))", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">AI Optimization Tip</p>
                <p className="text-sm text-muted-foreground">
                  Panel orientation adjustment recommended for East Wing. Potential efficiency gain: +5.2%
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
