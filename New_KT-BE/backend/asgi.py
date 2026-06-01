import os, django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter
from .routing import application


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": application,
})