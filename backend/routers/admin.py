from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from core.dependencies import get_db, get_current_admin
from models.admin_user import AdminUser
from models.post import Post, PostStatus
from schemas.post import PostCreate, PostUpdate, PostResponse
from utils.slug import generate_unique_slug
from utils.s3 import s3_service

router = APIRouter()

@router.post("/posts", response_model=PostResponse)
async def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    # Generate unique slug
    slug = generate_unique_slug(post_data.title, db)
    
    # Set published_at if status is published
    published_at = None
    if post_data.status == PostStatus.published:
        published_at = datetime.now(timezone.utc)
    
    db_post = Post(
        slug=slug,
        title=post_data.title,
        summary=post_data.summary,
        content_md=post_data.content_md,
        type=post_data.type,
        status=post_data.status,
        tags=post_data.tags or [],
        cover_image_url=post_data.cover_image_url,
        external_links=post_data.external_links or [],
        published_at=published_at
    )
    
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    return db_post

@router.put("/posts/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    post_data: PostUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    
    if not db_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Update fields if provided
    update_data = post_data.model_dump(exclude_unset=True)
    
    # Handle slug update if title changed
    if "title" in update_data and update_data["title"] != db_post.title:
        update_data["slug"] = generate_unique_slug(update_data["title"], db, exclude_id=post_id)
    
    # Handle published_at
    if "status" in update_data:
        if update_data["status"] == PostStatus.published and db_post.status != PostStatus.published:
            update_data["published_at"] = datetime.now(timezone.utc)
        elif update_data["status"] != PostStatus.published:
            update_data["published_at"] = None
    
    for key, value in update_data.items():
        setattr(db_post, key, value)
    
    db_post.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_post)
    
    return db_post

@router.delete("/posts/{post_id}")
async def delete_post(
    post_id: str,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    soft_delete: bool = True
):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    
    if not db_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    if soft_delete:
        db_post.deleted = True
        db_post.updated_at = datetime.now(timezone.utc)
        db.commit()
        return {"message": "Post soft deleted successfully"}
    else:
        db.delete(db_post)
        db.commit()
        return {"message": "Post permanently deleted successfully"}
    
@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    current_admin = Depends(get_current_admin)
):
    """
    Upload an image to S3 and return the URL
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Validate file size (15MB limit)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 15MB)")
    
    # Upload to S3
    url = s3_service.upload_file(
        file_content=contents,
        file_name=file.filename,
        content_type=file.content_type
    )
    
    if not url:
        raise HTTPException(status_code=500, detail="Failed to upload image")
    
    return {"url": url}