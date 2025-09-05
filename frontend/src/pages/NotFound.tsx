import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChefHat, Code2 } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 text-6xl opacity-50">
          <ChefHat className="h-16 w-16 text-recipe" />
          <Code2 className="h-16 w-16 text-tech" />
        </div>
        
        <div className="space-y-4">
          <h1 className="font-display text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground leading-relaxed">
            Oops! The page you're looking for doesn't exist. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <Button asChild size="lg" className="bg-gradient-warm text-primary-foreground">
          <Link to="/" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
