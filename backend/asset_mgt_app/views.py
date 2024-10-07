from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from .serializers import *
from .models import *
from django.contrib.auth.models import User
from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt
from .serializers import OfficeSerializer

@csrf_exempt
@api_view(['POST', 'GET', 'PUT', 'DELETE'])
def manage_office(request, pk=None):
    """
    Handles office creation (POST), retrieval (GET single/all), update (PUT), and deletion (DELETE).
    """

    # POST: Create a new office
    if request.method == 'POST':
        serializer = OfficeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Office created successfully', 'office': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET: Retrieve offices
    if request.method == 'GET':
        if pk:
            # Retrieve a specific office by ID
            try:
                office = Office.objects.get(pk=pk)
                serializer = OfficeSerializer(office)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Office.DoesNotExist:
                return Response({'error': 'Office not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Retrieve all offices
            offices = Office.objects.all()
            serializer = OfficeSerializer(offices, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    # PUT: Update a specific office by ID
    if request.method == 'PUT':
        if pk:
            try:
                office = Office.objects.get(pk=pk)
            except Office.DoesNotExist:
                return Response({'error': 'Office not found'}, status=status.HTTP_404_NOT_FOUND)

            serializer = OfficeSerializer(office, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Office updated successfully', 'office': serializer.data}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Office ID required for update'}, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: Delete a specific office by ID
    if request.method == 'DELETE':
        if pk:
            try:
                office = Office.objects.get(pk=pk)
                office.delete()
                return Response({'message': 'Office deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
            except Office.DoesNotExist:
                return Response({'error': 'Office not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Office ID required for deletion'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)






# Division Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def division_list_create(request):
    if request.method == 'GET':
        divisions = Division.objects.all()
        serializer = DivisionSerializer(divisions, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = DivisionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def division_detail(request, pk):
    try:
        division = Division.objects.get(pk=pk)
    except Division.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DivisionSerializer(division)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = DivisionSerializer(division, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        division.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Asset Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def asset_list_create(request):
    if request.method == 'GET':
        assets = Asset.objects.all()
        serializer = AssetSerializer(assets, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = AssetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def asset_detail(request, pk):
    try:
        asset = Asset.objects.get(pk=pk)
    except Asset.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AssetSerializer(asset)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = AssetSerializer(asset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        asset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Maintenance Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def maintainance_list_create(request):
    if request.method == 'GET':
        maintainances = Maintainance.objects.all()
        serializer = MaintainanceSerializer(maintainances, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = MaintainanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def maintainance_detail(request, pk):
    try:
        maintainance = Maintainance.objects.get(pk=pk)
    except Maintainance.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MaintainanceSerializer(maintainance)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = MaintainanceSerializer(maintainance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        maintainance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def assets_by_division(request):
    division_id = request.query_params.get('division_id')
    
    if not division_id:
        return Response({'error': 'Division ID parameter is missing'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        division_id = int(division_id)
    except ValueError:
        return Response({'error': 'Invalid Division ID format'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        assets = Asset.objects.filter(issue_id=division_id)
    except Asset.DoesNotExist:
        return Response({'error': 'No assets found for the given division'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = AssetSerializer(assets, many=True)
    return Response(serializer.data)   

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def assets_need_troubleshooting(request):
    try:
        assets = Asset.objects.filter(asset_status='B')
        serializer = AssetSerializer(assets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Asset.DoesNotExist:
        return Response({"error": "No assets found that need troubleshooting."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inactive_assets(request):
        try:
            inactive_asset = Asset.objects.filter(asset_status='C')
            serializer = AssetSerializer(inactive_asset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Asset.DoesNotExist:
            return Response({'error':'No Asset Found '}, status=status.HTTP_204_NO_CONTENT)
        
@api_view(['GET']) 
@permission_classes([IsAuthenticated])
def active_assets(request):
    try:
        active_assets  = Asset.objects.filter(asset_stats='A')
        serializer = AssetSerializer(active_assets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def count_assets_need_troubleshooting(request):
    try:
        asset_count = Asset.objects.filter(asset_status='B').count()
        return Response({"count": asset_count}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_distribution(request):
    category_counts = Asset.objects.values('category').annotate(count=Count('id'))
    category_data = {category['category']: category['count'] for category in category_counts}
    return Response(category_data, status=status.HTTP_200_OK)

@api_view(['POST', 'GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_user(request, pk=None):
    """
    Handles user creation, retrieval (single/all), update, and deletion.
    """
    if request.method == 'POST':
        # Create a new user
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User created successfully', 'user': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        if pk:
            # Retrieve a specific user by ID
            try:
                user = User.objects.get(pk=pk)
                serializer = UserSerializer(user)
                return Response(serializer.data)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Retrieve all users
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)

    if request.method == 'PUT':
        # Update a specific user by ID
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            if 'password' in request.data and request.data['password']:
                user.set_password(request.data['password'])
            serializer.save()
            return Response({'message': 'User updated successfully', 'user': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        # Delete a specific user by ID
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout the user by invalidating the token.
    """
    # Invalidate the token (this is usually done client-side by deleting the token)
    return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the current user
        return self.request.user
    


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    # Get the current user
    user = request.user

    if request.method == 'GET':
        # Return the current user's data
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Update the current user's data
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            if 'password' in request.data and request.data['password']:
                user.set_password(request.data['password'])
            serializer.save()
            return Response({'message': 'User updated successfully', 'user': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






@api_view(['PUT'])
def update_asset(request, pk):
    try:
        asset = Asset.objects.get(pk=pk)
    except Asset.DoesNotExist:
        return Response({'error': 'Asset not found'}, status=status.HTTP_404_NOT_FOUND)

    reason_for_update = request.data.get('pendingAndUpdated_desc', None)

    if reason_for_update:
        serializer = AssetSerializer(asset, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            # Set asset as pending and save the reason
            asset.is_updated = True
            asset.pendingAndUpdated_desc = reason_for_update
            asset.save()
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Update reason is required'}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request, pk):
    user = get_object_or_404(User, pk=pk)

    # Ensure the user is authenticated
    if not request.user.is_authenticated or request.user != user:
        return Response({"detail": "Unauthorized."}, status=401)

    current_password = request.data.get('currentPassword')
    new_password = request.data.get('newPassword')

    if not user.check_password(current_password):
        return Response({"detail": "Current password is incorrect."}, status=400)

    user.set_password(new_password)  # Hash the new password
    user.save()
    return Response({"detail": "Password updated successfully."}, status=200)





# Imports
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse


@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    username = request.data.get('username')

    if not username:
        return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(username=username)

        # Generate token and uidb64
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        # Generate password reset URL
        frontend_url = settings.FRONTEND_URL  # Ensure this is defined in your settings file
        reset_link = f"{frontend_url}/reset-password/{uidb64}/{token}/"

        # Send email
        subject = "Reset Password"
        message = f"Hi {user.username}, click the link below to reset your password:\n\n{reset_link}"
        recipient_list = [user.email]

        send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list, fail_silently=True)

        return Response({"message": "Password reset link sent to your email!"}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)





# Imports
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_confirm(request, uidb64, token):
    try:
        # Decode uidb64 to get user id
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)

        # Check if the token is valid
        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid token or token expired"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the new passwords
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not new_password or not confirm_password:
            return Response({"error": "Both password fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        # Set the new password
        user.password = make_password(new_password)
        user.save()

        return Response({"message": "Password reset successful!"}, status=status.HTTP_200_OK)

    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)


# Request For Approval
# views.py
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def request_delete_asset(request, asset_id):
    try:
        # Fetch the asset using the provided asset ID
        asset = Asset.objects.get(id=asset_id)

        # Add your custom logic for handling the delete request, such as marking it for deletion
        asset.is_pending = True  # Assuming you have an `is_pending` field for deletion approval
        asset.deletion_reason = request.data.get('description', '')  # Store the description (reason for deletion)
        asset.save()

        return Response({'message': 'Delete request has been submitted'}, status=status.HTTP_200_OK)

    except Asset.DoesNotExist:
        return Response({'error': 'Asset not found'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])  # Only admins can access this view
def get_pending_actions(request):
    try:
        pending_actions = PendingAction.objects.filter(status='Pending')
        actions_data = [
            {
                'id': action.id,
                'asset_id': action.asset.id,
                'asset_name': action.asset.name,
                'requested_by': action.requested_by.username,
                'action': action.action,
                'description': action.description,
                'created_at': action.created_at,
            }
            for action in pending_actions
        ]
        return Response(actions_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 # Adjust the import according to your project structure



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_pending_action(request, pk):
    """
    Approve a pending action (either update or delete).
    """
    pending_action = get_object_or_404(PendingAction, pk=pk)

    if pending_action.status != 'Pending':
        return Response({"detail": "This action has already been processed."}, status=status.HTTP_400_BAD_REQUEST)

    asset = pending_action.asset

    try:
        if pending_action.action == 'DELETE':
            # Perform delete operation
            if asset:
                asset.delete()
            else:
                return Response({"detail": "Related asset not found."}, status=status.HTTP_404_NOT_FOUND)

        elif pending_action.action == 'UPDATE':
            # Implement update logic here using pending_action.request_data
            request_data = pending_action.request_data
            if request_data:
                # Example: Update the asset's name and cost (adjust based on your model)
                asset.name = request_data.get('name', asset.name)
                asset.cost = request_data.get('cost', asset.cost)
                # Update other fields similarly as per your asset model
                asset.save()
            else:
                return Response({"detail": "No data found to update asset."}, status=status.HTTP_400_BAD_REQUEST)

        # Update pending action status to 'Approved'
        pending_action.status = 'Approved'
        pending_action.admin_action_at = timezone.now()
        pending_action.save()

        return Response({"detail": "Pending action approved."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_pending_action(request, pk):
    """
    Reject a pending action.
    """
    pending_action = get_object_or_404(PendingAction, pk=pk)

    if pending_action.status != 'Pending':
        return Response({"detail": "This action has already been processed."}, status=status.HTTP_400_BAD_REQUEST)

    pending_action.status = 'Rejected'
    pending_action.admin_action_at = timezone.now()
    pending_action.save()

    return Response({"detail": "Pending action rejected."}, status=status.HTTP_200_OK)



@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_pending_action(request, pk):
    try:
        pending_action = PendingAction.objects.get(pk=pk)
    except PendingAction.DoesNotExist:
        return Response({'error': 'Pending action not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = PendingActionSerializer(pending_action)
    return Response(serializer.data, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated, IsAdminUser])
@api_view(['GET'])
def list_pending_assets(request):
    try:
        pending_action = PendingAction.objects.all()
    except PendingAction.DoesNotExist:
        return Response({'error': 'Pending action not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = PendingActionSerializer(pending_action, many=True) 
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notpending_asset(request):
    try:
        asset = Asset.objects.filter(is_pending=False)
        serializer = AssetSerializer(asset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Asset.DoesNotExist:
        return Response({"error": "No assets found that are not pending."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def ispending_asset(request):
    try:
        asset = Asset.objects.filter(is_pending=True)
        serializer = AssetSerializer(asset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Asset.DoesNotExist:
        return Response({"error": "No assets found that are pending."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def updated_asset(request):
    try:
        asset = Asset.objects.filter(is_updated=True)
        serializer = AssetSerializer(asset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Asset.DoesNotExist:
        return Response({"error": "No assets found that are updated."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_assets(request):
    if request.user.is_staff:
        assets = Asset.objects.all()  # Admin can see all assets
    else:
        assets = Asset.objects.filter(is_pending=False)  # Normal user sees only assets with is_pending=False
    serializer = AssetSerializer(assets, many=True)
    return Response(serializer.data)



@api_view(['POST'])
def request_delete_asset(request, asset_id):
    asset = Asset.objects.get(id=asset_id)
    asset.is_pending = True
    asset.pendingAndUpdated_desc = request.data.get('description', '')
    asset.save()
    return Response({"message": "Delete request sent successfully."})


from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Asset

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def asset_stats(request):
    """
    Return asset statistics like total assets, updated assets, pending approval assets.
    """
    total_assets = Asset.objects.count()
    updated_assets = Asset.objects.filter(is_updated=True).count()
    pending_approval_assets = Asset.objects.filter(is_pending=True).count()

    stats = {
        'total_assets': total_assets,
        'updated_assets': updated_assets,
        'pending_approval_assets': pending_approval_assets,
    }

    return Response(stats)


# 3. List all assets or create a new asset
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Asset
from .serializers import AssetSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def deleted_assets(request):
    """
    List all assets marked as 'deleted' (is_pending=True).
    """
    if request.method == 'GET':
        # Filter assets where 'is_pending' is True (considered as deleted)
        deleted_assets = Asset.objects.filter(is_pending=True)

        # Serialize the filtered assets
        serializer = AssetSerializer(deleted_assets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Asset
from .serializers import AssetSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def updated_assets(request):
    """
    List all assets that are marked as updated.
    """
    assets = Asset.objects.filter(is_updated=True)
    serializer = AssetSerializer(assets, many=True)
    return Response(serializer.data)




# 4. Retrieve, update, or delete a specific asset by its ID
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def asset_stats_detail(request, pk):
    """
    Retrieve, update, or delete a specific asset.
    """
    try:
        asset = Asset.objects.get(pk=pk)
    except Asset.DoesNotExist:
        return Response({'error': 'Asset not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AssetSerializer(asset)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = AssetSerializer(asset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        asset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def reject_asset_deletion(request, asset_id):
    """
    Reject the deletion request of a specific asset by setting is_pending to False.
    """
    try:
        asset = Asset.objects.get(id=asset_id)
        asset.is_pending = False
        asset.pendingAndUpdated_desc = None  # Clear the pending reason
        asset.save()
        return Response({'message': 'Deletion request rejected successfully.'}, status=status.HTTP_200_OK)
    except Asset.DoesNotExist:
        return Response({'error': 'Asset not found.'}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['GET'])    
def get_inactive_assets(request):
    try:
        active = Asset.objects.filter(asset_status='C')
        serializer = AssetSerializer(active, many=True)
        return Response(serializer.data)

    except Asset.DoesNotExist:
        return Response('Error does not found', status=status.HTTP_204_NO_CONTENT)
    
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Asset
from .serializers import AssetSerializer

# Approve asset update (set is_updated to False)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Asset  # Assuming Asset is your model

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def approve_asset_update(request, asset_id):
    """
    Approve the update request of a specific asset by setting is_updated to False and clearing the description.
    """
    try:
        asset = Asset.objects.get(id=asset_id)
    except Asset.DoesNotExist:
        return Response({"error": "Asset not found."}, status=status.HTTP_404_NOT_FOUND)

    # Check if asset is in an updated state
    if asset.is_updated:
        asset.is_updated = False  # Set is_updated to False to approve
        asset.pendingAndUpdated_desc = None  # Clear the pending description
        asset.save()
        return Response({"message": "Asset update approved successfully."}, status=status.HTTP_200_OK)
    
    return Response({"error": "Asset update has already been approved."}, status=status.HTTP_400_BAD_REQUEST)



# Reject asset update (redirect to the update page)
@api_view(['PUT'])
def reject_asset_update(request, asset_id):
    try:
        asset = Asset.objects.get(id=asset_id)
    except Asset.DoesNotExist:
        return Response({"error": "Asset not found."}, status=status.HTTP_404_NOT_FOUND)

    # Reject the update and perhaps mark asset as still pending or another action
    # Depending on what logic you want here, you can handle the rejection state.

    # For demonstration, return a message that it has been rejected and redirect.
    # In a real-world scenario, you might handle rejection differently.

    return Response({
        "message": "Asset update rejected. Redirecting to update page.",
        "redirect_url": f"/assetupdate/{asset_id}"
    }, status=status.HTTP_200_OK)

    
    
    





    






