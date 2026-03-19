import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-background mt-auto">
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src="/favicon.jpg" alt="RUA" className="h-10 w-10 object-contain rounded-md shadow-sm" />
            <h3 className="font-bold text-foreground tracking-tighter uppercase text-xl">RUA</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Precision-crafted essentials for the modern wardrobe.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Shop</h4>
          <div className="flex flex-col gap-2">
            <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Products</Link>
            <Link to="/shop?category=Essentials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Essentials</Link>
            <Link to="/shop?category=Graphic" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Graphic</Link>
            <Link to="/shop?category=Premium" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Premium</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Company</h4>
          <div className="flex flex-col gap-2">
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <Link to="/customizer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Customize</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Privacy Policy</span>
            <span className="text-sm text-muted-foreground">Terms of Service</span>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground">© 2026 RUA. College Project.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
