from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Header
from sqlalchemy.orm import Session
import models
import schemas
from database import SessionLocal, engine
from fastapi import status
from fastapi.responses import JSONResponse
import os
import shutil
import uuid

router = APIRouter(prefix="/api/v1/dogs", tags=["dogs"]) 

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Admin check dependency
def require_admin(x_admin_key: str = Header(None)):
    ADMIN_KEY = os.getenv('ADMIN_KEY', 'supersecret')
    if x_admin_key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="admin key missing or incorrect")
    return True

@router.get("/")
def list_dogs(search: str = None, page: int = 1, limit: int = 10, db: Session = Depends(get_db)):
    q = db.query(models.Dog)
    if search:
        like = f"%{search}%"
        q = q.filter((models.Dog.name.like(like)) | (models.Dog.description.like(like)))
    total = q.count()
    items = q.order_by(models.Dog.id).offset((page-1)*limit).limit(limit).all()
    
    
    return {"total": total, "page": page, "limit": limit, "items": items}

@router.get("/{dog_id}")
def get_dog(dog_id: int, db: Session = Depends(get_db)):
    dog = db.query(models.Dog).filter(models.Dog.id == dog_id).first()
    if not dog:
        raise HTTPException(status_code=404, detail="Dog not found")
    photos = db.query(models.UserPhoto).filter(models.UserPhoto.dog_id == dog_id).all()
    return {"dog": dog, "photos": photos}

@router.post("/", status_code=201)
def create_dog(payload: schemas.DogCreate, db: Session = Depends(get_db), admin: bool = Depends(require_admin)):
    obj = models.Dog(name=payload.name, description=payload.description)
    db.add(obj)
    try:
        db.commit()
        db.refresh(obj)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return obj

@router.put("/{dog_id}")
def update_dog(dog_id: int, payload: schemas.DogUpdate, db: Session = Depends(get_db), admin: bool = Depends(require_admin)):
    dog = db.query(models.Dog).filter(models.Dog.id == dog_id).first()
    if not dog:
        raise HTTPException(status_code=404, detail="Dog not found")
    if payload.description is not None:
        dog.description = payload.description
    if payload.image_url is not None:
        dog.image_url = payload.image_url
    db.add(dog)
    db.commit()
    db.refresh(dog)
    return dog

@router.post("/{dog_id}/photos")
def upload_photo(dog_id: int, file: UploadFile = File(...), uploaded_by: str = Form(None), db: Session = Depends(get_db)):
    dog = db.query(models.Dog).filter(models.Dog.id == dog_id).first()
    if not dog:
        raise HTTPException(status_code=404, detail="Dog not found")

    uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
    uploads_dir = os.path.abspath(uploads_dir)
    os.makedirs(uploads_dir, exist_ok=True)

    filename = f"{uuid.uuid4().hex}_{file.filename}"
    dest = os.path.join(uploads_dir, filename)
    with open(dest, 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)

    photo_url = f"/uploads/{filename}"
    photo = models.UserPhoto(dog_id=dog_id, photo_url=photo_url, uploaded_by=uploaded_by)
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return {"id": photo.id, "dog_id": photo.dog_id, "photo_url": photo.photo_url, "uploaded_by": photo.uploaded_by}

@router.delete("/{dog_id}")
async def delete_dog(dog_id: int, db: Session = Depends(get_db),admin: bool = Depends(require_admin)):
    # 강아지 찾기
    dog_model = db.query(models.Dog).filter(models.Dog.id == dog_id).first()
    
    if dog_model is None:
        raise HTTPException(status_code=404, detail="Dog not found")
    
    # 관련 사진들도 함께 삭제 (UserPhoto 테이블 사용)
    db.query(models.UserPhoto).filter(models.UserPhoto.dog_id == dog_id).delete()
    
    # 강아지 정보 삭제
    db.query(models.Dog).filter(models.Dog.id == dog_id).delete()
    db.commit()
    
    return {"message": "Dog deleted successfully"}


