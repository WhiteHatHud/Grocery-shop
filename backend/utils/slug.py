import re
from typing import Optional
from sqlalchemy.orm import Session
from models.post import Post

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def generate_unique_slug(title: str, db: Session, exclude_id: Optional[str] = None) -> str:
    """Generate a unique slug from title, handling collisions."""
    base_slug = slugify(title)
    slug = base_slug
    counter = 1
    
    while True:
        query = db.query(Post).filter(Post.slug == slug)
        if exclude_id:
            query = query.filter(Post.id != exclude_id)
        
        if not query.first():
            return slug
        
        slug = f"{base_slug}-{counter}"
        counter += 1