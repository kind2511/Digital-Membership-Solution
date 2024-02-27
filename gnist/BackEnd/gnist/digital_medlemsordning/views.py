from django.shortcuts import render
from django.http import HttpResponse

from django.http import JsonResponse
import json
from datetime import date
from django.shortcuts import get_object_or_404
from .models import Members

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

def add_day(request, user_id):
    try:
        member = Members.objects.get(userID=user_id)
    except Members.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)
    
    is_banned = member.banned

    if is_banned == False:
        member.days_without_incident += 1
        member.save()
        return JsonResponse({'message': 'Successfully added one day without incident'})
    else:
        return JsonResponse({'message': 'Member is banned, cannot increase days'})

    