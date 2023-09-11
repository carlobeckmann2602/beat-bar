from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.decorators import parser_classes
from rest_framework.parsers import JSONParser

from django.shortcuts import render
from .beatbar import *
from django.views.generic.edit import FormView
from .forms import FileFieldForm
from django.http import HttpResponseRedirect
import django.core.exceptions as DjangoException
from collections import OrderedDict

from .models import *
from .serializers import *

# Backend Views

class FileFieldFormView(FormView):
    form_class = FileFieldForm
    template_name = "upload.html"  # Replace with your template.
    success_url = "reverse()"  # Replace with your URL or reverse().

    def post(self, request, *args, **kwargs):
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        files = form.cleaned_data["file_field"]
        for f in files:
            ...  # Do something with each file.
        return super().form_valid()

def upload_file(request):
    if request.method == "POST":
        form = FileFieldForm(request.POST, request.FILES)
        if form.is_valid():
            files = request.FILES.getlist("files")
            for file in files:
                handle_uploaded_file(file)
    else:
        form = FileFieldForm()
    return render(request, 'upload.html', {'form': form})

api_token = 'YEGmtC4QKGIQQK4qGuRD55q48JIkKazWEnDvQIcDYaA='

def check_api_token(request):
    token = request.META.get('HTTP_X_BEATBAR_APITOKEN')
    return token == api_token

def get_user_with_uuid(request):
    uuid = request.META.get('HTTP_X_BEATBAR_UUID')
    if uuid is not None:
        user = User.objects.get(id=uuid)
    else:
        raise User.DoesNotExist
    return user


# REST-API

@api_view(['GET'])
def beatbar_info(request):
    if not check_api_token(request): return Response('API-Token is not correct!', status=status.HTTP_401_UNAUTHORIZED)
    if request.method == 'GET':
        song_data = Song.objects.all()
        album_data = Album.objects.all()
        artist_data = Artist.objects.all()
        essentiaProperties_data = EssentiaProperties.objects.all()

        song_serializer = SongSerializer(song_data, context={'request': request}, many=True)
        album_serializer = AlbumSerializer(album_data, context={'request': request}, many=True)
        artist_serializer = ArtistSerializer(artist_data, context={'request': request}, many=True)
        essentiaProperties_serializer = EssentiaPropertiesSerializer(essentiaProperties_data, context={'request': request}, many=True)

        result = OrderedDict([("Songs", song_serializer.data), 
                              ("Albums", album_serializer.data), 
                              ("Artists", artist_serializer.data),
                              ("Essentia Properties", essentiaProperties_serializer.data)])
        
        return Response(result)
    
# GET Routes

@api_view(['GET'])
def next_song(request):
    if not check_api_token(request): return Response('API-Token is not correct!', status=status.HTTP_401_UNAUTHORIZED)
    playlist_id = request.query_params.get('playlist_id')
    try:
        playlist = Playlist.objects.get(id = playlist_id)
    except Playlist.DoesNotExist:
        return Response({'error': f'Playlist with ID: {playlist_id} does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    next_song_id = playlist.next_song_id
    next_song_object = Song.objects.get(song_id = next_song_id)
    next_song_properties = EssentiaProperties.objects.get(song = next_song_object)

    playlist.update_next_song(next_song_object)

    response = {
        'song_id': next_song_id,
        'duration': next_song_object.duration,
        'key': next_song_properties.key,
        'scale': next_song_properties.scale,
        'key_scale_strength': next_song_properties.key_scale_strength, 
        'bpm': next_song_properties.bpm,
        'energy': next_song_properties.energy,
        'danceability': next_song_properties.danceability,
    }
    return Response(response, status=status.HTTP_200_OK)

# POST Routes

@api_view(['POST'])
def register(request):
    if not check_api_token(request): return Response('API-Token is not correct!', status=status.HTTP_401_UNAUTHORIZED)
    new_user = User(playlist=None)
    new_user.save()
    uuid = new_user.id

    response = {
        'user_id': uuid
    }
    return Response(response, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def set_mood(request):
    if not check_api_token(request): return Response('API-Token is not correct!', status=status.HTTP_401_UNAUTHORIZED)
    try:
        user = get_user_with_uuid(request)
    except (User.DoesNotExist, DjangoException.ValidationError):
        return Response({'error': 'User with this UUID does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    mood = request.data['mood']
    playlist_id = change_users_mood(user, mood)

    response = {
        'playlist_id': playlist_id
    }
    return Response(response, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_song(request):
    if not check_api_token(request): return Response('API-Token is not correct!', status=status.HTTP_401_UNAUTHORIZED)
    artist_id, album_id = add_song_to_database(request.data)

    response = {
        'artist_id': artist_id,
        'album_id': album_id,
    }
    return Response(response, status=status.HTTP_201_CREATED)
    
@api_view(['POST', 'PUT'])
def update_song_properties(request):
    if not check_api_token(request): return Response('API-Token is not correct!', status=status.HTTP_401_UNAUTHORIZED)
    song_id = str(request.query_params.get('song_id'))
    print(song_id)
    properties = dict(request.data['essentia_properties'])
    update_properties(song_id, properties)
    return Response('Properties are updated', status=status.HTTP_200_OK)