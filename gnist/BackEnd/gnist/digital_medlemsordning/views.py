from django.shortcuts import render
from django.http import HttpResponse

from django.http import JsonResponse
import json
from datetime import date
from django.shortcuts import get_object_or_404
from .models import Members
from .models import Activity
from .models import ActivityDate
from .models import ActivitySignup

# Create your views here.

def index(request):
    return HttpResponse("Hello, from the root path of digital_medlemsording.")


def get_all_member_data(request):
    members = Members.objects.all()
    member_data = []

    for member in members:
        days_without_incident = member.days_without_incident
        if days_without_incident <= 19:
            level = "Noob"
        elif 20 <= days_without_incident <= 49:
            level = "Rookie"
        elif 50 <= days_without_incident <= 99:
            level = "Pro"
        else:
            level = "Legend"
        
        is_banned = member.banned
        if is_banned == 0:
            profile_color = "green"
        elif is_banned == 1:
            profile_color = "red"

        member_info = {
            'first_name': member.first_name,
            'level': level,
            'profile_color': profile_color 
        }
        member_data.append(member_info)
    
    today_date = date.today().strftime("%Y-%m-%d")

    response_data = {
        'date': today_date,
        'members': member_data
    }
    return JsonResponse(response_data, safe=False)



def get_one_member_data(request, user_id):
    try:
        member = Members.objects.get(userID=user_id)
    except Members.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)

    days_without_incident = member.days_without_incident
    if days_without_incident <= 19:
        level = "Noob"
    elif 20 <= days_without_incident <= 49:
        level = "Rookie"
    elif 50 <= days_without_incident <= 99:
        level = "Pro"
    else:
        level = "Legend"
    
    is_banned = member.banned
    if is_banned:
        profile_color = "red"
    else:
        profile_color = "green"

    member_info = {
        'first_name': member.first_name,
        'level': level,
        'profile_color': profile_color 
    }
    
    today_date = date.today().strftime("%Y-%m-%d")

    response_data = {
        'date': today_date,
        'member': member_info
    }
    return JsonResponse(response_data)

def ban_member(request, user_id):
    try:
        member = Members.objects.get(userID=user_id)
    except Members.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)

    member.banned = True
    member.save()

    return JsonResponse({'message': 'Member banned successfully'})

def get_activity(request):
    today_date = date.today()

    # Filter activity dates happening on the same day
    activity_dates = ActivityDate.objects.filter(date=today_date)

    activity_data = []
    for activity_date in activity_dates:
        activity_info = {
            'title': activity_date.activityID.title, 
            'description': activity_date.activityID.description,
        }
        activity_data.append(activity_info)

    response_data = {
        'date': today_date.strftime("%Y-%m-%d"),
        'activities': activity_data
    }
    return JsonResponse(response_data)

def get_all_activity(request):
     # Get all activities
    activities = Activity.objects.all()

    activity_data = []
    for activity in activities:
        activity_info = {
            'title': activity.title, 
            'description': activity.description,
        }
        activity_data.append(activity_info)

    response_data = {
        'activities': activity_data
    }
    return JsonResponse(response_data)


def get_member_activity(request, user_id):
    try:
     
        activity_signups = ActivitySignup.objects.filter(userID=user_id)

        activity_data = []
        for signup in activity_signups:
            activity_info = {
                'title': signup.activityID.title, 
                'description': signup.activityID.description,
            }
            activity_data.append(activity_info)

        response_data = {
            'activities': activity_data
        }
        return JsonResponse(response_data)
    except Members.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)