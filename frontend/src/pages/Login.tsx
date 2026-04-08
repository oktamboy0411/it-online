import { useState } from "react";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStoredRole, setStoredRole, type UserRole } from "@/routers";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(getStoredRole);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredRole(selectedRole);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-reveal">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-4 shadow-lg shadow-primary/20">
            <GraduationCap className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Raqamli Sinf</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Informatika darslari uchun onlayn platforma
          </p>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex bg-secondary rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${
                isLogin
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Kirish
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${
                !isLogin
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Ro'yxatdan o'tish
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="name">To'liq ism</Label>
                <Input id="name" placeholder="Ismingizni kiriting" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Parol</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                value={selectedRole}
                onChange={(event) =>
                  setSelectedRole(event.target.value as UserRole)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="admin">Admin</option>
                <option value="teacher">O'qituvchi</option>
                <option value="student">O'quvchi</option>
              </select>
            </div>
            <Button
              type="submit"
              className="w-full active:scale-[0.98] transition-transform"
            >
              {isLogin ? "Kirish" : "Ro'yxatdan o'tish"}
            </Button>
          </form>

          {isLogin && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              Parolni unutdingizmi?{" "}
              <button className="text-primary hover:underline">Tiklash</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export { Login };
