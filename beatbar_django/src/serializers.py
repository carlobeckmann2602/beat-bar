from rest_framework import serializers
from .models import Artist
from .models import Album
from .models import Song
from .models import EssentiaProperties

class ArtistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Artist 
        fields = ['name']

class AlbumSerializer(serializers.ModelSerializer):
    artist = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Album 
        fields = ['name', 'year', 'artist']

class SongSerializer(serializers.ModelSerializer):
    artist = serializers.PrimaryKeyRelatedField(read_only=True)
    album = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Song 
        fields = ['title', 'artist', 'album', 'year', 'duration']

class EssentiaPropertiesSerializer(serializers.ModelSerializer):
    song = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = EssentiaProperties
        fields = ['song', 'key', 'scale', 'key_scale_strength', 'bpm', 'energy', 'danceability']