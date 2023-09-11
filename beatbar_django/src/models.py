import uuid
from django.db import models

class Artist(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name
    
class Album(models.Model):
    name = models.CharField(max_length=200)
    year = models.DateField("Year published")
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)

    def __str__(self):
        return self.name + ' by ' + self.artist.name

class Song(models.Model):
    song_id = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(Artist, on_delete=models.SET_NULL, null=True)
    album = models.ForeignKey(Album, on_delete=models.SET_NULL, null=True)
    year = models.DateField("Year published")
    duration = models.FloatField()

    def __str__(self):
        return self.title + ' by ' + self.artist.name
    
class EssentiaProperties(models.Model):
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    key = models.CharField(max_length=200)
    scale = models.CharField(max_length=200)
    key_scale_strength = models.FloatField()
    bpm = models.FloatField()
    energy = models.FloatField()
    danceability = models.FloatField()

    def __str__(self):
        return 'EssentiaProperties of ' + self.song.title
    
class Playlist(models.Model):
    id = models.IntegerField(primary_key=True)
    next_song_id = models.CharField(max_length=200)
    songs = models.ManyToManyField(Song)

    def update_next_song(self, previous_song):
        playlist_songs = self.songs.all()
        song = playlist_songs[0]
        idx = 0
        while(song.id != previous_song.id):
            idx = (idx + 1) % len(playlist_songs)
            song = playlist_songs[idx]
        self.next_song_id = playlist_songs[(idx + 1) % len(playlist_songs)].song_id
        self.save()


    def __str__(self):
        return 'Playlist ' + str(self.id)
    
class User(models.Model):
    id = models.UUIDField(
         primary_key = True,
         default = uuid.uuid4,
         editable = False)
    playlist = models.ForeignKey(Playlist, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return 'User ' + str(self.id)