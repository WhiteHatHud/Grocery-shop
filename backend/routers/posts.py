from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc
from core.dependencies import get_db
from models.post import Post, PostStatus, PostType
from schemas.post import PostResponse, PostList
from schemas.common import PaginationParams
from models.admin_user import AdminUser
from core.dependencies import get_current_admin

router = APIRouter()

@router.get("", response_model=PostList)
async def list_posts(
    db: Session = Depends(get_db),
    type: Optional[PostType] = None,
    tag: Optional[str] = None,
    q: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort: str = Query("newest", regex="^(newest|oldest|title)$")
):
    # Base query - only published and not deleted posts
    query = db.query(Post).filter(
        Post.status == PostStatus.published,
        Post.deleted == False
    )
    # Apply filters
    if type:
        query = query.filter(Post.type == type)
    if tag:
        query = query.filter(Post.tags.contains(f'"{tag}"'))
    if q:
        search_term = f"%{q}%"
        query = query.filter(
            or_(
                Post.title.ilike(search_term),
                Post.summary.ilike(search_term),
                Post.content_md.ilike(search_term)
            )
        )
    # Apply sorting (pinned first)
    query = query.order_by(desc(Post.pinned), desc(Post.published_at))
    # Get total count
    total = query.count()
    # Apply pagination
    offset = (page - 1) * page_size
    posts = query.offset(offset).limit(page_size).all()
    return PostList(
        posts=posts,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )

@router.get("/{id_or_slug}", response_model=PostResponse)
async def get_post(
    id_or_slug: str,
    db: Session = Depends(get_db)
):
    # Try to find by ID first, then by slug
    post = db.query(Post).filter(
        and_(
            or_(Post.id == id_or_slug, Post.slug == id_or_slug),
            Post.status == PostStatus.published,
            Post.deleted == False
        )
    ).first()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    return post