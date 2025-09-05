import { useState, useEffect } from 'react';
import { PostGrid } from '@/components/posts/PostGrid';
import { SearchFilters } from '@/components/posts/SearchFilters';
import { Post, PostFilters } from '@/types';
import { apiClient } from '@/api/client';
import { Code2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Tech() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PostFilters>({ 
    type: 'tech',
    page_size: 12, 
    sort: 'newest' 
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);
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
        description: "Failed to fetch tech projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(filters);
  }, [filters]);

  const handleFiltersChange = (newFilters: PostFilters) => {
    setFilters({ ...newFilters, type: 'tech' });
  };
  
  const handleDelete = () => {
    fetchPosts(filters);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 bg-gradient-tech">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px]" />
        <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <Code2 className="h-16 w-16 sm:h-20 sm:w-20 text-tech-foreground animate-bounce" />
              <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-accent animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-6xl font-bold text-tech-foreground">
                Tech Projects
              </h1>
              <p className="text-lg sm:text-xl text-tech-foreground/90 max-w-2xl mx-auto leading-relaxed">
                Frontend, Backend, Fullstack, DevOps, AI/ML, and more. Follow to learn more about my journey in tech.
              </p>
            </div>

            <div className="text-tech-foreground/80 text-lg">
              {loading ? "Loading projects..." : `${posts.length} innovative projects to discover`}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Search & Filters */}
          <SearchFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            availableTags={availableTags}
          />

          {/* Tech Grid */}
          <PostGrid posts={posts} loading={loading} onDelete={handleDelete} />

          {/* No Results State */}
          {!loading && posts.length === 0 && (
            <div className="text-center py-16 space-y-4">
              <Code2 className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
              <h3 className="text-lg font-medium">No tech projects found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search terms or browse all our innovative projects 
                by clearing the filters above.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}