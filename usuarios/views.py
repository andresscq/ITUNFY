from django.shortcuts import render
from .models import Usuario

def index ( request ):
    return render ( request , 'usuarios / index . html ')

def form ( request ):
    return render ( request , 'usuarios / form . html ')

def list ( request ):
    return render ( request , 'usuarios / list . html ')
