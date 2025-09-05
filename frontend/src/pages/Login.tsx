import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiClient } from '@/api/client';
import { useToast } from '@/hooks/use-toast';
import { LogIn, ArrowLeft, ChefHat, Code2 } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiClient.login(username, password);
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
      navigate('/admin/new');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
      <div className="w-full max-w-md space-y-8">
        {/* Navigation */}
        <div className="flex justify-center">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="inline-flex items-center text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-3xl">
            <ChefHat className="h-8 w-8 text-recipe" />
            <Code2 className="h-8 w-8 text-tech" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">Admin Login</h2>
            <p className="text-muted-foreground">
              Sign in to create and manage your posts
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center space-x-2">
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-warm text-primary-foreground hover:shadow-glow transition-all"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Don't have an account? Contact the administrator.
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}