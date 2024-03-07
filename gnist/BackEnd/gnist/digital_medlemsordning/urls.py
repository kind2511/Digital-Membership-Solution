from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('get_all_members/', views.get_all_member_data, name='all_member_data'),
    path('get_member/<int:user_id>/', views.get_one_member_data, name='member_data'),
    path('ban_member/<int:user_id>/', views.ban_member, name='ban_member'),
    path('get_activity/', views.get_activity, name='get_activity'),
     path('get_all_activity/', views.get_all_activity, name='get_all_activity'),
    path('get_member_activity/<int:user_id>/', views.get_member_activity, name='get_member_activity'),
    path('add_day/<int:user_id>/', views.add_day, name='add_day'),
    path('unban_member/<int:user_id>/', views.unban_member, name='unban_member'),
    path('register_user/', views.register_user, name='register_user'),
    path('get_members_today/', views.get_members_today, name='get_member_today'),
]

