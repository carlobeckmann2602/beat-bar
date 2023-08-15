# Generated by Django 4.2.4 on 2023-08-15 12:29

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('src', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Playlist',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('next_song_id', models.CharField(max_length=200)),
            ],
        ),
        migrations.AddField(
            model_name='song',
            name='song_id',
            field=models.CharField(default='not_set', max_length=200),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('play_list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='src.playlist')),
            ],
        ),
        migrations.AddField(
            model_name='playlist',
            name='songs',
            field=models.ManyToManyField(to='src.song'),
        ),
    ]
