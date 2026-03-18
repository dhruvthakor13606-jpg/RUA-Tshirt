import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Type, 
  Image as ImageIcon, 
  Palette, 
  Upload, 
  Trash2, 
  Move, 
  Settings2,
  Sparkles,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const fonts = [
  { name: "Public Sans", value: "'Public Sans', sans-serif" },
  { name: "Inter", value: "'Inter', sans-serif" },
  { name: "Playfair Display", value: "'Playfair Display', serif" },
  { name: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
  { name: "Outfit", value: "'Outfit', sans-serif" },
];

const teeColors = [
  { name: "Pure White", value: "#ffffff", image: "/images/white-tee.png" },
  { name: "Midnight", value: "#1a1a1a", image: "/images/blank-tee.png" }, // Using original for black
  { name: "Concrete", value: "#8c8c8c", image: "/images/white-tee.png" }, 
  { name: "Navy Blue", value: "#1e293b", image: "/images/blue-tee.png" },
  { name: "Forest", value: "#14532d", image: "/images/white-tee.png" }, // Overlay on white-tee
  { name: "Sand", value: "#d6d3d1", image: "/images/white-tee.png" },
  { name: "Crimson", value: "#991b1b", image: "/images/red-tee.png" },
];

const Customizer = () => {
  const [text, setText] = useState("RUA STUDIO");
  const [textColor, setTextColor] = useState("#ffffff");
  const [teeColor, setTeeColor] = useState("#1a1a1a");
  const [fontFamily, setFontFamily] = useState(fonts[0].value);
  const [fontSize, setFontSize] = useState(24);
  const [textY, setTextY] = useState(45); // Vertical position %
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(80);
  const [logoY, setLogoY] = useState(30);
  
  const { addItem } = useCart();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlaceOrder = () => {
    const customProduct = {
      id: Date.now(), // Unique ID for this custom design
      name: `Custom RUA Tee - ${teeColors.find(c => c.value === teeColor)?.name || "Original"}`,
      price: 29.99,
      image: "/images/blank-tee.png",
      category: "Custom",
      description: `Custom design: "${text}" with custom logo and ${teeColors.find(c => c.value === teeColor)?.name} finish.`,
      color: teeColor,
      isTrending: false
    } as any;

    addItem(customProduct, "M"); // Default size M for custom orders
    toast.success("Added your custom design to the cart!");
    navigate("/cart");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large. Max 2MB.");
        return;
      }
      const url = URL.createObjectURL(file);
      setLogo(url);
      toast.success("Logo uploaded!");
    }
  };

  const handleDownload = () => {
    toast.info("In a real app, this would generate a high-res print file.");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 pb-12">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Preview Area */}
          <div className="flex-1 w-full flex flex-col gap-6">
            <div className="reveal active" style={{ transitionDelay: '0s' }}>
              <h1 className="text-4xl font-bold tracking-tighter text-foreground mb-2">Custom Laboratory</h1>
              <p className="text-muted-foreground">Architect your signature piece with precision controls.</p>
            </div>

            <div className="relative aspect-[4/5] md:aspect-square bg-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-border/50 flex items-center justify-center p-8 group">
              {/* Tee Color Glow (Centered to avoid square corners) */}
              <div 
                className="absolute inset-[15%] rounded-full blur-[80px] opacity-60 transition-all duration-700"
                style={{ backgroundColor: teeColor }}
              />
              
              {/* Additional Subtle Overlay for depth */}
              <div 
                className="absolute inset-x-20 inset-y-10 rounded-[3rem] blur-[120px] opacity-20 transition-all duration-500"
                style={{ backgroundColor: teeColor }}
              />

              {/* The Mockup Base (Dynamic image swap for real-life colors) */}
              <img 
                src={teeColors.find(c => c.value === teeColor)?.image || "/images/blank-tee.png"} 
                alt="Mockup Base" 
                className={`relative h-full w-full object-contain pointer-events-none drop-shadow-2xl transition-opacity duration-500`}
                style={{ 
                  mixBlendMode: teeColor === '#ffffff' ? 'normal' : 'multiply',
                  opacity: 1 
                }}
              />

              {/* Custom Layers Container */}
              <div className="absolute inset-0 flex flex-col items-center justify-start pt-[20%] px-[20%] pointer-events-none">
                
                {/* Logo Layer */}
                {logo && (
                  <div 
                    className="relative mb-4 transition-all duration-300"
                    style={{ 
                      width: `${logoSize}px`, 
                      transform: `translateY(${logoY}px)`,
                    }}
                  >
                    <img src={logo} alt="Custom Logo" className="w-full h-auto drop-shadow-lg" />
                  </div>
                )}

                {/* Text Layer */}
                <div 
                  className="w-full text-center transition-all duration-300"
                  style={{ 
                    transform: `translateY(${textY}px)`,
                  }}
                >
                  <p
                    className="font-bold break-words drop-shadow-md leading-none"
                    style={{ 
                      color: textColor, 
                      fontFamily, 
                      fontSize: `${fontSize}px` 
                    }}
                  >
                    {text}
                  </p>
                </div>
              </div>

              {/* View Overlay Controls */}
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 glass shadow-xl" onClick={() => setLogo(null)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-6 bg-card rounded-3xl border border-border/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Premium Quality Guaranteed</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Reinforced seams • 240GSM Cotton</p>
                </div>
              </div>
              <Button onClick={handleDownload} className="rounded-full gap-2 px-6">
                <Download className="h-4 w-4" /> Save Design
              </Button>
            </div>
          </div>

          {/* Control Sidebar */}
          <div className="w-full lg:w-[400px] space-y-6">
            
            {/* Base Color Selection */}
            <div className="glass p-6 rounded-3xl space-y-4 border border-border/40 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Canvas Color</h3>
              </div>
              <div className="flex gap-3 flex-wrap">
                {teeColors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setTeeColor(c.value)}
                    className={`h-10 w-10 rounded-full border-2 transition-all hover:scale-110 ${
                      teeColor === c.value ? "border-primary scale-110 shadow-lg" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Logo Controls */}
            <div className="glass p-6 rounded-3xl space-y-6 border border-border/40 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Graphics</h3>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 rounded-full text-[10px] gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3 w-3" /> Upload Logo
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleLogoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              
              {logo && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Logo Size</Label>
                    <Slider 
                      value={[logoSize]} 
                      onValueChange={([v]) => setLogoSize(v)} 
                      min={40} 
                      max={200} 
                      step={1} 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Vertical Position</Label>
                    <Slider 
                      value={[logoY]} 
                      onValueChange={([v]) => setLogoY(v)} 
                      min={-50} 
                      max={200} 
                      step={1} 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Text Controls */}
            <div className="glass p-6 rounded-3xl space-y-6 border border-border/40 shadow-xl">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Typography</h3>
              </div>
              
              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Custom Text</Label>
                <Input 
                  value={text} 
                  onChange={(e) => setText(e.target.value)}
                  className="h-12 bg-background/50 rounded-xl"
                  placeholder="Enter text..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Font</Label>
                  <select 
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full h-10 rounded-xl bg-background/50 border border-border text-xs px-2"
                  >
                    {fonts.map((f) => (
                      <option key={f.value} value={f.value}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Text Color</Label>
                  <div className="flex items-center gap-2 h-10 px-2 rounded-xl bg-background/50 border border-border">
                    <input 
                      type="color" 
                      value={textColor} 
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-6 w-6 rounded-md border-0 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono">{textColor.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Text Size</Label>
                <Slider 
                  value={[fontSize]} 
                  onValueChange={([v]) => setFontSize(v)} 
                  min={12} 
                  max={64} 
                  step={1} 
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Text Position</Label>
                <Slider 
                  value={[textY]} 
                  onValueChange={([v]) => setTextY(v)} 
                  min={-50} 
                  max={300} 
                  step={1} 
                />
              </div>
            </div>

            <div className="p-6 bg-primary rounded-3xl text-primary-foreground shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all" />
              <h4 className="text-xl font-bold tracking-tight mb-1 relative z-10">Done Building?</h4>
              <p className="text-xs text-primary-foreground/80 mb-6 relative z-10">Ready to make this design a reality? Complete your custom order now.</p>
              <Button 
                variant="secondary" 
                className="w-full rounded-xl font-bold py-6 relative z-10"
                onClick={handlePlaceOrder}
              >
                Place Custom Order
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Customizer;
