import uuid
from sqlalchemy import Column, String, Text, DateTime, Boolean, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import enum
from db.database import Base

class PostType(str, enum.Enum):
    recipe = "recipe"
    tech = "tech"

class PostStatus(str, enum.Enum):
    draft = "draft"
    published = "published"

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    summary = Column(Text)
    content_md = Column(Text)
    type = Column(Enum(PostType), nullable=False)
    status = Column(Enum(PostStatus), default=PostStatus.draft)
    tags = Column(JSON, default=list)
    cover_image_url = Column(String, nullable=True)
    external_links = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)
    deleted = Column(Boolean, default=False)
    pinned = Column(Boolean, default=False, nullable=False)