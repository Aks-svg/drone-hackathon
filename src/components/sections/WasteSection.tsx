import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Camera, MapPin, CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const wasteData = [
  { time: "00:00", count: 12 },
  { time: "04:00", count: 8 },
  { time: "08:00", count: 15 },
  { time: "12:00", count: 23 },
  { time: "16:00", count: 18 },
  { time: "20:00", count: 14 },
];

const locationData = [
  { location: "Library", count: 8 },
  { location: "Hostel 1", count: 5 },
  { location: "Cafeteria", count: 6 },
  { location: "Academic", count: 4 },
];

const detections = [
  { id: 1, location: "Library Block", lat: 29.8674, lng: 77.8997, status: "pending" },
  { id: 2, location: "Hostel 3", lat: 29.8665, lng: 77.8988, status: "pending" },
  { id: 3, location: "Cafeteria", lat: 29.8680, lng: 77.9000, status: "acknowledged" },
];

export const WasteSection = () => {
  const [acknowledged, setAcknowledged] = useState<number[]>([3]);
  const [isActive, setIsActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [annotatedUrl, setAnnotatedUrl] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAcknowledge = (id: number) => {
    setAcknowledged([...acknowledged, id]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileUpload called");
    console.log("event.target.files:", event.target.files);
    alert("File input triggered!");
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("Selected file:", file.name, file.type, file.size);
    alert(`File selected: ${file.name}`);

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setProcessing(true);
    try {
      console.log("Uploading file:", file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      
      console.log("Sending request to /api/predict...");
      const res = await fetch("/api/predict", {
        method: "POST",
        body: formData
      });
      
      console.log("Upload response status:", res.status, res.statusText);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Upload failed:", errorText);
        throw new Error(`Upload failed: ${res.status} ${errorText}`);
      }
      
      const result = await res.json();
      console.log("Upload response:", result);
      
      if (result.processed_url) {
        const fullUrl = result.processed_url.startsWith('http') 
          ? result.processed_url 
          : `${window.location.origin}${result.processed_url}`;
        setAnnotatedUrl(fullUrl);
        setUploadedImage(fullUrl);
        console.log("Processed image URL set:", fullUrl);
      } else if (result.processed_image_url) {
        // Handle webcam response format
        const fullUrl = result.processed_image_url.startsWith('http') 
          ? result.processed_image_url 
          : `${window.location.origin}${result.processed_image_url}`;
        setAnnotatedUrl(fullUrl);
        console.log("Processed image URL set:", fullUrl);
      } else {
        console.error("No processed_url or processed_image_url in response:", result);
      }
    } catch (e) {
      console.error("Error in file upload:", e);
      alert(`Upload failed: ${e}`);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    const start = async () => {
      if (!isActive) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error(err);
      }
    };
    const stop = () => {
      const mediaStream = videoRef.current?.srcObject as MediaStream | undefined;
      mediaStream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
    start();
    return () => stop();
  }, [isActive]);

  const captureAndDetect = async () => {
    console.log("Button clicked! captureAndDetect called");
    console.log("videoRef.current:", videoRef.current);
    console.log("canvasRef.current:", canvasRef.current);
    console.log("isActive:", isActive);
    
    if (!videoRef.current || !canvasRef.current) {
      console.error("Missing video or canvas ref");
      return;
    }
    
    if (!isActive) {
      console.error("Camera not active");
      return;
    }
    
    setProcessing(true);
    try {
      console.log("Starting capture and detect...");
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      console.log("Video dimensions:", video.videoWidth, video.videoHeight);
      
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Could not get canvas context");
        return;
      }
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log("Image drawn to canvas");
      
      // Convert canvas to base64
      const base64Data = canvas.toDataURL("image/jpeg", 0.9);
      console.log("Image captured, base64 length:", base64Data.length);
      
      console.log("Sending request to /api/webcam...");
      
      const res = await fetch("/api/webcam", { 
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Data })
      });
      console.log("Response status:", res.status, res.statusText);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Detection failed:", errorText);
        throw new Error(`Detection failed: ${res.status} ${errorText}`);
      }
      
      const result = await res.json();
      console.log("Received response:", result);
      
      if (result.processed_image_url) {
        // Make sure the URL is absolute
        const fullUrl = result.processed_image_url.startsWith('http') 
          ? result.processed_image_url 
          : `${window.location.origin}${result.processed_image_url}`;
        setAnnotatedUrl(fullUrl);
        console.log("Processed image URL set:", fullUrl);
      } else {
        console.error("No processed_image_url in response:", result);
      }
    } catch (e) {
      console.error("Error in captureAndDetect:", e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section id="waste" className="min-h-screen py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-green">AI Waste Detection System</span>
          </h2>
          <p className="text-xl text-muted-foreground">Real-time monitoring and analysis</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold mb-4">Waste Detection Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={wasteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
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
                  dataKey="count"
                  stroke="hsl(var(--warning))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--warning))", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold mb-4">Waste by Location</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="location" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              {uploadMode ? "Image Upload" : "Live Camera Feed"}
            </h3>
            <div className="aspect-video rounded-xl bg-muted/30 flex items-center justify-center relative overflow-hidden">
              {annotatedUrl ? (
                <img 
                  src={annotatedUrl} 
                  alt="Annotated" 
                  className="w-full h-full object-contain" 
                  onLoad={() => console.log("Image loaded successfully:", annotatedUrl)}
                  onError={(e) => console.error("Image failed to load:", annotatedUrl, e)}
                />
              ) : uploadMode ? (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <Upload className="w-16 h-16 text-primary/50 mb-4" />
                  <p className="text-muted-foreground mb-4">Upload an image for waste detection</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="mb-4 p-4 border-2 border-dashed border-primary/30 rounded-lg bg-background hover:border-primary/50 cursor-pointer"
                    disabled={processing}
                    style={{ minWidth: '200px' }}
                  />
                  <p className="text-sm text-muted-foreground">Click to select image (.jpg, .jpeg, .png)</p>
                  {processing && (
                    <p className="text-primary mt-2">Processing image...</p>
                  )}
                </div>
              ) : (
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              )}
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-destructive/20 border border-destructive rounded-lg text-xs font-semibold text-destructive">
                {uploadMode ? "UPLOAD" : (isActive ? "LIVE" : "IDLE")}
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button 
                onClick={() => { 
                  console.log("Switch button clicked, current uploadMode:", uploadMode);
                  setUploadMode(!uploadMode); 
                  setIsActive(false); 
                  setAnnotatedUrl(null); 
                  console.log("New uploadMode will be:", !uploadMode);
                }}
                variant={uploadMode ? "default" : "outline"}
              >
                {uploadMode ? "Switch to Camera" : "Switch to Upload"}
              </Button>
              {!uploadMode && (
                <>
                  <Button onClick={() => { setIsActive((v) => !v); setAnnotatedUrl(null); }}
                    className={isActive ? "bg-primary/20 text-primary hover:bg-primary/30 border-primary/30" : ""}>
                    {isActive ? "AI Detection Active" : "Activate Camera"}
                  </Button>
                  <Button onClick={captureAndDetect} disabled={!isActive || processing}>
                    {processing ? "Processing..." : "Capture & Detect"}
                  </Button>
                </>
              )}
              {annotatedUrl && (
                <Button variant="secondary" onClick={() => setAnnotatedUrl(null)}>
                  {uploadMode ? "New Upload" : "New Capture"}
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              Detection Locations
            </h3>
            <div className="space-y-3">
              {detections.map((detection) => (
                <div
                  key={detection.id}
                  className="flex items-center justify-between p-4 rounded-xl glass-hover"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        acknowledged.includes(detection.id)
                          ? "bg-primary/20 text-primary"
                          : "bg-warning/20 text-warning animate-pulse-glow"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{detection.location}</p>
                      <p className="text-xs text-muted-foreground">
                        {detection.lat.toFixed(4)}, {detection.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  {acknowledged.includes(detection.id) ? (
                    <div className="flex items-center gap-2 text-primary text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Clean-up Acknowledged</span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleAcknowledge(detection.id)}
                      className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/30"
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
