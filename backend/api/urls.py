from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'pages', views.PageViewSet)
router.register(r'menus', views.MenuViewSet)
router.register(r'menu-items', views.MenuItemViewSet)
router.register(r'media', views.MediaViewSet)
router.register(r'widgets', views.WidgetViewSet)

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('', include(router.urls)),
    path('login/', views.login_view, name='login'),
    path('websites/', views.get_websites, name='websites'),
    path('websites/update', views.update_website, name='update-website'),
    path('websites/upload-image', views.upload_image, name='upload-image'),
] 