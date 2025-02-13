from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from .models import Category, Page, Menu, MenuItem, Media, Widget
from .serializers import (
    CategorySerializer, PageSerializer, MenuSerializer,
    MenuItemSerializer, MediaSerializer, WidgetSerializer
)
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import os
from django.http import JsonResponse
from django.conf import settings
import shutil
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import time

@api_view(['GET'])
def api_root(request):
    return Response({
        "message": "Welcome to the API",
        "endpoints": {
            "categories": "/api/categories/",
            "pages": "/api/pages/",
            "menus": "/api/menus/",
            "menu_items": "/api/menu-items/",
            "media": "/api/media/",
            "widgets": "/api/widgets/",
        }
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'username': user.username
        })
    else:
        return Response({'error': 'Nieprawidłowe dane logowania'}, status=400)

@api_view(['GET'])
def get_websites(request):
    websites_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'websites')
    websites = []
    
    if os.path.exists(websites_dir):
        for site in os.listdir(websites_dir):
            site_path = os.path.join(websites_dir, site)
            if os.path.isdir(site_path) and os.path.exists(os.path.join(site_path, 'index.html')):
                websites.append({
                    'name': site,
                    'path': f'/websites/{site}/index.html'
                })
    
    return Response(websites)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_website(request):
    try:
        path = request.data.get('path')
        content = request.data.get('content')
        
        if not path or not content:
            return JsonResponse({'error': 'Brak wymaganych danych'}, status=400)

        # Usuń początkowy slash z ścieżki jeśli istnieje
        if path.startswith('/'):
            path = path[1:]

        # Zbuduj pełną ścieżkę do pliku
        full_path = os.path.join(settings.BASE_DIR.parent, path)
        
        # Sprawdź, czy plik istnieje
        if not os.path.exists(full_path):
            return JsonResponse({'error': 'Plik nie istnieje'}, status=404)

        # Sprawdź uprawnienia do zapisu
        if not os.access(os.path.dirname(full_path), os.W_OK):
            return JsonResponse({'error': 'Brak uprawnień do zapisu'}, status=403)

        # Zapisz zmiany
        with open(full_path, 'w', encoding='utf-8') as file:
            file.write(content)
        
        return JsonResponse({'message': 'Zapisano zmiany'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    try:
        image = request.FILES.get('image')
        path = request.POST.get('path')
        
        if not image or not path:
            return JsonResponse({'error': 'Brak wymaganych danych'}, status=400)

        # Wyciągnij katalog strony z ścieżki
        website_dir = path.split('/')[2]  # np. 'ohio' z '/websites/ohio/index.html'
        
        # Stwórz katalog na zdjęcia jeśli nie istnieje
        images_dir = os.path.join(settings.BASE_DIR.parent, 'websites', website_dir, 'images')
        os.makedirs(images_dir, exist_ok=True)

        # Generuj unikalną nazwę pliku
        filename = f"{int(time.time())}_{image.name}"
        
        # Użyj forward slasha dla URL
        file_path = f'images/{filename}'  # URL path
        
        # Użyj os.path.join tylko dla ścieżki systemu plików
        full_path = os.path.join(settings.BASE_DIR.parent, 'websites', website_dir, 'images', filename)
        
        # Zapisz plik
        with open(full_path, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)

        # Zwróć URL z forward slashami
        return JsonResponse({
            'message': 'Zdjęcie zostało przesłane',
            'imageUrl': f'/websites/{website_dir}/{file_path}'
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class WidgetViewSet(viewsets.ModelViewSet):
    queryset = Widget.objects.all()
    serializer_class = WidgetSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 