import { Post } from '@/types';
import { PostCard } from './PostCard';

interface PostGridProps {
  posts: Post[];
  loading?: boolean;
  onDelete?: () => void;
}

export function PostGrid({ posts, loading, onDelete }: PostGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-48 bg-muted animate-pulse rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">No posts found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }

  const sortedPosts = [...posts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedPosts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={onDelete} />
      ))}
    </div>
  );
}