import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField

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
        return self.title + (' by ' + self.artist.name) if self.artist is not None else ''
    
class EssentiaProperties(models.Model):
    song = models.OneToOneField(Song, on_delete=models.CASCADE)
    key = models.CharField(max_length=200)
    scale = models.CharField(max_length=200)
    key_scale_strength = models.FloatField()
    bpm = models.FloatField()
    energy = models.FloatField()
    danceability = models.FloatField()
    loudness = models.FloatField()
    cuepoint_in = models.FloatField()
    cuepoint_out = models.FloatField()
    moods = ArrayField(
            models.CharField(max_length=20, blank=True),
            size=8,
        )

    def __str__(self):
        return 'EssentiaProperties of ' + self.song.title
    
class Playlist(models.Model):
    next_song_id = models.CharField(max_length=200)
    songs = models.ManyToManyField(Song)
    order = ArrayField(
            models.IntegerField()
        )

    def update_next_song(self, previous_song):
        self.next_song_id = Song.objects.get(id = self.order[(self.order.index(previous_song.id) + 1) % len(self.order)]).song_id
        self.save()


    def __str__(self):
        return 'Playlist ' + str(self.id)
    
class User(models.Model):
    id = models.UUIDField(
         primary_key = True,
         default = uuid.uuid4,
         editable = False)
    playlist = models.OneToOneField(Playlist, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return 'User ' + str(self.id)
    
class Similarity(models.Model):
    song_1 = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='song_1')
    song_2 = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='song_2')
    similarity = models.FloatField()

    def __str__(self):
        return 'Similarity of ' + self.song_1.title + ' and ' + self.song_2.title