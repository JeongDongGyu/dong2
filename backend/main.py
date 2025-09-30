from fastapi import FastAPI
from database import engine
import models
import dogs_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dog Dictionary API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# mount static upload dir
uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'uploads'))
os.makedirs(uploads_dir, exist_ok=True)
app.mount('/uploads', StaticFiles(directory=uploads_dir), name='uploads')

app.include_router(dogs_router.router)

@app.get("/")
def root():
    return {"message": "Dog Dictionary API"}