from rest_framework import serializers
from . models import *

class OfficeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Office
        fields = '__all__'
        
class DivisionSerializer(serializers.ModelSerializer):
    office = OfficeSerializer()    
    
    class Meta:
        model = Division
        fields = '__all__'
                

class AssetSerializer(serializers.ModelSerializer):
        
    class Meta:
        model = Asset
        fields = '__all__'
        
    issue = serializers.CharField(read_only=True)


class MaintenanceSerializer(serializers.ModelSerializer):
    asset = AssetSerializer()
    
    class Meta:
        model = Maintenance
        fields = '__all__' 
               