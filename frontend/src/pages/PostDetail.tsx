import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Post } from '@/types';
import { apiClient } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChefHat, Code2, Calendar, ExternalLink, ArrowLeft, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const postData = await apiClient.getPost(slug);
        setPost(postData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load post. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, toast]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: post?.summary,
        url: window.location.href,
      });
    } catch {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Post link has been copied to your clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="h-64 bg-muted rounded" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Post Not Found</h1>
          <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isRecipe = post.type === 'recipe';

  return (
    <article className="min-h-screen py-8">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Link>
          </Button>
        </div>

        {/* Header */}
        <header className="space-y-6 mb-12">
          {/* Cover Image */}
          {post.cover_image_url && (
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          )}

          {/* Title & Meta */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isRecipe ? "bg-recipe/10 text-recipe" : "bg-tech/10 text-tech"
                  )}>
                    {isRecipe ? (
                      <ChefHat className="h-6 w-6" />
                    ) : (
                      <Code2 className="h-6 w-6" />
                    )}
                  </div>
                  <Badge 
                    variant="secondary"
                    className={cn(
                      isRecipe ? "bg-recipe/10 text-recipe" : "bg-tech/10 text-tech"
                    )}
                  >
                    {isRecipe ? "Recipe" : "Tech Project"}
                  </Badge>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
                  {post.title}
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.published_at && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              )}
              
              {post.external_links && post.external_links.length > 0 && (
                <div className="flex items-center space-x-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>{post.external_links.length} external link{post.external_links.length > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="font-display text-2xl font-semibold mt-8 mb-4 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="font-display text-xl font-semibold mt-6 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-display text-lg font-semibold mt-4 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 leading-relaxed text-foreground">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="mb-4 space-y-1 list-disc list-inside">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 space-y-1 list-decimal list-inside">
                  {children}
                </ol>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="px-1.5 py-0.5 bg-muted text-sm rounded font-mono">
                      {children}
                    </code>
                  );
                }
                return (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                    <code className="text-sm font-mono">{children}</code>
                  </pre>
                );
              },
            }}
          >
            {post.content_md}
          </ReactMarkdown>
        </div>

        {/* External Links */}
        {post.external_links && post.external_links.length > 0 && (
          <Card className="mt-12">
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center">
                <ExternalLink className="mr-2 h-5 w-5" />
                Related Links
              </h3>
              <div className="space-y-2">
                {post.external_links.map((link, index) => (
                  <div key={index}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-hover underline underline-offset-2 transition-colors"
                    >
                      {link}
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="my-12" />

        {/* Footer Navigation */}
        <footer className="flex justify-center">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Posts
            </Link>
          </Button>
        </footer>
      </div>
    </article>
  );
}