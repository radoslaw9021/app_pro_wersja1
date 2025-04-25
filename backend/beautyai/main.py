from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import os
import shutil
import base64
import numpy as np
import io
from PIL import Image
import logging

# ✅ Konfiguracja loggera
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ✅ OAuth2 token (ważne, że jest przed użyciem!)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ✅ LOKALNE MODUŁY
from backend.beautyai import models, schemas
from backend.beautyai.models import Base
from backend.beautyai.database import SessionLocal, engine

# ✅ Kryptografia haseł
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ✅ Konfiguracja JWT
SECRET_KEY = "YOUR_SECRET_KEY_HERE"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# ✅ Inicjalizacja FastAPI
app = FastAPI(
    title="BeautyAI API",
    description="API dla systemu wspierającego kosmetologów w analizie skóry i tworzeniu planów pielęgnacji",
    version="1.0.0"
)

# ✅ Konfiguracja CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Ścieżka na uploady
UPLOAD_DIRECTORY = "uploads/"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# ✅ Dependency - baza danych
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Funkcje autoryzacji
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ✅ Dependency do tokenu i użytkownika
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_admin_user(current_user: schemas.User = Depends(get_current_active_user)):
    if current_user.role not in [models.UserRole.ADMIN, models.UserRole.SUPERADMIN]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return current_user

async def get_superadmin_user(current_user: schemas.User = Depends(get_current_active_user)):
    if current_user.role != models.UserRole.SUPERADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only superadmin can access this endpoint")
    return current_user

# ✅ Tworzenie superadmina
def create_superadmin():
    db = SessionLocal()
    try:
        existing = db.query(models.User).filter(models.User.email == "tymon.radek@gmail.com").first()
        if not existing:
            superadmin = models.User(
                email="tymon.radek@gmail.com",
                hashed_password=get_password_hash("Blok277290Interia2025!@#"),
                full_name="Super Admin",
                role=models.UserRole.SUPERADMIN,
                is_active=True
            )
            db.add(superadmin)
            db.commit()
            logger.info("✅ Superadmin utworzony!")
        else:
            logger.info("🔐 Superadmin już istnieje.")
    except Exception as e:
        logger.error(f"❌ Błąd przy tworzeniu superadmina: {e}")
    finally:
        db.close()

# ✅ Endpoint logowania
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

# ✅ Endpoint testowy
@app.get("/")
def read_root():
    return {"message": "Welcome to BeautyAI API"}

# ✅ Procedura uruchomieniowa
@app.on_event("startup")
async def startup_event():
    logger.info("🔄 Inicjalizacja API...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Tabele utworzone")
    except Exception as e:
        logger.error(f"❌ Błąd przy tworzeniu tabel: {e}")

    try:
        create_superadmin()
    except Exception as e:
        logger.error(f"❌ Błąd przy tworzeniu superadmina: {e}")

# ✅ Uruchomienie ręczne (np. `python main.py`)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
