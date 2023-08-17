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
    duration = models.IntegerField()

    def __str__(self):
        return self.title + ' by ' + self.artist.name
    
class EssentiaProperties(models.Model):
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    bpm = models.IntegerField()
    key = models.CharField(max_length=200)

    def __str__(self):
        return 'EssentiaProperties of ' + self.song.title
    
class Playlist(models.Model):
    id = models.IntegerField(primary_key=True)
    next_song_id = models.CharField(max_length=200)
    songs = models.ManyToManyField(Song)

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