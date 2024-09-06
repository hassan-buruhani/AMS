from asset_mgt_app.views import get_asset
from django.urls import path

urlpatterns = [
     path('get_asset/', get_asset)
]
