import os
from django.conf import settings
from .models import *

def handle_uploaded_file(f):
    path = os.path.join(settings.BASE_DIR, "src/assets/songs/", os.path.basename(f.name))
    with open(path, "wb+") as destination:
        for chunk in f.chunks():
            destination.write(chunk)

def create_new_playlist(mood):
    return

def change_users_mood(user, mood):
    return -1

def add_song_to_database(song_data):
    print(song_data['essentia_properties'])

    if Artist.objects.filter(name = song_data['artist_name']):
        artist = Artist.objects.get(name = song_data['artist_name'])
    else:
        artist = Artist(name = song_data['artist_name'])
        artist.save()

    if Album.objects.filter(name = song_data['album_name']) and Album.objects.get(name = song_data['album_name']).artist == artist:
        album = Album.objects.get(name = song_data['album_name'])
    else:
        album = Album(name = song_data['album_name'], year='0100-01-01', artist = artist)
        album.save()
    
    if Song.objects.filter(song_id = song_data['song_id']):
        song_filter = Song.objects.filter(song_id = song_data['song_id'])
        song_filter.update(
            song_id = song_data['song_id'],
            title = song_data['song_name'],
            artist = artist,
            album = album,
            year = song_data['year'],
            duration = song_data['duration']
        )
        essentia_properties_filter = EssentiaProperties.objects.filter(song = Song.objects.get(song_id = song_data['song_id']))
        essentia_properties_filter.update(bpm = song_data['essentia_properties']['bpm'], key = song_data['essentia_properties']['key'])
    else:
        song = Song(
            song_id = song_data['song_id'],
            title = song_data['song_name'],
            artist = artist,
            album = album,
            year = song_data['year'],
            duration = song_data['duration']
        )
        song.save()
        essentia_properties = EssentiaProperties(song = song, bpm = song_data['essentia_properties']['bpm'], key = song_data['essentia_properties']['key'])
        essentia_properties.save()

    return artist.pk, album.pk