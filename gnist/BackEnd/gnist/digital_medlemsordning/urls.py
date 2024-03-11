from django.urls import path
from . import views
from django.conf import settings

urlpatterns = [
    path("", views.index, name="index"),
    path('get_all_members/', views.get_all_member_data, name='all_member_data'),
    path('get_member/<int:user_id>/', views.get_one_member_data, name='member_data'),
    path('ban_member/<int:user_id>/', views.ban_member, name='ban_member'),
    path('unban_member/<int:user_id>/', views.unban_member, name='unban_member'),
    path('get_activity/', views.get_activity, name='get_activity'),
    path('get_all_activity/', views.get_all_activity, name='get_all_activity'),
    path('get_member_activity/<int:user_id>/', views.get_member_activity, name='get_member_activity'),
    path('add_day/<int:user_id>/', views.add_day, name='add_day'),
    path('register_user/', views.register_user, name='register_user'),
    path('get_all_members_info/', views.get_all_members_info, name='get_all_members_info'),
    path('alter_member_info/<int:user_id>/', views.alter_member_info, name='alter_member_info'),
    path('adjust_member_points_total/<int:user_id>/', views.adjust_member_points_total, name='adjust_member_points_total'),
    path('create_suggestion/<int:user_id>/', views.create_suggestion, name='create_suggestion'),
    path('get_all_suggestions/', views.get_all_suggestions, name='get_all_suggestions'),
    path('delete_suggestion/<int:suggestion_id>/', views.delete_suggestion, name='delete_suggestion'),
    path('upload-profile-picture/<int:user_id>/', views.upload_member_profile_pic, name='upload-profile-picture'),
    path('add_activity_image/<int:activity_id>/', views.upload_activity_image, name="add_activity_image"),
    path('add_user_certificate/<int:user_id>/', views.upload_user_certificate, name="add_user_certificate"),
    path('create_level/', views.create_level, name='create_level'),
    path('get_all_levels/', views.get_all_levels, name='get_all_levels'),
    path('delete_level/<int:level_id>/', views.delete_level, name='delete_level'),
]
