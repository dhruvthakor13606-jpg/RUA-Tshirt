import { db } from "./firebase";
import { collection, doc, writeBatch, getDocs, deleteDoc } from "firebase/firestore";
import { products, categories as initialCategories } from "../data/products";

export const seedProducts = async () => {
  const batch = writeBatch(db);
  
  // Seed Products
  const productsRef = collection(db, "products");
  products.forEach((product) => {
    const docRef = doc(productsRef, product.id.toString());
    batch.set(docRef, product);
  });

  // Seed Categories
  const categoriesRef = collection(db, "categories");
  initialCategories.filter(c => c !== "All").forEach((cat) => {
    const docRef = doc(categoriesRef, cat.toLowerCase());
    batch.set(docRef, { name: cat });
  });

  try {
    await batch.commit();
    console.log("Database seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
};
