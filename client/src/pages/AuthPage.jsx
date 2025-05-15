import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { useTheme } from "@/components/ui/theme-provider";
import {
  Lock,
  User,
  Smartphone,
  ChevronLeft,
  LogIn,
  UserPlus,
} from "lucide-react";
import NumericKeypad from "@/components/ui/NumericKeypad";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const { theme } = useTheme();

  const handleKeyPress = (value) => {
    if (value === "backspace") {
      setPassword((prev) => prev.slice(0, -1));
    } else if (password.length < 6) {
      setPassword((prev) => prev + value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-2xl p-8 border border-border/40 backdrop-blur-lg"
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-primary hover:opacity-80 transition">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-2xl font-display font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <div className="w-6" />
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <div className="glass-input-group">
              <User className="icon" size={18} />
              <input
                type="text"
                placeholder="Username"
                className="glass-input"
                required
              />
            </div>

            {!isLogin && (
              <div className="glass-input-group">
                <Smartphone className="icon" size={18} />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="glass-input"
                  required
                />
              </div>
            )}

            <div className="glass-input-group">
              <Lock className="icon" size={18} />
              <input
                type="password"
                value={password}
                placeholder="Enter PIN"
                className="glass-input"
                readOnly
              />
            </div>
          </div>

          <NumericKeypad
            onKeyPress={handleKeyPress}
            password={password}
            theme={theme}
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-medium transition opacity-90 hover:opacity-100"
            type="submit"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm opacity-80">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-primary hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
