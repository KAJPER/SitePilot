from django.contrib import admin
from .models import Category, Page, Menu, MenuItem, Media, Widget

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'created_at', 'author')
    list_filter = ('status', 'created_at', 'author')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'created_at'

@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('name', 'location')
    list_filter = ('location',)

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'menu', 'order', 'parent')
    list_filter = ('menu',)
    ordering = ('menu', 'order')

@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ('title', 'file_type', 'uploaded_at', 'uploaded_by')
    list_filter = ('file_type', 'uploaded_at')
    search_fields = ('title', 'description')
    date_hierarchy = 'uploaded_at'

@admin.register(Widget)
class WidgetAdmin(admin.ModelAdmin):
    list_display = ('name', 'widget_type', 'location', 'is_active')
    list_filter = ('widget_type', 'location', 'is_active')
    search_fields = ('name', 'content') 