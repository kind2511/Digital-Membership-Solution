from django.http import HttpResponse
from django.http import JsonResponse
from datetime import date, datetime, timedelta
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
            'first_name': member.first_name.upper(),
            'level': level,
            'profile_color': profile_color,
            'profile_pic': member.profile_pic.url,  
            'banned_until': member.banned_until,
        }
        member_data.append(member_info)
    
    today_date = date.today().strftime("%Y-%m-%d")

    response_data = {
        'date': today_date,
        'members': member_data,
    }
    return JsonResponse(response_data)



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
        'first_name': member.first_name.upper(),
        'level': level,
        'profile_color': profile_color,
        'profile_pic': member.profile_pic.url,
        'banned_until': member.banned_until, 
    }
    
    today_date = date.today().strftime("%Y-%m-%d")

    response_data = {
        'date': today_date,
        'member': member_info
    }
    return JsonResponse(response_data)


def update_ban_status(request, user_id, ban_status):
    try:
        member = Members.objects.get(userID=user_id)
    except Members.ObjectDoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)
    
    member.banned = ban_status

    if ban_status:
        member.banned_until = datetime.now() + timedelta(5)
    else:
        member.banned_until = None

    member.save()

    action = 'banned' if ban_status else 'unbanned'
    return JsonResponse({'message': f'Member {action} successfully'})

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
    activities = Activity.objects.all()

    activity_data = []
    for activity in activities:
        activity_dates = ActivityDate.objects.filter(activityID=activity)
        dates_list = [date.date.strftime('%Y-%m-%d') for date in activity_dates]

        activity_info = {
            'title': activity.title,
            'description': activity.description,
            'dates': dates_list
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
            activity_dates = signup.activityID.activitydate_set.all()
            dates_list = [date.date.strftime('%Y-%m-%d') for date in activity_dates]

            activity_info = {
                'title': signup.activityID.title, 
                'description': signup.activityID.description,
                'dates': dates_list
            }
            activity_data.append(activity_info)

        response_data = {
            'activities': activity_data
        }
        return JsonResponse(response_data)
    except Members.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)


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

    

def ban_member(request, user_id):
    return update_ban_status(request, user_id, True)

def unban_member(request, user_id):
    return update_ban_status(request, user_id, False)

