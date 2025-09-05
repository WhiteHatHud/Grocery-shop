from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from models.post import PostType, PostStatus

class PostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    summary: Optional[str] = Field(None, max_length=500)
    content_md: Optional[str] = None
    type: PostType
    tags: Optional[List[str]] = []
    cover_image_url: Optional[str] = None
    external_links: Optional[List[str]] = []
    pinned: Optional[bool] = False

class PostCreate(PostBase):
    status: PostStatus = PostStatus.draft

class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    summary: Optional[str] = Field(None, max_length=500)
    content_md: Optional[str] = None
    type: Optional[PostType] = None
    status: Optional[PostStatus] = None
    tags: Optional[List[str]] = None
    cover_image_url: Optional[str] = None
    external_links: Optional[List[str]] = None

class PostResponse(PostBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    slug: str
    status: PostStatus
    created_at: datetime
    updated_at: Optional[datetime]
    published_at: Optional[datetime]
    pinned: bool

class PostList(BaseModel):
    posts: List[PostResponse]
    total: int
    page: int
    page_size: int
    total_pages: int