@echo off
echo Konfiguracja backendu...

REM Usunięcie istniejącego venv jeśli istnieje
if exist venv (
    call venv\Scripts\deactivate
    rd /s /q venv
)

REM Tworzenie i aktywacja środowiska wirtualnego
python -m venv venv
call venv\Scripts\activate

REM Aktualizacja pip
python -m pip install --upgrade pip

REM Tworzenie katalogów dla plików statycznych i mediów
mkdir static
mkdir media
mkdir staticfiles

REM Instalacja zależności
pip install -r requirements.txt

REM Wykonanie migracji
python manage.py makemigrations api
python manage.py migrate

REM Zbieranie plików statycznych
python manage.py collectstatic --noinput

REM Tworzenie superużytkownika
python manage.py createsuperuser

REM Uruchomienie serwera
python manage.py runserver