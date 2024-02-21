from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('get_all_members/', views.get_all_member_data, name='all_member_data'),
    path('get_member/<int:user_id>/', views.get_one_member_data, name='member_data'),
    path('ban_member/<int:user_id>/', views.ban_member, name='ban_member'),
]

