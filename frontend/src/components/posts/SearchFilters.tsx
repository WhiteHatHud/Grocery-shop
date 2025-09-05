import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PostFilters } from '@/types';
import { Search, X, ChefHat, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchFiltersProps {
  filters: PostFilters;
  onFiltersChange: (filters: PostFilters) => void;
  availableTags?: string[];
}

export function SearchFilters({ filters, onFiltersChange, availableTags = [] }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.q || '');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    onFiltersChange({ ...filters, q: debouncedSearchQuery || undefined });
  }, [debouncedSearchQuery]);

  const handleTypeFilter = (type: 'recipe' | 'tech' | undefined) => {
    onFiltersChange({ 
      ...filters, 
      type: filters.type === type ? undefined : type,
      page: 1 
    });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tag || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFiltersChange({ 
      ...filters, 
      tag: newTags.length > 0 ? newTags : undefined,
      page: 1 
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    onFiltersChange({ page: 1 });
  };

  const hasActiveFilters = filters.q || filters.type || (filters.tag && filters.tag.length > 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search recipes and projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.type === 'recipe' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTypeFilter('recipe')}
          className={cn(
            "transition-colors",
            filters.type === 'recipe'
              ? "bg-recipe text-recipe-foreground hover:bg-recipe-hover"
              : "hover:bg-recipe/10 hover:text-recipe hover:border-recipe/50"
          )}
        >
          <ChefHat className="mr-2 h-4 w-4" />
          Recipes
        </Button>
        
        <Button
          variant={filters.type === 'tech' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTypeFilter('tech')}
          className={cn(
            "transition-colors",
            filters.type === 'tech'
              ? "bg-tech text-tech-foreground hover:bg-tech-hover"
              : "hover:bg-tech/10 hover:text-tech hover:border-tech/50"
          )}
        >
          <Code2 className="mr-2 h-4 w-4" />
          Tech Projects
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Tag Filters */}
      {availableTags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Popular Tags</h4>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 12).map((tag) => {
              const isSelected = filters.tag?.includes(tag);
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground",
                    isSelected && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filter Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {filters.q && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{filters.q}"
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => {
                  setSearchQuery('');
                  onFiltersChange({ ...filters, q: undefined });
                }}
              />
            </Badge>
          )}
          
          {filters.type && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {filters.type}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => onFiltersChange({ ...filters, type: undefined })}
              />
            </Badge>
          )}
          
          {filters.tag?.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              Tag: {tag}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}