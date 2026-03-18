import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import { Review } from "@/types/ecommerce";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { Star } from "lucide-react";

const sizes = ["XS", "S", "M", "L", "XL"];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<any>(null);
  const [rRating, setRRating] = useState(5);
  const [rComment, setRComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch Product
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ ...docSnap.data(), id: Number(docSnap.id) } as Product);
        }

        // Fetch Reviews
        const q = query(collection(db, "reviews"), where("productId", "==", Number(id)));
        const querySnapshot = await getDocs(q);
        const fetchedReviews = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Review[];
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching product/reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to post a review");
      return;
    }
    if (!rComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setSubmittingReview(true);
    try {
      const newReview: any = {
        productId: Number(id),
        userId: user.uid,
        userName: user.displayName || user.email.split('@')[0],
        rating: rRating,
        comment: rComment,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "reviews"), newReview);
      setReviews([{ ...newReview, id: docRef.id }, ...reviews]);
      setRComment("");
      setRRating(5);
      toast.success("Review posted!");
    } catch (error) {
      console.error("Error posting review:", error);
      toast.error("Failed to post review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-40 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/shop">
          <Button variant="outline" className="mt-4 rounded-lg">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="container mx-auto px-6 py-10 animate-fade-in">
      <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="aspect-[3/4] overflow-hidden rounded-xl bg-muted">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mt-1">{product.name}</h1>
          </div>

          <p className="text-2xl font-semibold text-foreground">${product.price.toFixed(2)}</p>

          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Color</span>
            <p className="text-sm text-foreground">{product.color}</p>
          </div>

          {/* Size selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Size</span>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-10 w-10 rounded-lg text-sm font-medium transition-all ${
                    selectedSize === size
                      ? "bg-foreground text-background"
                      : "bg-muted text-foreground hover:bg-accent"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" className="rounded-lg gap-2 w-full md:w-auto" onClick={handleAdd} disabled={added}>
            {added ? (
              <>
                <Check className="h-4 w-4" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" /> Add to Cart — ${product.price.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 border-t border-border pt-16">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Review List */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground italic">No reviews yet. Be the first to share your thoughts!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 rounded-xl bg-card shadow-sm border border-border space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-foreground">{review.userName}</p>
                        <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-foreground text-foreground" : "text-muted"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Review Form */}
          <div className="h-fit sticky top-24 p-6 rounded-xl bg-muted/30 border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Write a Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRRating(num)}
                        className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
                          rRating >= num ? "bg-foreground text-background" : "bg-card text-foreground border border-border"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Comment</label>
                  <textarea
                    value={rComment}
                    onChange={(e) => setRComment(e.target.value)}
                    className="w-full min-h-[100px] p-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    placeholder="What did you like or dislike about this tee?"
                  />
                </div>
                <Button type="submit" className="w-full rounded-lg" disabled={submittingReview}>
                  {submittingReview ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Submit Review
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">Please login to write a review</p>
                <Link to="/auth">
                  <Button variant="outline" className="rounded-lg w-full">Login</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
