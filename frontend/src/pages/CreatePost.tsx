import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatePostRequest } from '@/types';
import { apiClient } from '@/api/client';
import { useToast } from '@/hooks/use-toast';
import { ChefHat, Code2, Save, Eye, ArrowLeft, X, Plus, Upload, Image, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

export default function CreatePost() {
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: '',
    summary: '',
    content_md: '',
    type: 'recipe',
    tags: [],
    cover_image_url: '',
    external_links: [],
    status: 'draft',
    slug: '',
  });
  const [newTag, setNewTag] = useState('');
  const [newLink, setNewLink] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, formData.slug]);

  const handleInputChange = (field: keyof CreatePostRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (15MB limit)
      if (file.size > 15 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 15MB",
          variant: "destructive"
        });
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPEG, PNG, GIF, or WebP image",
          variant: "destructive"
        });
        return;
      }

      setSelectedImage(file);
      
      // Create local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to S3
      setUploadingImage(true);
      try {
        const url = await apiClient.uploadImage(file);
        handleInputChange('cover_image_url', url);
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully",
        });
      } catch (err) {
        toast({
          title: "Upload failed",
          description: err instanceof Error ? err.message : "Failed to upload image",
          variant: "destructive"
        });
        // Reset on error
        setSelectedImage(null);
        setImagePreview('');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    handleInputChange('cover_image_url', '');
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addLink = () => {
    if (newLink.trim() && !formData.external_links?.includes(newLink.trim())) {
      setFormData(prev => ({
        ...prev,
        external_links: [...(prev.external_links || []), newLink.trim()]
      }));
      setNewLink('');
    }
  };

  const removeLink = (link: string) => {
    setFormData(prev => ({
      ...prev,
      external_links: prev.external_links?.filter(l => l !== link) || []
    }));
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    setLoading(true);
    setError('');

    const submitData = { ...formData, status };

    // Validation
    if (!submitData.title || !submitData.content_md || !submitData.slug) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const post = await apiClient.createPost(submitData);
      toast({
        title: `Post ${status}!`,
        description: `Your post has been successfully ${status}.`,
      });
      navigate(`/posts/${post.slug}`);
    } catch (err) {
      if (err instanceof Error && err.message === 'Authentication required') {
        navigate('/login');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create post');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Link>
          </Button>

          <div className="flex items-center space-x-2">
            <div className={cn(
              "p-2 rounded-lg",
              formData.type === 'recipe' ? "bg-recipe/10 text-recipe" : "bg-tech/10 text-tech"
            )}>
              {formData.type === 'recipe' ? (
                <ChefHat className="h-5 w-5" />
              ) : (
                <Code2 className="h-5 w-5" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {formData.type === 'recipe' ? 'Recipe' : 'Tech Project'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Save className="h-5 w-5" />
                  <span>Create New Post</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Type Selection */}
                <div className="space-y-2">
                  <Label>Post Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'recipe' | 'tech') => handleInputChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recipe">Recipe</SelectItem>
                      <SelectItem value="tech">Tech Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="url-friendly-slug"
                    required
                  />
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                    placeholder="Brief description of your post"
                    rows={3}
                  />
                </div>

                {/* Cover Image */}
                <div className="space-y-3">
                  <Label>Cover Image</Label>
                  
                  {/* Manual URL input */}
                  <Input
                    value={formData.cover_image_url}
                    onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
                    placeholder="Or paste image URL directly"
                    type="url"
                    disabled={uploadingImage}
                  />

                  {/* Image Upload */}
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImage}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center space-y-2">
                          {uploadingImage ? (
                            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                          ) : (
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          )}
                          <div className="text-sm font-medium">
                            {uploadingImage ? 'Uploading...' : 'Upload Image'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Click to select an image file (max 15MB)
                          </div>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative group">
                        {uploadingImage && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                          </div>
                        )}
                        <img
                          src={imagePreview}
                          alt="Cover preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                          disabled={uploadingImage}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Image className="h-4 w-4" />
                        <span>{selectedImage?.name}</span>
                        {uploadingImage && <span className="text-xs">(Uploading to S3...)</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <Label>Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* External Links */}
                <div className="space-y-3">
                  <Label>External Links</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      placeholder="https://example.com"
                      type="url"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addLink}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.external_links && formData.external_links.length > 0 && (
                    <div className="space-y-2">
                      {formData.external_links.map((link, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm truncate flex-1">{link}</span>
                          <X
                            className="h-4 w-4 cursor-pointer hover:text-destructive ml-2"
                            onClick={() => removeLink(link)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    onClick={() => handleSubmit('draft')}
                    variant="outline"
                    disabled={loading || uploadingImage}
                    className="flex-1"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSubmit('published')}
                    disabled={loading || uploadingImage}
                    className="flex-1 bg-gradient-warm text-primary-foreground"
                  >
                    Publish
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Editor & Preview */}
          <div className="space-y-6">
            <Card className="h-[calc(100vh-12rem)] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Content</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 p-0">
                <Tabs defaultValue="write" className="h-full flex flex-col">
                  <div className="px-6 pb-3">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="write">Write</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="write" className="flex-1 px-6 pb-6">
                    <Textarea
                      value={formData.content_md}
                      onChange={(e) => handleInputChange('content_md', e.target.value)}
                      placeholder="Write your content in Markdown..."
                      className="h-full resize-none font-mono"
                      required
                    />
                  </TabsContent>

                  <TabsContent value="preview" className="flex-1 px-6 pb-6 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formData.content_md || '*No content to preview*'}
                      </ReactMarkdown>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}