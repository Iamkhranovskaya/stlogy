from app.database import SessionLocal, engine
from app.models.user import User
from app.database import Base

# Создаем таблицы
Base.metadata.create_all(bind=engine)

# Создаем сессию
db = SessionLocal()

# Создаем админа
admin = User(
    phone="+79999999999",
    name="Admin",
    role="admin"
)

# Добавляем в БД
db.add(admin)
db.commit()
db.close()

print("Admin created successfully!") 