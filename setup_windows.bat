@echo off
echo Tworzenie srodowiska wirtualnego...

REM Sprawdź, czy Python jest zainstalowany
python --version
if errorlevel 1 (
    echo Python nie jest zainstalowany! Prosze zainstalowac Python ze strony python.org
    exit /b 1
)

REM Tworzenie struktury katalogów
mkdir universal-admin
cd universal-admin
mkdir backend
mkdir frontend
cd backend
mkdir api
mkdir auth
mkdir core
mkdir media

REM Tworzenie i aktywacja venv
python -m venv venv
call venv\Scripts\activate

REM Instalacja wymaganych pakietów
echo Instalacja zaleznosci Pythona...
pip install django==4.2.0
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.1.0
pip install Pillow==9.5.0
pip install python-dotenv==1.0.0
pip install psycopg2-binary==2.9.6
pip install django-summernote==0.8.20.0

REM Tworzenie migracji i aplikowanie ich
python manage.py makemigrations
python manage.py migrate

echo Konfiguracja zakonczona pomyslnie! 