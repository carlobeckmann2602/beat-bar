from django.contrib import admin

from .models import Song
from .models import Artist
from .models import Album
from .models import EssentiaProperties
from .models import Playlist
from .models import User

admin.site.register(Song)
admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(EssentiaProperties)
admin.site.register(Playlist)
admin.site.register(User)