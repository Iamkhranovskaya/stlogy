import requests
import os
from datetime import datetime

def test_create_lead(base_url, token):
    url = f"{base_url}/leads/"
    headers = {"Authorization": f"Bearer {token}"}
    
    data = {
        "name": "Тестовый клиент",
        "phone": "+79991234567",
        "email": "test@example.com",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "time": "15:00",
        "contact_method": "phone",
        "messenger": "telegram",
        "comment": "Тестовая заявка"
    }
    
    response = requests.post(url, headers=headers, data=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

if __name__ == "__main__":
    # Для локального тестирования
    LOCAL_URL = "http://localhost:8000"
    # Для продакшн
    PROD_URL = "https://ваш-домен.com"
    
    # Получите токен через /auth/token
    TOKEN = "ваш_токен"
    
    # Тестируем локально
    print("Testing locally...")
    test_create_lead(LOCAL_URL, TOKEN)
    
    # Тестируем на проде
    print("\nTesting production...")
    test_create_lead(PROD_URL, TOKEN) 