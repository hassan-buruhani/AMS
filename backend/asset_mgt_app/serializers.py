from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'is_staff', 'is_superuser']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            email=validated_data.get('email', ''),
            is_staff=validated_data.get('is_staff', False),
            is_superuser=validated_data.get('is_superuser', False)
        )
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user

    def update(self, instance, validated_data):
        # Update fields like username, email, etc.
        for field in ['username', 'first_name', 'last_name', 'email', 'is_staff', 'is_superuser']:
            setattr(instance, field, validated_data.get(field, getattr(instance, field)))

        # If password is provided, set it properly
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)  # Hash the password

        instance.save()
        return instance

class AnotherUserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['username', 'password', 'email']
        
        

class OfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office
        fields = ['id', 'name', 'location']


class DivisionSerializer(serializers.ModelSerializer):
    # office = OfficeSerializer()
    office = serializers.PrimaryKeyRelatedField(queryset=Office.objects.all())

    class Meta:
        model = Division
        fields = ['id', 'name', 'head_of_division', 'office']


class AssetSerializer(serializers.ModelSerializer):
    issue_name = serializers.CharField(source='issue.name', read_only=True)  # Display division name in response
    issue_id = serializers.PrimaryKeyRelatedField(queryset=Division.objects.all(), source='issue')  # Use division ID for posting/updating
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    asset_status_display = serializers.CharField(source='get_asset_status_display', read_only=True)

    class Meta:
        model = Asset
        fields = [
            'id', 'name', 'Manufactured_date', 'cost', 'invoice', 'category', 'category_display',
            'specification', 'model_number', 'Received_date', 'image', 'issue_id', 'issue_name',
            'asset_number', 'asset_status', 'asset_status_display', 'depreciation', 'useful_life', 'pendingAndUpdated_desc'
        ]


class MaintainanceSerializer(serializers.ModelSerializer):
    asset_name = serializers.SerializerMethodField()  # Add a field for asset name

    class Meta:
        model = Maintainance
        fields = ['id', 'asset', 'asset_name', 'date', 'details', 'cost']

    def get_asset_name(self, obj):
        return obj.asset.asset_number  # Adjust this if your field name is different

    def create(self, validated_data):
        return Maintainance.objects.create(**validated_data)
    

from rest_framework import serializers
from .models import PendingAction

class PendingActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingAction
        fields = ['id', 'asset', 'requested_by', 'action', 'status', 'description', 'created_at', 'admin_action_at']
        read_only_fields = ['id', 'requested_by', 'status', 'created_at', 'admin_action_at']

    def create(self, validated_data):
        # Automatically set the user to the current user when creating a pending action
        request = self.context.get('request')
        validated_data['requested_by'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # You can add any custom logic here if needed for updates
        return super().update(instance, validated_data)

        
