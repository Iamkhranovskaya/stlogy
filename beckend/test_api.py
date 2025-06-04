import requests
import json

def test_create_lead():
    url = "http://localhost:8000/api/leads"
    data = {
        "name": "Тестовое имя",
        "phone": "+7999999999",
        "email": "test@test.com",
        "date": "2024-03-20",
        "time": "15:00",
        "contact_method": "phone",
        "messenger": "telegram",
        "comment": "Тестовый комментарий"
    }
    
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_create_lead() 