import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";

/** Cart page with quantity adjusters, shipping form, and Firestore order placement */
const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: ""
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/auth");
      return;
    }

    if (!shipping.fullName || !shipping.address || !shipping.city || !shipping.zipCode) {
      toast.error("Please fill in all shipping details");
      return;
    }

    setLoading(true);
    try {
      // Create a clean copy of items and ensure no undefined values
      const orderItems = items.map(item => ({
        productId: item.product.id || 0,
        name: item.product.name || "Unknown Product",
        price: item.product.price || 0,
        quantity: item.quantity || 1,
        size: item.size || "M",
        image: item.product.image || ""
      }));

      const orderData = {
        userId: user.uid,
        userEmail: user.email || "no-email@provided.com",
        items: orderItems,
        totalAmount: totalPrice,
        status: "pending",
        shippingAddress: {
          fullName: shipping.fullName || "",
          address: shipping.address || "",
          city: shipping.city || "",
          zipCode: shipping.zipCode || ""
        },
        createdAt: serverTimestamp()
      };

      console.log("Attempting to place order with data:", orderData);

      const docRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Order placed successfully with ID:", docRef.id);

      setCheckoutDone(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (error: any) {
      console.error("CRITICAL: Error placing order:", error);
      
      // Provide more specific feedback
      if (error.message?.includes("undefined")) {
        toast.error("Data error: One of the fields was missing. Fixed now!");
      } else if (error.code === 'permission-denied') {
        toast.error("Permission denied. Check Firestore security rules.");
      } else {
        toast.error(`Order failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkoutDone) {
    return (
      <div className="container mx-auto px-6 py-20 text-center animate-fade-in">
        <div className="max-w-md mx-auto space-y-4">
          <div className="h-16 w-16 rounded-full bg-foreground text-background flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-foreground">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your purchase. This is a demo — no real order was placed.</p>
          <Link to="/shop">
            <Button className="rounded-lg gap-2 mt-4">
              Continue Shopping <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20 text-center animate-fade-in">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some items to get started.</p>
        <Link to="/shop">
          <Button className="rounded-lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-foreground tracking-tight mb-8">Cart</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}`}
              className="flex gap-4 p-4 rounded-xl shadow-card bg-card"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-24 w-20 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground truncate">{item.product.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Size: {item.size}</p>
                <p className="text-sm font-semibold text-foreground mt-1">${item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeItem(item.product.id, item.size)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                    className="h-7 w-7 rounded-md bg-muted flex items-center justify-center hover:bg-accent transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-medium w-6 text-center text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                    className="h-7 w-7 rounded-md bg-muted flex items-center justify-center hover:bg-accent transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary & Shipping */}
        <div className="space-y-6">
          <div className="rounded-xl shadow-card bg-card p-6 h-fit space-y-4">
            <h2 className="text-lg font-bold text-foreground">Shipping Details</h2>
            <div className="space-y-3">
              <Input 
                placeholder="Full Name" 
                value={shipping.fullName} 
                onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
              />
              <Input 
                placeholder="Address" 
                value={shipping.address} 
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  placeholder="City" 
                  value={shipping.city} 
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                />
                <Input 
                  placeholder="Zip Code" 
                  value={shipping.zipCode} 
                  onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl shadow-card bg-card p-6 h-fit space-y-4">
            <h2 className="text-lg font-bold text-foreground">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-foreground font-bold">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Button 
              className="w-full rounded-lg" 
              size="lg" 
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {user ? "Place Order" : "Login to Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
