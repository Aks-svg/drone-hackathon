import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

const navItems = [
  { label: "Overview", id: "overview" },
  { label: "Waste Detection", id: "waste" },
  { label: "AI Plantation", id: "plantation" },
  { label: "Solar Potential", id: "solar" },
];

export const Navigation = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 glow-green">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-green">Smart Green Campus</h1>
              <p className="text-xs text-muted-foreground">IIT Roorkee</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-primary/10 transition-all duration-300 hover:glow-green"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
