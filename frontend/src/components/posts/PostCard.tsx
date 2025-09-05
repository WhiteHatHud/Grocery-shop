import { Link } from 'react-router-dom';
import { Post } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat, Code2, Calendar, ExternalLink, Trash2, Star} from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/api/client';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const isRecipe = post.type === 'recipe';
  const isAuthenticated = apiClient.isAuthenticated();
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await apiClient.deletePost(post.id);
        toast({
          title: 'Post deleted',
          description: 'The post has been successfully deleted.',
        });
        onDelete?.();
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to delete post',
          variant: 'destructive',
        });
      }
    }
  };
  
  const handlePin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (post.pinned) {
        await apiClient.unpinPost(post.id);
        toast({
          title: 'Post unpinned',
          description: 'The post has been successfully unpinned.',
        });
      } else {
        await apiClient.pinPost(post.id);
        toast({
          title: 'Post pinned',
          description: 'The post has been pinned to the top.',
        });
      }
      onDelete?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to pin/unpin post',
        variant: 'destructive',
      });
    }
  };
return (
    <Card className={cn(
      "group card-hover h-full overflow-hidden relative",
      post.pinned && "ring-2 ring-accent/50"
    )}>
      {isAuthenticated && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <Button
            variant={post.pinned ? "default" : "secondary"}
            size="icon"
            className={cn(
              "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity",
              post.pinned && "opacity-100"
            )}
            onClick={handlePin}
          >
            <Star className={cn("h-4 w-4", post.pinned && "fill-current")} />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      {post.pinned && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="secondary" className="text-xs bg-accent text-accent-foreground">
            Pinned
          </Badge>
        </div>
      )}
      
      <Link to={`/posts/${post.slug}`} className="block h-full">
        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
        
        <CardHeader className="space-y-3">
          {/* Type Icon & Title */}
          <div className="flex items-start justify-between space-x-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
            </div>
            <div className={cn(
              "flex-shrink-0 p-2 rounded-lg transition-colors",
              isRecipe 
                ? "bg-recipe/10 text-recipe group-hover:bg-recipe group-hover:text-recipe-foreground" 
                : "bg-tech/10 text-tech group-hover:bg-tech group-hover:text-tech-foreground"
            )}>
              {isRecipe ? (
                <ChefHat className="h-5 w-5" />
              ) : (
                <Code2 className="h-5 w-5" />
              )}
            </div>
          </div>

          {/* Summary */}
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {post.summary}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs px-2 py-1"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {post.published_at && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString()}
                </time>
              </div>
            )}
            
            {post.external_links && post.external_links.length > 0 && (
              <div className="flex items-center space-x-1 text-accent">
                <ExternalLink className="h-3 w-3" />
                <span>{post.external_links.length} link{post.external_links.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}