# Generated by Django 4.2.4 on 2023-09-22 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('src', '0013_alter_essentiaproperties_song'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playlist',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
