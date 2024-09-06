from django.shortcuts import render
from . models import *
from . serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
@api_view(['GET'])
def get_asset(request):
    if request.method == 'GET':
        asset = Asset.objects.all()
        serializer = AssetSerializer(asset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        