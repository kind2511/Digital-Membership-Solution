from django.urls import path
from . import views
from django.conf import settings

urlpatterns = [
    path("", views.index, name="index"),

    # Get member data for dashboard for all members
    path('get_all_members/', views.get_all_member_data, name='all_member_data'),
    # Get member data for dashboard for one specific member
    path('get_member/<str:auth0_id>/', views.get_one_member_data, name='member_data'),
    # Gets all info about a member
    path('get_all_members_info/', views.get_all_members_info, name='get_all_members_info'),


    # Activities

    # Create a new activity
    path('create_activity/', views.create_activity, name='create_activity'),
    # Delete an activity
    path('delete_activity/<int:activity_id>/', views.delete_activity, name='delete_activity'),
    # Get all activites of today
    path('get_activity_today/', views.get_activity_today, name='get_activity_today'),
    # Get all activities
    path('get_all_activity/', views.get_all_activity, name='get_all_activity'),
    # Get all past activities
    path('get_past_activities/', views.get_past_activities, name='get_past_activities'),
    #Get all activities that has not yet occured
    path('get_future_activities/', views.get_future_activities, name='get_future_activities'),
    # Lets member sign up for activity
    path('sign_up_activity/', views.sign_up_activity, name='sign_up_activity'),
    # Gets details about a specific activity
    path('get_activity_details/<int:activity_id>/', views.get_activity_details, name='get_activity_details'),
    # Gets all members signed up for a specific activity
    path('get_signed_up_members/<int:activity_id>/', views.get_signed_up_members, name='get_signed_up_members'),
    # Gets all the activities that a specific member has signed up for
    path('get_member_activites/<str:auth0_id>/', views.get_member_activities, name='get_member_activity'),
    # Uploade activity image
    path('add_activity_image/<int:activity_id>/', views.upload_activity_image, name="add_activity_image"),

    

    # Register attendence for member
    path('add_day/<str:auth0_id>/', views.add_day, name='add_day'),

    # Create a new member
    path('register_user/', views.register_user, name='register_user'),

    # Gets all members who registered their attendance on a specific date
    path('get_member_attendance/', views.get_member_attendance, name='get_member_today'),

    path('get_visit_numbers/', views.get_visit_numbers, name='get_visit_numbers'),
    path('get_visit_by_gender/', views.get_visit_by_gender, name='get_visit_by_gender'),
    path('get_visit_by_gender_one_day/<str:one_date>/',views.get_visit_by_gender_one_day, name='get_visit_by_gender_one_day'),

    # Gets all bannes members
    path('get_banned_members/', views.get_banned_members, name='get_banned_members'),
    # Bans a member
    path('ban_member/<str:auth0_id>/', views.ban_member, name='ban_member'),
    # Unbans a member
    path('unban_member/<str:auth0_id>/', views.unban_member, name='unban_member'),

    # Adds info about a specific user
    path('add_member_info/<str:auth0_id>/', views.add_member_info, name='add_member_info'),

    path('adjust_member_points_total/<str:auth0_id>/', views.adjust_member_points_total, name='adjust_member_points_total'),


    # Lets a user upload a profile picture
    path('upload-profile-picture/<str:auth0_id>/', views.upload_member_profile_pic, name='upload-profile-picture'),

    # Lets a member create and send in a suggestion
    path('create_suggestion/', views.create_suggestion, name='create_suggestion'),

    # Gets all the suggestions
    path('get_all_suggestions/', views.get_all_suggestions, name='get_all_suggestions'),

    # Deletes a spescific suggestion
    path('delete_suggestion/<int:suggestion_id>/', views.delete_suggestion, name='delete_suggestion'),

    path('add_user_certificate/<str:auth0_id>/', views.upload_user_certificate, name="add_user_certificate"),

    # Creates a new level
    path('create_level/', views.create_level, name='create_level'),

    # Gets all existing levels (names and points)
    path('get_all_levels/', views.get_all_levels, name='get_all_levels'),

    # Deletes a level
    path('delete_level/<int:level_id>/', views.delete_level, name='delete_level'),

    #Edits a level
    path('edit_level/<int:level_id>/', views.edit_level, name='edit_level'),
    
    # Gets all members with specific info
    path('get_members_with_info/', views.members_with_info, name='get_members_with_info'),
    # Sets specific member info to ""
    path('remove_member_info/<str:auth0_id>/', views.remove_member_info, name='update_member_info'),

    # Creates a question and corresponding answers
    path('create_question/', views.create_question_with_answers, name='create_question'),
    # Lets a member answer a question
    path('submit_response/<str:auth0_id>/', views.submit_user_response, name='submit_response'),
    # Gets the number of member responses for each answer for a specific question
    path('get_question_responses/<int:question_id>/', views.get_answer_counts_for_question, name='answer_counts_for_question'),
    # Gets all questions and corresponding anwsers
    path('get_all_questions/', views.get_all_questions_with_answers, name='get_all_questions'),
    # Deletes a question and all corresponing answers
    path('delete_question/<int:question_id>/', views.delete_question, name='delete_question'),


    # Check Registration status
    path('check_user_registration_status/', views.check_user_registration_status, name='check_user_registration_status'),

    # Messages
    path('send_message/', views.send_message, name='send_message'),
    path('get_sent_messages/<int:sender_id>/', views.get_sent_messages, name='get_sent_messages'),

    # Register a new employee
    path('register_employee/', views.register_employee, name='register_employee'),

    # Get all unverified members
    path('get_all_unverified_members/', views.get_all_unverified_members, name='get_all_unverified-members'),
    path('verify_member/<str:auth0_id>/', views.verify_member, name='verify_member'),

    # Searches for a member by name
    path('search_member/', views.search_member, name='search_member'),

    # Gets stats about member attendence
    path('member_attendance_stats/', views.get_member_attendance_stats, name='member_attendance_stats'),

    # Deletes a member that does not pass the verification stage
    path('delete_member/<str:auth0_id>/', views.delete_member, name='delete_member'),
]
