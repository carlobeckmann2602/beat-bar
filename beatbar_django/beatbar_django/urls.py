"""
URL configuration for beatbar_django project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from src import views

urlpatterns = [
    path('admin/', admin.site.urls),
    #path('upload/', views.upload_file, name="Upload LoFi Songs"),

    # General Routes
    re_path(r'^api/beatbar/$', views.beatbar_info),

    # GET Routes
    re_path(r'^api/getnextsong/$', views.next_song),

    # POST Routes
    re_path(r'^api/post/register/$', views.register),
    re_path(r'^api/post/setmood/$', views.set_mood),
    re_path(r'^api/post/song/$', views.add_song),
    re_path(r'^api/post/properties/$', views.update_song_properties),
]