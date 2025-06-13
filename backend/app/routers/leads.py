from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from ..database import get_db
from ..models.lead import Lead, LeadFile
from ..models.user import User
from ..schemas.lead import LeadCreate, Lead as LeadSchema
from .auth import get_current_user
from ..config import get_settings

router = APIRouter(prefix="/leads", tags=["leads"])
settings = get_settings()

@router.post("/", response_model=LeadSchema)
async def create_lead(
    name: str = Form(...),
    phone: str = Form(...),
    email: Optional[str] = Form(None),
    date: str = Form(...),
    time: str = Form(...),
    contact_method: str = Form(...),
    messenger: str = Form(...),
    comment: Optional[str] = Form(None),
    files: List[UploadFile] = File([]),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Создаем заявку
    lead = Lead(
        name=name,
        phone=phone,
        email=email,
        date=date,
        time=time,
        contact_method=contact_method,
        messenger=messenger,
        comment=comment,
        user_id=current_user.id
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)

    # Сохраняем файлы
    for file in files:
        # Создаем уникальное имя файла
        filename = f"{lead.id}_{file.filename}"
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        
        # Сохраняем файл
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Создаем запись о файле в БД
        lead_file = LeadFile(filename=filename, lead_id=lead.id)
        db.add(lead_file)
    
    db.commit()
    db.refresh(lead)
    return lead

@router.get("/", response_model=List[LeadSchema])
async def get_leads(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        # Обычные пользователи видят только свои заявки
        leads = db.query(Lead).filter(Lead.user_id == current_user.id).all()
    else:
        # Админы видят все заявки
        leads = db.query(Lead).all()
    return leads

@router.get("/{lead_id}", response_model=LeadSchema)
async def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Проверяем права доступа
    if current_user.role != "admin" and lead.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return lead 