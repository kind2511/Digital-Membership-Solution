from django.urls import path
from . import views
from django.conf import settings

urlpatterns = [
    path("", views.index, name="index"),
    path('get_all_members/', views.get_all_member_data, name='all_member_data'),
    path('get_member/<str:auth0_id>/', views.get_one_member_data, name='member_data'),
    path('ban_member/<int:user_id>/', views.ban_member, name='ban_member'),
    path('unban_member/<int:user_id>/', views.unban_member, name='unban_member'),
    path('get_activity_today/', views.get_activity_today, name='get_activity_today'),
    path('get_all_activity/', views.get_all_activity, name='get_all_activity'),
    path('get_member_activity/<int:user_id>/', views.get_member_activity, name='get_member_activity'),
    path('add_day/<str:auth0_id>/', views.add_day, name='add_day'),
    path('register_user/', views.register_user, name='register_user'),
    path('get_members_today/', views.get_members_today, name='get_member_today'),
    path('get_members_for_date/<str:one_date>/', views.get_members_for_date, name='get_members_for_date'),
    path('get_visit_numbers/', views.get_visit_numbers, name='get_visit_numbers'),
    path('get_visit_by_gender/', views.get_visit_by_gender, name='get_visit_by_gender'),
    path('get_visit_by_gender_one_day/<str:one_date>/',views.get_visit_by_gender_one_day, name='get_visit_by_gender_one_day'),
    path('get_ban_expiry/<int:user_id>/', views.get_ban_expiry, name='get_ban_expiry'),
    path('add_activity/', views.add_activity, name='add_activity'),
    path('get_all_members_info/', views.get_all_members_info, name='get_all_members_info'),
    path('alter_member_info/<int:user_id>/', views.alter_member_info, name='alter_member_info'),
    path('adjust_member_points_total/<int:user_id>/', views.adjust_member_points_total, name='adjust_member_points_total'),
    path('create_suggestion/', views.create_suggestion, name='create_suggestion'),
    path('get_all_suggestions/', views.get_all_suggestions, name='get_all_suggestions'),
    path('delete_suggestion/<int:suggestion_id>/', views.delete_suggestion, name='delete_suggestion'),
    path('upload-profile-picture/<str:auth0_id>/', views.upload_member_profile_pic, name='upload-profile-picture'),
    path('add_activity_image/<int:activity_id>/', views.upload_activity_image, name="add_activity_image"),
    path('add_user_certificate/<int:user_id>/', views.upload_user_certificate, name="add_user_certificate"),
    path('create_level/', views.create_level, name='create_level'),
    path('get_all_levels/', views.get_all_levels, name='get_all_levels'),
    path('delete_level/<int:level_id>/', views.delete_level, name='delete_level'),
    path('edit_level/<int:level_id>/', views.edit_level, name='edit_level'),
    path('get_sent_messages/<int:sender_id>/', views.get_sent_messages, name='get_sent_messages'),
    path('sign_up_activity/', views.sign_up_activity, name='sign_up_activity'),
    path('get_signed_up_members/<int:activity_id>/', views.get_signed_up_members, name='get_signed_up_members'),
    path('get_activity_details/<int:activity_id>/', views.get_activity_details, name='get_activity_details'),

    # Polls
    path('create_question/', views.create_question_with_answers, name='create_question'),
    path('submit_response/<str:auth0_id>/', views.submit_user_response, name='submit_response'),
    path('get_question_responses/<int:question_id>/', views.get_answer_counts_for_question, name='answer_counts_for_question'),
    path('get_all_questions/', views.get_all_questions_with_answers, name='get_all_questions'),
    path('delete_question/<int:question_id>/', views.delete_question, name='delete_question'),

    #Check Registration status
    path('check_user_registration_status/', views.check_user_registration_status, name='check_user_registration_status'),
    path('send_message/', views.send_message, name='send_message'),
]