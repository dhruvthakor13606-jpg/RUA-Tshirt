import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/shop/ProductCard";
import ProductSkeleton from "@/components/shop/ProductSkeleton";
import { categories, Product } from "@/data/products";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { seedProducts } from "@/lib/seedProducts";
import { toast } from "sonner";

/** Shop page with Firestore integration, search, and category filters */
const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>(["All"]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<"default" | "low" | "high">("default");
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Products
        const productsSnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = productsSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.data().id
        })) as Product[];
        setProducts(fetchedProducts);

        // Fetch Categories
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const fetchedCats = categoriesSnapshot.docs.map(doc => doc.data().name as string);
        if (fetchedCats.length > 0) {
          setDbCategories(["All", ...fetchedCats]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load shop data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    const success = await seedProducts();
    if (success) {
      toast.success("Products seeded! Reloading...");
      window.location.reload();
    } else {
      toast.error("Failed to seed products");
    }
    setSeeding(false);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
  };

  const filtered = useMemo(() => {
    let result = products;
    if (category !== "All") result = result.filter((p) => p.category === category);
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "high") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [category, search, sortBy, products]);

  return (
    <div className="container mx-auto px-6 py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-foreground tracking-tight mb-8">Shop</h1>

      {/* Filters row */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-lg"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {dbCategories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              className="rounded-lg"
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Price sort */}
        <div className="flex gap-2 ml-auto">
          <Button
            variant={sortBy === "low" ? "default" : "outline"}
            size="sm"
            className="rounded-lg"
            onClick={() => setSortBy(sortBy === "low" ? "default" : "low")}
          >
            Price ↑
          </Button>
          <Button
            variant={sortBy === "high" ? "default" : "outline"}
            size="sm"
            className="rounded-lg"
            onClick={() => setSortBy(sortBy === "high" ? "default" : "high")}
          >
            Price ↓
          </Button>
        </div>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
          <p className="text-muted-foreground mb-4">No products found in the database.</p>
          <Button onClick={handleSeed} disabled={seeding} variant="outline">
            {seeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Seed Initial Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
