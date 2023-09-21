from django.contrib import admin

from .models import *

admin.site.register(Song)
admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(EssentiaProperties)
admin.site.register(Playlist)
admin.site.register(User)
admin.site.register(Similarity)