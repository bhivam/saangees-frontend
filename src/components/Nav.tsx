import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="ml-2 text-xl font-semibold text-gray-900">
              Saangee's Kitchen
            </span>
          </div>
          <div className="flex items-center gap-4">
            {!isAuthenticated && (
              <Button onClick={handleLogin} variant="default">
                Login
              </Button>
            )}

            {isAuthenticated && !user?.is_admin && (
              <>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                <span className="text-gray-600">Welcome {user?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            )}

            {isAuthenticated && user?.is_admin && (
              <>
                <span className="text-gray-600">Admin</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
