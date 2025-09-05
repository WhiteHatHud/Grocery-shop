import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PostGrid } from '@/components/posts/PostGrid';
import { SearchFilters } from '@/components/posts/SearchFilters';
import { Post, PostFilters } from '@/types';
import { apiClient } from '@/api/client';
import { ChefHat, Code2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PostFilters>({ page_size: 12, sort: 'newest' });
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'recipes' | 'tech'>('all');
  const { toast } = useToast();

  const fetchPosts = async (currentFilters: PostFilters) => {
    try {
      setLoading(true);
      const response = await apiClient.listPosts(currentFilters);
      setPosts(response.items);
      
      // Extract unique tags for filter suggestions
      const allTags = response.items.flatMap(post => post.tags || []);
      const uniqueTags = Array.from(new Set(allTags));
      setAvailableTags(uniqueTags);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
      const tabFilters = { ...filters };
      if (activeTab === 'recipes') {
        tabFilters.type = 'recipe';
      } else if (activeTab === 'tech') {
        tabFilters.type = 'tech';
      } else {
        delete tabFilters.type;
      }
      
      fetchPosts(tabFilters);
    };
  useEffect(() => {
    const tabFilters = { ...filters };
    if (activeTab === 'recipes') {
      tabFilters.type = 'recipe';
    } else if (activeTab === 'tech') {
      tabFilters.type = 'tech';
    } else {
      delete tabFilters.type;
    }
    
    fetchPosts(tabFilters);
  }, [activeTab]);

  useEffect(() => {
    fetchPosts(filters);
  }, [filters]);

  const handleFiltersChange = (newFilters: PostFilters) => {
    setFilters(newFilters);
    // Reset tab to 'all' when filters are applied
    if (newFilters.type !== filters.type) {
      if (newFilters.type === 'recipe') {
        setActiveTab('recipes');
      } else if (newFilters.type === 'tech') {
        setActiveTab('tech');
      } else {
        setActiveTab('all');
      }
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'all' | 'recipes' | 'tech');
    const newFilters = { ...filters, page: 1 };
    delete newFilters.type;
    setFilters(newFilters);
  };

  const currentFilters = {
    ...filters,
    ...(activeTab === 'recipes' ? { type: 'recipe' as const } : {}),
    ...(activeTab === 'tech' ? { type: 'tech' as const } : {})
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 bg-gradient-hero">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px]" />
        <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 text-4xl sm:text-5xl">
              <ChefHat className="h-12 w-12 sm:h-16 sm:w-16 text-recipe animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="relative">
                <img 
                  src="/my-image.png" 
                  alt="Profile" 
                  className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-2 border-primary animate-bounce object-cover" 
                  style={{ animationDelay: '0.25s' }} 
                />
              </div>
               <Code2 className="h-12 w-12 sm:h-16 sm:w-16 text-tech animate-bounce" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-6xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                Recipes & Code
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A cozy corner where culinary creativity meets technical innovation. 
                Discover delicious recipes and explore exciting tech projects.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-recipe text-recipe-foreground hover:shadow-glow transition-all duration-300"
                onClick={() => setActiveTab('recipes')}
              >
                <ChefHat className="mr-2 h-5 w-5" />
                Explore Recipes
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-gradient-tech text-tech-foreground border-tech hover:shadow-glow transition-all duration-300"
                onClick={() => setActiveTab('tech')}
              >
                <Code2 className="mr-2 h-5 w-5" />
                View Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <TabsList className="grid w-full sm:w-auto grid-cols-3 h-12">
                <TabsTrigger value="all" className="text-sm font-medium">
                  All Posts
                </TabsTrigger>
                <TabsTrigger value="recipes" className="text-sm font-medium">
                  <ChefHat className="mr-2 h-4 w-4" />
                  Recipes
                </TabsTrigger>
                <TabsTrigger value="tech" className="text-sm font-medium">
                  <Code2 className="mr-2 h-4 w-4" />
                  Tech
                </TabsTrigger>
              </TabsList>

              <div className="text-sm text-muted-foreground">
                {loading ? "Loading..." : `${posts?.length ?? 0} posts found`}
              </div>
            </div>

            {/* Search & Filters */}
            <SearchFilters
              filters={currentFilters}
              onFiltersChange={handleFiltersChange}
              availableTags={availableTags}
            />

            {/* Content Tabs */}
            <TabsContent value="all" className="space-y-6">
              <PostGrid posts={posts} loading={loading} onDelete={handleDelete} />
            </TabsContent>

            <TabsContent value="recipes" className="space-y-6">
              <PostGrid posts={posts} loading={loading} onDelete={handleDelete} />
            </TabsContent>

            <TabsContent value="tech" className="space-y-6">
              <PostGrid posts={posts} loading={loading} onDelete={handleDelete} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}