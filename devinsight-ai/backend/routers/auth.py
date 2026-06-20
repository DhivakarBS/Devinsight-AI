from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from backend import models, schemas, auth
from backend.database import get_db

router = APIRouter()


@router.post("/register", response_model=schemas.UserOut)
def register(
    payload: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(models.User).filter(
        (models.User.username == payload.username)
        | (models.User.email == payload.email)
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    user = models.User(
        username=payload.username,
        email=payload.email,
        password_hash=auth.get_password_hash(
            payload.password
        ),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post("/token", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = (
        db.query(models.User)
        .filter(
            models.User.username
            == form_data.username
        )
        .first()
    )

    if (
        not user
        or not auth.verify_password(
            form_data.password,
            user.password_hash
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = auth.create_access_token(
        {"sub": user.username}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }