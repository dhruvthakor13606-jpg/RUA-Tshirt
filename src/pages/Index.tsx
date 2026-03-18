import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Headphones, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/data/products";
import { db, isMock } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { products as localProducts } from "@/data/products";
import { toast } from "sonner";

const Index = () => {
  const [trending, setTrending] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const revealsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      if (isMock) {
        setTrending(localProducts.filter(p => p.isTrending));
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, "products"), where("isTrending", "==", true));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.data().id
        })) as Product[];
        setTrending(fetchedProducts);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();

    // Intersection Observer for Reveal Animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.1 });

    const currentReveals = revealsRef.current;
    currentReveals.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      currentReveals.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const addToReveals = (el: HTMLDivElement | null) => {
    if (el && !revealsRef.current.includes(el)) {
      revealsRef.current.push(el);
    }
  };

  return (
    <div className="mesh-gradient min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10 reveal" ref={addToReveals}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-[10px] font-bold uppercase tracking-widest text-foreground/70">
              <Sparkles className="h-3 w-3" /> New Collection 2026
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[1] tracking-tighter">
              Wear the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/70 to-foreground/40 italic">Statement.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Precision-crafted tees built for the modern urbanite. Heavyweight essentials and limited-edition graphics that define your style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/shop">
                <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                  Explore Shop <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/customizer">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-base font-bold bg-transparent border-2 hover:bg-foreground/5 translate-all">
                  Customize Your Own
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative reveal stagger-2" ref={addToReveals}>
            <div className="absolute -top-20 -right-20 h-96 w-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
            <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl animate-float">
              <img 
                src="/images/hero.png" 
                alt="RUA Premium Tee" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
            
            {/* Floating Glass Tag */}
            <div className="absolute bottom-10 -left-10 glass p-6 rounded-2xl hidden md:block">
              <p className="text-sm font-bold text-foreground">Signature Heavyweight</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">100% Premium Cotton</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-lg font-bold">$45.00</span>
                <Link to="/shop">
                  <Button size="sm" className="h-8 rounded-full text-[10px] px-4">Buy Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: ShieldCheck, title: "Premium Quality", desc: "Sourced from the finest local cotton for unmatched comfort." },
            { icon: Truck, title: "Fast Delivery", desc: "Enjoy worldwide shipping on all orders over $100." },
            { icon: Headphones, title: "24/7 Support", desc: "Dedicated support team to assist you anytime." },
          ].map((feature, i) => (
            <div key={i} className="flex gap-4 reveal" ref={addToReveals}>
              <div className="h-12 w-12 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 border border-foreground/10">
                <feature.icon className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="container mx-auto px-6 py-20 bg-background/50 backdrop-blur-sm rounded-[3rem] border border-border/50">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4 reveal" ref={addToReveals}>
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Community Favorites</span>
            <h2 className="text-4xl font-bold text-foreground tracking-tight">Trending Now</h2>
          </div>
          <Link to="/shop">
            <Button variant="ghost" className="group rounded-full gap-2 hover:bg-foreground/5 pr-2">
              Explore All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 reveal stagger-1" ref={addToReveals}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-3xl bg-muted animate-pulse" />
            ))
          ) : trending.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground">The stash is empty. Refreshing shortly...</p>
            </div>
          ) : (
            trending.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-6 py-32">
        <div className="glass rounded-[3rem] p-12 lg:p-24 overflow-hidden relative reveal" ref={addToReveals}>
          <div className="absolute top-0 right-0 h-full w-1/3 bg-primary/5 blur-[80px] -z-10" />
          <div className="max-w-xl space-y-8">
            <div className="h-14 w-14 rounded-2xl bg-foreground text-background flex items-center justify-center mb-6">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-foreground tracking-tighter leading-tight">
              Get 20% off your <br /> first drop.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
              Join the RUA community and never miss a limited release or exclusive event.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Welcome to the community!"); }} className="flex gap-2 max-w-md">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="h-14 rounded-full px-6 bg-background/50 border-foreground/10"
                required
              />
              <Button type="submit" size="lg" className="h-14 rounded-full px-8 font-bold">
                Join
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
