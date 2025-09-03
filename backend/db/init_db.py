import logging
from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.admin_user import AdminUser
from core.security import get_password_hash
from core.config import settings

logger = logging.getLogger(__name__)

def init_db():
    db = SessionLocal()
    try:
        # Check if admin user exists
        admin = db.query(AdminUser).filter(
            AdminUser.username == settings.ADMIN_USERNAME
        ).first()
        
        if not admin:
            # Create admin user
            admin = AdminUser(
                username=settings.ADMIN_USERNAME,
                password_hash=get_password_hash(settings.ADMIN_PASSWORD)
            )
            db.add(admin)
            db.commit()
            logger.info(f"Admin user '{settings.ADMIN_USERNAME}' created")
        else:
            logger.info(f"Admin user '{settings.ADMIN_USERNAME}' already exists")
            
    finally:
        db.close()