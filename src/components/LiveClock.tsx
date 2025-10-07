import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass p-4 rounded-xl flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/20 glow-green">
        <Clock className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Live Monitoring</p>
        <p className="text-lg font-bold font-mono">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </p>
      </div>
    </div>
  );
};
