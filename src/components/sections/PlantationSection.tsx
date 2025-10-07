import { motion } from "framer-motion";
import { useState } from "react";
import { Thermometer, TreePine, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const zones = [
  {
    name: "Academic Block North",
    heatIndex: 92,
    treesNeeded: 45,
    cooling: -5.1,
    level: "very-high",
  },
  {
    name: "Sports Complex",
    heatIndex: 87,
    treesNeeded: 30,
    cooling: -4.5,
    level: "high",
  },
  {
    name: "Main Library",
    heatIndex: 78,
    treesNeeded: 20,
    cooling: -3.2,
    level: "moderate",
  },
  {
    name: "Central Garden",
    heatIndex: 65,
    treesNeeded: 10,
    cooling: -2.1,
    level: "low",
  },
];

const recommendations = [
  { name: "Neem Tree", icon: "🌳", benefit: "Natural cooling & air purification" },
  { name: "Banyan", icon: "🌲", benefit: "Wide canopy coverage" },
  { name: "Peepal", icon: "🌴", benefit: "Oxygen production & shade" },
  { name: "Gulmohar", icon: "🌺", benefit: "Aesthetic & temperature reduction" },
];

export const PlantationSection = () => {
  const [showRecommendations, setShowRecommendations] = useState(false);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "very-high":
        return "text-destructive bg-destructive/20";
      case "high":
        return "text-warning bg-warning/20";
      case "moderate":
        return "text-solar bg-solar/20";
      case "low":
        return "text-primary bg-primary/20";
      default:
        return "text-muted-foreground bg-muted/20";
    }
  };

  const totalCoolingImpact = zones.reduce((sum, zone) => sum + Math.abs(zone.cooling), 0);

  return (
    <section id="plantation" className="min-h-screen py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-green">AI-Powered Plantation Optimization</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Data-driven campus cooling strategies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Campus Cooling Impact</h3>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="hsl(var(--muted))"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="hsl(var(--primary))"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(totalCoolingImpact / 20) * 553} 553`}
                    className="transition-all duration-1000 glow-green"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Wind className="w-12 h-12 text-primary mb-2" />
                  <span className="text-3xl font-bold">{totalCoolingImpact.toFixed(1)}°C</span>
                  <span className="text-sm text-muted-foreground">Cooling</span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowRecommendations(true)}
              className="w-full bg-primary/20 text-primary hover:bg-primary/30 border-primary/30 glow-green"
            >
              <TreePine className="w-4 h-4 mr-2" />
              View Plant Recommendations
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {zones.map((zone, index) => (
              <motion.div
                key={zone.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-hover p-6 rounded-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{zone.name}</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(
                      zone.level
                    )}`}
                  >
                    {zone.level.replace("-", " ").toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-1 text-warning mb-1">
                      <Thermometer className="w-4 h-4" />
                      <span className="text-xs text-muted-foreground">Heat Index</span>
                    </div>
                    <p className="text-lg font-bold">{zone.heatIndex}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-1">
                      <TreePine className="w-4 h-4" />
                      <span className="text-xs text-muted-foreground">Trees Needed</span>
                    </div>
                    <p className="text-lg font-bold">{zone.treesNeeded}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-secondary mb-1">
                      <Wind className="w-4 h-4" />
                      <span className="text-xs text-muted-foreground">Cooling</span>
                    </div>
                    <p className="text-lg font-bold">{zone.cooling}°C</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Heat Reduction Progress</span>
                    <span>{Math.round((100 - zone.heatIndex) * 0.8)}%</span>
                  </div>
                  <Progress
                    value={Math.round((100 - zone.heatIndex) * 0.8)}
                    className="h-2"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
        <DialogContent className="glass max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gradient-green">
              Recommended Plant Species
            </DialogTitle>
            <DialogDescription>
              AI-optimized selections for maximum environmental impact
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-hover p-6 rounded-xl text-center"
              >
                <div className="text-4xl mb-3">{rec.icon}</div>
                <h4 className="font-bold text-lg mb-2">{rec.name}</h4>
                <p className="text-sm text-muted-foreground">{rec.benefit}</p>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
