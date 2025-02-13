from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"

class Page(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    excerpt = models.TextField(blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    meta_keywords = models.CharField(max_length=200, blank=True)
    featured_image = models.ImageField(upload_to='pages/', blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Szkic'),
            ('published', 'Opublikowany'),
            ('archived', 'Zarchiwizowany')
        ],
        default='draft'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)
    template = models.CharField(
        max_length=50,
        choices=[
            ('default', 'Domyślny'),
            ('landing', 'Strona lądowania'),
            ('sidebar', 'Z paskiem bocznym')
        ],
        default='default'
    )
    
    def __str__(self):
        return self.title

class Menu(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(
        max_length=50,
        choices=[
            ('header', 'Nagłówek'),
            ('footer', 'Stopka'),
            ('sidebar', 'Pasek boczny')
        ]
    )
    
    def __str__(self):
        return f"{self.name} ({self.location})"

class MenuItem(models.Model):
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=200)
    page = models.ForeignKey(Page, null=True, blank=True, on_delete=models.SET_NULL)
    order = models.IntegerField(default=0)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['order']

class Media(models.Model):
    file = models.FileField(upload_to='uploads/')
    title = models.CharField(max_length=200)
    alt_text = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    file_type = models.CharField(
        max_length=20,
        choices=[
            ('image', 'Obraz'),
            ('document', 'Dokument'),
            ('video', 'Wideo'),
            ('audio', 'Audio')
        ]
    )
    file_size = models.BigIntegerField(editable=False, null=True)
    dimensions = models.CharField(max_length=50, blank=True) # dla obrazów
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "Media"

class Widget(models.Model):
    name = models.CharField(max_length=100)
    widget_type = models.CharField(
        max_length=50,
        choices=[
            ('html', 'HTML'),
            ('text', 'Tekst'),
            ('recent_posts', 'Ostatnie wpisy'),
            ('gallery', 'Galeria'),
            ('contact_form', 'Formularz kontaktowy')
        ]
    )
    content = models.TextField()
    location = models.CharField(
        max_length=50,
        choices=[
            ('sidebar', 'Pasek boczny'),
            ('footer', 'Stopka'),
            ('header', 'Nagłówek')
        ]
    )
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name 