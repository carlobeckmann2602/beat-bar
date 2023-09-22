# Generated by Django 4.2.4 on 2023-09-22 12:12

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('src', '0014_alter_playlist_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='playlist',
            name='order',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(blank=True, max_length=20), default=[0], size=8),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='user',
            name='playlist',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='src.playlist'),
        ),
    ]
