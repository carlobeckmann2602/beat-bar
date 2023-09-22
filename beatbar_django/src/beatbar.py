import os
from django.conf import settings
from .models import *

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def handle_uploaded_file(f):
    path = os.path.join(settings.BASE_DIR, "src/assets/songs/", os.path.basename(f.name))
    with open(path, "wb+") as destination:
        for chunk in f.chunks():
            destination.write(chunk)

def create_new_playlist(mood):
    print('New Playlist Mood: ' + mood)

    songs_list = []
    for property in EssentiaProperties.objects.filter(moods__contains = [mood]):
        songs_list.append(property.song.id)

    songs = pd.DataFrame({'song_id': songs_list})
    
    start_song_id = songs.sample().song_id.iloc[0]
    prev_song_id = start_song_id
    songs = songs[songs.song_id != prev_song_id]
    
    playlist_songs = [Song.objects.get(id = prev_song_id)]
    while not songs.empty:
        next_song_id = get_song_with_best_similarity(prev_song_id, songs)
        playlist_songs.append(Song.objects.get(id = next_song_id))
        songs = songs[songs.song_id != next_song_id]
        prev_song_id = next_song_id

    playlist = Playlist(next_song_id = Song.objects.get(id = start_song_id).song_id, order = [song.id for song in playlist_songs])
    playlist.save()
    for song in playlist_songs:
        playlist.songs.aadd(song)
        playlist.save()

    return playlist

def get_song_with_best_similarity(song_id, songs):
    song = Song.objects.get(id = song_id)

    similarities1 = pd.DataFrame(list(Similarity.objects.filter(song_1 = song).values()))
    similarities2 = pd.DataFrame(list(Similarity.objects.filter(song_2 = song).values())).rename(columns={'song_1_id': 'song_2_id', 'song_2_id': 'song_1_id'})
    similarities = pd.concat([similarities1, similarities2], ignore_index=True).drop('song_1_id', axis=1).rename(columns={'song_2_id': 'song_id'})
    
    mask = [id in songs['song_id'].values for id in similarities['song_id']]
    similarities = similarities[mask]

    similarities.sort_values(by='similarity', ascending = False, inplace=True)

    return similarities.song_id.iloc[0]

def change_users_mood(user, mood):
    new_playlist = create_new_playlist(mood)

    if user.playlist is not None:
        Playlist.objects.filter(id = user.playlist.id).delete()
    
    user.playlist = new_playlist
    user.save()

    return new_playlist.id

def add_song_to_database(song_data):
    if Artist.objects.filter(name = song_data['artist_name']):
        artist = Artist.objects.get(name = song_data['artist_name'])
    else:
        artist = Artist(name = song_data['artist_name'])
        artist.save()

    if Album.objects.filter(name = song_data['album_name'], artist = artist):
        album = Album.objects.get(name = song_data['album_name'], artist = artist)
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
        update_properties(song_data['song_id'], song_data['essentia_properties'])

    return artist.pk, album.pk

def update_properties(song_id, properties):
    song = Song.objects.get(song_id = song_id)

    moods = [mood for mood in str(properties['moods']).split(', ')]

    if EssentiaProperties.objects.filter(song = song):
        essentia_properties_filter = EssentiaProperties.objects.filter(song = song)
        essentia_properties_filter.update(key = properties['key'], 
                                          scale = properties['scale'], 
                                          key_scale_strength = properties['key_scale_strength'], 
                                          bpm = properties['bpm'], 
                                          energy = properties['energy'], 
                                          danceability = properties['danceability'],
                                          loudness = properties['loudness'],
                                          cuepoint_in = properties['cuepoint_in'],
                                          cuepoint_out = properties['cuepoint_out'],
                                          moods = moods)
    else:
        essentia_properties = EssentiaProperties(song = song,
                                                 key = properties['key'], 
                                                 scale = properties['scale'], 
                                                 key_scale_strength = properties['key_scale_strength'], 
                                                 bpm = properties['bpm'], 
                                                 energy = properties['energy'], 
                                                 danceability = properties['danceability'],
                                                 loudness = properties['loudness'],
                                                 cuepoint_in = properties['cuepoint_in'],
                                                 cuepoint_out = properties['cuepoint_out'],
                                                 moods = moods)
        essentia_properties.save()

    calculate_song_similarities(song)

def calculate_song_similarities(song):
    print('\n Calculate Similarities for Song: ' + song.title + '\n')

    essentia_data = pd.DataFrame(list(EssentiaProperties.objects.all().values()))
    essentia_data = essentia_data.drop('id', axis=1)
    essentia_data = essentia_data.rename(columns={'song_id': 'id'})
    song_data = pd.DataFrame(list(Song.objects.all().values()))
    artist_data = pd.DataFrame(list(Artist.objects.all().values())).set_index('id').to_dict()['name']
    album_data = pd.DataFrame(list(Album.objects.all().values())).drop(['year', 'artist_id'], axis=1).set_index('id').to_dict()['name']
    data = pd.merge(song_data, essentia_data, on='id')
    data = data.drop(['id', 'year'], axis=1)
    data.replace({'artist_id': artist_data, 'album_id': album_data}, inplace=True)

    data_without_song = data[data['song_id']!=song.song_id]
    
    song_vectorizer = TfidfVectorizer(ngram_range=(1, 2))
    data['moods'] = data['moods'].apply(lambda x: ' '.join(x))
    text_data = data[['title', 'artist_id', 'album_id', 'key', 'scale', 'moods']].agg(' '.join, axis=1)
    tfidf_vectors = song_vectorizer.fit_transform(text_data)

    for other_song_id in data_without_song.song_id:
        if Similarity.objects.filter(song_1 = Song.objects.get(song_id = other_song_id), song_2 =  song):
            calculate_similarity(other_song_id, song.song_id, tfidf_vectors, data)
        else:
            calculate_similarity(song.song_id, other_song_id, tfidf_vectors, data)

def calculate_similarity(song_id_1, song_id_2, tfidf_vectors, data):
    text_array1 = tfidf_vectors[data.index[data['song_id'] == song_id_1].tolist()[0], :]
    num_array1 = data[data['song_id']==song_id_1].select_dtypes(include=np.number).to_numpy()

    text_array2 = tfidf_vectors[data.index[data['song_id'] == song_id_2], :]
    num_array2 = data[data['song_id']==song_id_2].select_dtypes(include=np.number).to_numpy()

    text_sim = cosine_similarity(text_array1, text_array2).flatten()[0]
    num_sim = cosine_similarity(num_array1, num_array2)[0][0]
    sim = num_sim + text_sim

    print(f'Similarity between {song_id_1} and {song_id_2}: {str(sim)} (Text: {text_sim}, Numerisch: {num_sim})')

    song_1 = Song.objects.get(song_id = song_id_1)
    song_2 = Song.objects.get(song_id = song_id_2)

    if Similarity.objects.filter(song_1 = song_1, song_2 = song_2):
        similarity_filter = Similarity.objects.filter(song_1 = song_1, song_2 = song_2)
        similarity_filter.update(song_1 = song_1, 
                                song_2 = song_2, 
                                similarity=sim)
    else:
        similarity = Similarity(song_1 = song_1, 
                            song_2 = song_2, 
                            similarity=sim)
        similarity.save()
