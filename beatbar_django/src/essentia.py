import os
from django.conf import settings

def handle_uploaded_file(f):
    path = os.path.join(settings.BASE_DIR, "src/assets/songs/", os.path.basename(f.name))
    with open(path, "wb+") as destination:
        for chunk in f.chunks():
            destination.write(chunk)