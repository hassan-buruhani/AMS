from django.urls import path
from django.contrib.auth import views as auth_views
from asset_mgt_app.views import CurrentUserView
from asset_mgt_app import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [

    # Token and Authentication
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.logout, name='logout'),

    # User Management
    path('users/', views.manage_user, name='manage-users'),  # List and create users
    path('users/<int:pk>/', views.manage_user, name='user-detail'),  # User detail
    path('users/me/', CurrentUserView.as_view(), name='current-user'),  # Current user detail
    path('users/<int:pk>/change-password/', views.change_password, name='change_password'),
    # Offices
    path('office/', views.manage_office, name='manage-office'), 
    path('office/<int:pk>/', views.manage_office, name='manage-office'),
      # List and create offices
    # Office detail

    # Divisions
    path('divisions/', views.division_list_create, name='division-list-create'),  # List and create divisions
    path('divisions/<int:pk>/', views.division_detail, name='division-detail'),  # Division detail

    # Assets
    path('assets/', views.asset_list_create, name='asset-list-create'),  # List and create assets
    path('assets/<int:pk>/', views.asset_detail, name='asset-detail'),  # Asset detail
    path('assets/<int:pk>/update/', views.update_asset, name='update_asset'),  # Update asset
    path('assets/by_division/', views.assets_by_division, name='assets-by-division'),  # Assets by division
    path('assets/need-troubleshooting/', views.assets_need_troubleshooting, name='assets-need-troubleshooting'),
    path('assets/category-distribution/', views.category_distribution, name='category_distribution'),
    path('assets/count-need-troubleshooting/', views.count_assets_need_troubleshooting, name='count-assets-need-troubleshooting'),
    path('assets/inactive/', views.inactive_assets, name='inactive-assets'),
    path('assets-list/', views.list_assets, name='list_assets'),
    path('assets/asset-stats/', views.asset_stats, name='asset_stats'),
    path('assets/assets-stats-details/<int:pk>/', views.asset_detail, name='asset-detail-stats'),
    path('assets/deleted/', views.deleted_assets, name='deleted-assets'),
    path('assets/updated/', views.updated_assets, name='updated-assets'),
    path('assets/inactive/', views.get_inactive_assets),
    path('assets/active-assets/', views.active_assets),

    # Pending and Approval Actions
    path('assets/pending-assets/', views.ispending_asset, name='pending-assets'),
    path('assets/updated-assets/', views.updated_asset, name='updated-assets'),
    path('assets/not-pending-assets/', views.notpending_asset, name='not-pending-assets'),
    path('assets/<int:asset_id>/delete-request/', views.request_delete_asset, name='request_delete_asset'),
    path('assets/pending-actions/<int:pk>/', views.get_pending_actions, name='get_pending_actions'),
    path('assets/pending-actions/<int:pk>/approve/', views.approve_pending_action, name='approve_pending_action'),
    path('pending-actions/<int:id>/approve/', views.approve_pending_action, name='approve_pending_action_by_id'),
    path('pending-actions/<int:id>/reject/', views.reject_pending_action, name='reject_pending_action_by_id'),
    path('assets/<int:asset_id>/reject/', views.reject_asset_deletion, name='reject_asset_deletion'),
    path('assets/<int:asset_id>/approve/', views.approve_asset_update, name='approve_asset_update'),
    path('assets/<int:asset_id>/reject-update/', views.reject_asset_update, name='reject_asset_update'),

    # Maintenances
    path('maintenances/', views.maintainance_list_create, name='maintainance-list-create'),  # List and create maintenance
    path('maintenances/<int:pk>/', views.maintainance_detail, name='maintainance-detail'),  # Maintenance detail

    # Password Reset
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset_done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('password-reset/', views.request_password_reset, name='password_reset_request'),
    path('reset-password/<uidb64>/<token>/', views.reset_password_confirm, name='password_reset_confirm_custom'),

    # CSRF Token
    # path('get_csrf_token/', views.get_csrf_token, name='get_csrf_token'),
]
