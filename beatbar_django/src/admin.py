from django.contrib import admin

from .models import Song
from .models import Artist
from .models import Album

admin.site.register(Song)
admin.site.register(Artist)
admin.site.register(Album)