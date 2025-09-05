import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefHat, Code2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { apiClient } from '@/api/client';

export function Header() {
  const location = useLocation();
  const isAuthenticated = apiClient.isAuthenticated();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    apiClient.logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="flex items-center space-x-1 text-2xl">
               <img 
                src="/my-image.png" 
                alt="Profile" 
                className="h-8 w-8 rounded-full object-cover transition-transform duration-500 group-hover:rotate-360" 
              />
            </div>
          </div>
          <div className="font-display text-xl font-semibold bg-gradient-warm bg-clip-text text-transparent">
            {siteConfig.name}
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Button
            asChild
            variant={isActive('/') ? 'default' : 'ghost'}
            className={cn(
              "font-medium transition-colors",
              isActive('/') 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Link to="/">Home</Link>
          </Button>
          
          <Button
            asChild
            variant={isActive('/recipes') ? 'default' : 'ghost'}
            className={cn(
              "font-medium transition-colors",
              isActive('/recipes')
                ? "bg-recipe text-recipe-foreground"
                : "hover:bg-recipe/10 hover:text-recipe"
            )}
          >
            <Link to="/recipes" className="flex items-center space-x-2">
              <ChefHat className="h-4 w-4" />
              <span>Recipes</span>
            </Link>
          </Button>

          <Button
            asChild
            variant={isActive('/tech') ? 'default' : 'ghost'}
            className={cn(
              "font-medium transition-colors",
              isActive('/tech')
                ? "bg-tech text-tech-foreground"
                : "hover:bg-tech/10 hover:text-tech"
            )}
          >
            <Link to="/tech" className="flex items-center space-x-2">
              <Code2 className="h-4 w-4" />
              <span>Tech</span>
            </Link>
          </Button>

          <Button
            asChild
            variant={isActive('/about') ? 'default' : 'ghost'}
            className="font-medium"
          >
            <Link to="/about">About</Link>
          </Button>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/new">New Post</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/login" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t px-4 py-2">
        <nav className="flex items-center justify-center space-x-4">
          <Button
            asChild
            variant={isActive('/') ? 'default' : 'ghost'}
            size="sm"
          >
            <Link to="/">Home</Link>
          </Button>
          <Button
            asChild
            variant={isActive('/recipes') ? 'default' : 'ghost'}
            size="sm"
          >
            <Link to="/recipes">Recipes</Link>
          </Button>
          <Button
            asChild
            variant={isActive('/tech') ? 'default' : 'ghost'}
            size="sm"
          >
            <Link to="/tech">Tech</Link>
          </Button>
          <Button
            asChild
            variant={isActive('/about') ? 'default' : 'ghost'}
            size="sm"
          >
            <Link to="/about">About</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}