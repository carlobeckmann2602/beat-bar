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
        update_properties(song_data['song_id'], song_data['essentia_properties'])
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
        essentia_properties = EssentiaProperties(song = song, 
                                                 key = song_data['essentia_properties']['key'], 
                                                 scale = song_data['essentia_properties']['scale'], 
                                                 key_scale_strength = song_data['essentia_properties']['key_scale_strength'], 
                                                 bpm = song_data['essentia_properties']['bpm'], 
                                                 energy = song_data['essentia_properties']['energy'], 
                                                 danceability = song_data['essentia_properties']['danceability'])
        essentia_properties.save()

    return artist.pk, album.pk

def update_properties(song_id, properties):
    song = Song.objects.get(song_id = song_id)
    if EssentiaProperties.objects.filter(song = song):
        essentia_properties_filter = EssentiaProperties.objects.filter(song = song)
        essentia_properties_filter.update(key = properties['key'], 
                                          scale = properties['scale'], 
                                          key_scale_strength = properties['key_scale_strength'], 
                                          bpm = properties['bpm'], 
                                          energy = properties['energy'], 
                                          danceability = properties['danceability'])
    else:
        essentia_properties = EssentiaProperties(song = song,
                                                 key = properties['key'], 
                                                 scale = properties['scale'], 
                                                 key_scale_strength = properties['key_scale_strength'], 
                                                 bpm = properties['bpm'], 
                                                 energy = properties['energy'], 
                                                 danceability = properties['danceability'])
        essentia_properties.save()