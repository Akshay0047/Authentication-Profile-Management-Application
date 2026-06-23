from django.urls import path
from api import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('logout/', views.logout),
    path('profile/', views.get_profile),
    path('profile/update/', views.update_profile),
    path('profile/upload/', views.upload_profile_image),
    path('token/refresh/', views.refresh_token),
]