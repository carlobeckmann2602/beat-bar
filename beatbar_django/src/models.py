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
        return self.name

class Song(models.Model):
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(Artist, on_delete=models.SET_NULL, null=True)
    album = models.ForeignKey(Album, on_delete=models.SET_NULL, null=True)
    year = models.DateField("Year published")
    duration = models.IntegerField()

    def __str__(self):
        return self.title
    
class EssentiaProperties(models.Model):
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    bpm = models.IntegerField()

    def __str__(self):
        return 'EssentiaProperties of ' + self.song