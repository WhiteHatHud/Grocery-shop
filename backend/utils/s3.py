import boto3
from botocore.exceptions import ClientError
import uuid
from typing import Optional
import os
from core.config import settings

class S3Service:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        self.bucket_name = settings.S3_BUCKET_NAME
        self.region = settings.AWS_REGION

    def upload_file(self, file_content: bytes, file_name: str, content_type: str) -> Optional[str]:
        """
        Upload a file to S3 and return the public URL
        """
        try:
            # Generate unique filename
            file_extension = file_name.split('.')[-1] if '.' in file_name else 'jpg'
            unique_filename = f"posts/{uuid.uuid4()}.{file_extension}"
            
            # Upload to S3
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=unique_filename,
                Body=file_content,
                ContentType=content_type
            )
            
            # Return the public URL
            url = f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{unique_filename}"
            return url
            
        except ClientError as e:
            print(f"Error uploading to S3: {e}")
            return None

    def delete_file(self, file_url: str) -> bool:
        """
        Delete a file from S3 given its URL
        """
        try:
            # Extract the key from the URL
            key = file_url.split('.amazonaws.com/')[-1]
            
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=key
            )
            return True
            
        except ClientError as e:
            print(f"Error deleting from S3: {e}")
            return False

s3_service = S3Service()