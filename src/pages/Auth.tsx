import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, db, isMock, mockSignIn, mockSignUp } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { UserProfile } from "@/types/user";

/** Login / Register UI with Firebase integration */
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isMock) {
        if (isLogin) {
          await mockSignIn(email, password);
          toast.success("Welcome back (Mock Mode)!");
        } else {
          await mockSignUp(email, password);
          toast.success("Account created (Mock Mode)!");
        }
        navigate("/");
        return;
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (fullName) {
          await updateProfile(user, { displayName: fullName });
        }

        // Save to users collection
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: fullName || user.email?.split('@')[0] || "User",
          createdAt: new Date().toISOString(),
          role: 'user'
        });

        toast.success("Account created successfully!");
      }
      navigate("/");
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLogin ? "Sign in to your account" : "Sign up to get started"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleAuth}>
          {!isLogin && (
            <Input 
              placeholder="Full Name" 
              className="rounded-lg" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <Input 
            type="email" 
            placeholder="Email" 
            className="rounded-lg" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            type="password" 
            placeholder="Password" 
            className="rounded-lg" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full rounded-lg" size="lg" disabled={loading}>
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-foreground hover:underline"
            type="button"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
