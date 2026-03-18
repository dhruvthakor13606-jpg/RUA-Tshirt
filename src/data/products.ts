/** Product data for the T-Shirt Store */

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  color: string;
  image: string;
  description: string;
  isTrending: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Essential Heavyweight Tee",
    price: 35.0,
    category: "Essentials",
    color: "Black",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    description: "A boxy, heavy-duty cotton tee designed for longevity. Features a reinforced rib-knit neck and double-needle stitching.",
    isTrending: true,
  },
  {
    id: 2,
    name: "Abstract 'Vision' Graphic",
    price: 42.0,
    category: "Graphic",
    color: "White",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
    description: "Limited edition screen-printed graphic on our signature organic cotton base. Art by Studio Minimal.",
    isTrending: true,
  },
  {
    id: 3,
    name: "Premium Pima Crew",
    price: 55.0,
    category: "Premium",
    color: "Navy",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800",
    description: "Sourced from the finest Peruvian Pima cotton. Unmatched softness with a subtle natural sheen.",
    isTrending: false,
  },
  {
    id: 4,
    name: "Vintage Wash Pocket Tee",
    price: 38.0,
    category: "Essentials",
    color: "Olive",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
    description: "Garment-dyed for a lived-in feel from day one. Features a functional chest pocket and relaxed fit.",
    isTrending: false,
  },
  {
    id: 5,
    name: "Geometric 'Flow' Tee",
    price: 45.0,
    category: "Graphic",
    color: "Charcoal",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
    description: "A high-density puff print graphic that adds texture and dimension to your daily rotation.",
    isTrending: true,
  },
  {
    id: 6,
    name: "Supima V-Neck",
    price: 48.0,
    category: "Premium",
    color: "Heather Gray",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
    description: "The perfect layering piece. Breathable, moisture-wicking, and holds its shape wash after wash.",
    isTrending: false,
  },
  {
    id: 7,
    name: "Standard Long Sleeve",
    price: 40.0,
    category: "Essentials",
    color: "Black",
    image: "https://images.unsplash.com/photo-1618354691229-88d47f285158?auto=format&fit=crop&q=80&w=800",
    description: "A versatile long-sleeve option with cuffed wrists and a standard athletic fit.",
    isTrending: false,
  },
  {
    id: 8,
    name: "Cyberpunk 'Neon' Graphic",
    price: 45.0,
    category: "Graphic",
    color: "Black",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
    description: "Bold, vibrant colors meet high-contrast design. A statement piece for the modern urbanite.",
    isTrending: true,
  },
  {
    id: 9,
    name: "Luxury Silk-Blend Tee",
    price: 85.0,
    category: "Premium",
    color: "Off-White",
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=800",
    description: "70% Cotton, 30% Silk. The ultimate in luxury basics. Drape and comfort beyond compare.",
    isTrending: false,
  },
  {
    id: 10,
    name: "Minimalist Logo Tee",
    price: 32.0,
    category: "Essentials",
    color: "White",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    description: "Our classic white tee with a micro-embroidered logo on the left chest. Subtle and clean.",
    isTrending: false,
  },
];

export const categories = ["All", "Essentials", "Graphic", "Premium"];
