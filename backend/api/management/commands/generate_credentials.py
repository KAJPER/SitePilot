from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import random
import string

class Command(BaseCommand):
    help = 'Generuje login i hasło dla administratora'

    def handle(self, *args, **kwargs):
        # Generowanie losowego hasła
        password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        username = 'admin'

        # Tworzenie lub aktualizacja użytkownika admin
        try:
            user = User.objects.get(username=username)
            user.set_password(password)
            user.save()
            self.stdout.write('Zaktualizowano hasło dla istniejącego użytkownika admin')
        except User.DoesNotExist:
            User.objects.create_superuser(username=username, password=password)
            self.stdout.write('Utworzono nowego użytkownika admin')

        self.stdout.write(self.style.SUCCESS(f'''
        ================================
        Wygenerowane dane logowania:
        Login: {username}
        Hasło: {password}
        ================================
        ''')) 