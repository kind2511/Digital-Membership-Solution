from django.http import HttpResponse
from datetime import date, datetime, timedelta
from .models import Members
from .models import MemberDates
from .models import Activity
from .models import ActivityDate
from .models import ActivitySignup
from .models import SuggestionBox
from .models import Level
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count
import json
from .serializers import MembersSerializer
from .serializers import SuggestionBoxSerializer
from .serializers import LevelSerializer



# Create your views here.

@api_view(['GET'])
def index(request):
    return HttpResponse("Hello, from the root path of digital_medlemsording.")


# Gets certain member data about all members
@api_view(['GET'])
def get_all_member_data(request):
    members = Members.objects.all()
    member_data = []

    # Get all levels ordered by points in ascending order
    levels = Level.objects.order_by('points')

    # Retrieve the highest level
    highest_level = levels.last()

    for member in members:
        days_without_incident = member.days_without_incident

        # Iterate through levels to find the correct level for the member
        for level in levels:
            if days_without_incident <= level.points:
                level_name = level.name
                break

        # Check if the member's points exceed the highest level's points
        if days_without_incident > highest_level.points:
            level_name = highest_level.name
        
        is_banned = member.banned
        if is_banned == 0:
            profile_color = "green"
        elif is_banned == 1:
            profile_color = "red"

        member_info = {
            'first_name': member.first_name.upper(),
            'level': level_name,
            'profile_color': profile_color,
            'profile_pic': member.profile_pic.url,
            'certificate': member.certificate.url,
            'banned_from': member.banned_from,  
            'banned_until': member.banned_until,
        }
        member_data.append(member_info)
    
    today_date = date.today().strftime("%Y-%m-%d")

    response_data = {
        'date': today_date,
        'members': member_data,
    }
    return Response(response_data)


# Gets certain member data about a specific user
@api_view(['GET'])
def get_one_member_data(request, user_id):
    try:
        member = Members.objects.get(userID=user_id)
    except Members.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=404)

     # Get all levels ordered by points in ascending order
    levels = Level.objects.order_by('points')

    # Retrieve the highest level
    highest_level = levels.last()

    days_without_incident = member.days_without_incident

    # Iterate through levels to find the correct level for the member
    for level in levels:
        if days_without_incident <= level.points:
            level_name = level.name
            break

    # Check if the member's points exceed the highest level's points
    if days_without_incident > highest_level.points:
        level_name = highest_level.name
    
    is_banned = member.banned
    if is_banned:
        profile_color = "red"
    else:
        profile_color = "green"

    member_info = {
        'first_name': member.first_name.upper(),
        'level': level_name,
        'profile_color': profile_color,
        'profile_pic': member.profile_pic.url,
        'certificate': member.certificate.url,
        'banned_from': member.banned_from,  
        'banned_until': member.banned_until, 
    }
    
    today_date = date.today().strftime("%Y-%m-%d")

    response_data = {
        'date': today_date,
        'member': member_info
    }
    return Response(response_data)


@api_view(['GET'])
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
    return Response(response_data)


@api_view(['GET'])
def get_all_activity(request):
    activities = Activity.objects.all()

    activity_data = []
    for activity in activities:
        activity_dates = ActivityDate.objects.filter(activityID=activity)
        dates_list = [date.date.strftime('%Y-%m-%d') for date in activity_dates]

        activity_info = {
            'title': activity.title,
            'description': activity.description,
            'dates': dates_list,
            'image': activity.image.url
        }

        activity_data.append(activity_info)

    response_data = {
        'activities': activity_data
    }
    return Response(response_data)


@api_view(['GET'])
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
        return Response(response_data)
    except Members.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=404)


@api_view(['GET'])
def add_day(request, user_id):
    today = datetime.today()

    try:
        member = Members.objects.get(userID=user_id)
    except Members.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=404)
    
    is_banned = member.banned
    dates = MemberDates.objects.filter(date=today, userID=member)
    if not dates:
        is_registered = False
    else:
        is_registered = True

    if is_banned == False and is_registered == False:
        member.days_without_incident += 1
        member.save()
        new_memberdate = MemberDates(date = today, userID = member)
        new_memberdate.save()
        return Response({'message': 'Successfully added one day without incident'})
    else:
        return Response({'message': 'Cannot add one extra day'})


# Bans a member
@api_view(['PUT'])
def ban_member(request, user_id):
    try:
        member = Members.objects.get(userID=user_id)
    except Members.DoesNotExist:
        return Response({"error": "Member not found"}, status=404)
    
    ban_duration = request.data.get('ban_duration')

    try:
        ban_duration = int(ban_duration)
        if ban_duration <= 0:
            raise ValueError("Ban duration must be a positive integer")
    except (ValueError, TypeError):
        return Response({"error": "Invalid ban duration"}, status=400)

    member.banned = True
    member.banned_from = datetime.now()
    member.banned_until = datetime.now() + timedelta(days=ban_duration)
    member.save()

    return Response({'message': f'Member banned successfully until {member.banned_until}'})


# Unbanns a memebr
@api_view(['GET'])
def unban_member(request, user_id):
    try:
        member = Members.objects.get(userID=user_id)
    except Members.DoesNotExist:
        return Response({"error": "Member not found"}, status=404)
    
    member.banned = False
    member.banned_from = None
    member.banned_until = None

    member.save()

    return Response({'message': f'Member unbanned successfully'})


# Registering a new user
@api_view(['POST'])
@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        auth0id = data['auth0id']
        fname = data['first_name']
        lname = data['last_name']
        bdate = data['birthdate']
        gender = data['gender']
        phone_number = data['phone_number']
        email = data['email']
        guardian_name = data['guardian_name']
        guardian_phone = data['guardian_phone']
        is_banned = 0
        days = 0
        verified = 0

        new_member = Members(auth0ID=auth0id, first_name=fname, last_name=lname, birthdate=bdate, gender=gender, phone_number=phone_number, email=email, guardian_name=guardian_name, guardian_phone=guardian_phone, banned=is_banned, days_without_incident=days, verified=verified)
        new_member.save()
        return Response({'message': 'Added new user'})
    else:
        return Response({'error': 'Invalid request method'})
    
@api_view(['GET'])
def get_members_today(request):
    today = datetime.today()
    try:
        datelist = MemberDates.objects.filter(date=today)
    except MemberDates.DoesNotExist:
        return Response({'message': 'No one has registered today'})
    
    members_present = []
    for member in datelist:
        members_present.append(member.userID.first_name + " " + member.userID.last_name)
    
    return Response(members_present)

@api_view(['GET'])
def get_members_for_date(request, one_date):
    try:
        datelist = MemberDates.objects.filter(date=one_date)
    except MemberDates.DoesNotExist:
        return Response({'message': 'No one has registered today'})
    
    members_present = []
    for member in datelist:
        members_present.append(member.userID.first_name + " " + member.userID.last_name)
    
    return Response(members_present)

@api_view(['GET'])
def get_visit_numbers(request):
    try:
        dates = MemberDates.objects.all().values('date').annotate(visits=Count('userID', distinct=True)).order_by()
    except:
        return Response({'error':'No dates exist'}, status=404)
    
    return Response(dates)

@api_view(['GET'])
def get_ban_expiry(request, user_id):
    banned_member = Members.objects.get(userID=user_id)

    if banned_member.banned:
        return Response(banned_member.banned_until)
    else:
        return Response({'error': 'member not banned'})
    
    
@api_view(['POST'])
@csrf_exempt
def add_activity(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        activityid = data['activityID']
        title = data['title']
        description = data['description']
        date = data['date'] 


        new_activity  = Activity(activityID=activityid, title=title, description=description)
        new_activity .save()

        new_activity_date = ActivityDate(activityID=new_activity, date=date)
        new_activity_date.save()

        return Response({'message': 'Activity added successfully'})
    else:
        return Response({'error': 'Invalid request method'})
    

# Gets all info about all members
@api_view(['GET'])
def get_all_members_info(request):
    members = Members.objects.all()
    serializer = MembersSerializer(members, many=True)
    return Response(serializer.data)
    

# Lets a member add additional info about a specific memeber
@api_view(['PUT'])
def alter_member_info(request, user_id):
        try:
            member = Members.objects.get(userID=user_id)
        except Members.DoesNotExist:
             return Response({"error": "Member not found"}, status=404)
        
        new_info = request.data.get("info")
        if new_info is None:
            return Response({"error": "Missing 'info' field in request data"}, status=400)
        
        member.info = new_info
        member.save()

        serializer = MembersSerializer(member)
        return Response(serializer.data)
        

# Lets an employee adjust the members points total up or down
@api_view(['PUT'])
def adjust_member_points_total(request, user_id):
    try:
        member = Members.objects.get(userID=user_id)
    except Members.DoesNotExist:
        return Response({"error": "Member not found"}, status=404)
    
    adjusted_points = request.data.get("days_without_incident")
    if adjusted_points is None:
        return Response({"error": "Missing 'days_without_incident' field in request data"}, status=400)

    member.days_without_incident = member.days_without_incident + adjusted_points
    member.save()

    serializer = MembersSerializer(member)
    return Response(serializer.data)


# Lets a user create a new suggestion
@api_view(['POST'])
def create_suggestion(request, user_id):
    try:
        member = Members.objects.get(userID=user_id)
    except Members.DoesNotExist:
        return Response({"error": "Member not found"}, status=404)
    
    if request.method == 'POST':
        serializer = SuggestionBoxSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)


# Gets all the suggestions
@api_view(['GET'])
def get_all_suggestions(request):
    suggestions = SuggestionBox.objects.all()
    serializer = SuggestionBoxSerializer(suggestions, many=True)
    return Response(serializer.data)


# Deletes a suggestion
@api_view(['GET','DELETE'])
def delete_suggestion(request, suggestion_id):
    try:
        suggestion = SuggestionBox.objects.get(suggestionID=suggestion_id)
        suggestion.delete()
        return Response({"message": "Suggestion successfully deleted"}, status=204)
    
    except SuggestionBox.DoesNotExist:
        return Response({"error": "Suggestion not found"}, status=404)

    
# Duplicate Code
#-------------------------------------------------------------------------------------------------------

# Upload member profile picture
@api_view(['PATCH'])
def upload_member_profile_pic(request, user_id):
    try:
        member = Members.objects.get(userID=user_id)
    except Members.DoesNotExist:
        return Response({"error": "Member not found"}, status=404)
    
    if request.method == 'PATCH':
        # Get the profile picture data from the request
        profile_pic_data = request.data.get('profile_pic')
        
        # If profile picture data is provided, update the profile picture
        if profile_pic_data:
            member.profile_pic = profile_pic_data
            member.save()
            return Response({"message": "Profile picture updated successfully"}, status=200)
        else:
            return Response({"error": "Profile picture data not provided"}, status=400)
    

# Upload activity image
@api_view(['PATCH'])
def upload_activity_image(request, activity_id):
    try:
        activity = Activity.objects.get(activityID=activity_id)
    except Activity.DoesNotExist:
        return Response({"error": "Activity not found"}, status=404)
    
    if request.method == 'PATCH':
        activity_pic_data = request.data.get('image')

    if activity_pic_data:
        activity.image = activity_pic_data
        activity.save()
        return Response({"message": "Activity picture updated successfully"}, status=200)
    else:
        return Response({"error": "Activity picture data not provided"}, status=400)


# Upload member certificate
@api_view(['PATCH'])
def upload_user_certificate(request, user_id):
    try:
        member = Members.objects.get(userID=user_id)
    except Members.DoesNotExist:
        return Response({"error": "Member not found"}, status=404)
    
    if request.method == 'PATCH':
        # Get the profile picture data from the request
        certificate_data = request.data.get('certificate')
        
        # If profile picture data is provided, update the profile picture
        if certificate_data:
            member.certificate = certificate_data
            member.save()
            return Response({"message": "Member certificate updated successfully"}, status=200)
        else:
            return Response({"error": "Member certificate not provided"}, status=400)
        
#-------------------------------------------------------------------------------------------------------


# Get all user levels
@api_view(['GET'])
def get_all_levels(request):
    if request.method == 'GET':
        levels = Level.objects.all()
        serializer = LevelSerializer(levels, many=True)
        return Response(serializer.data)


# Create a user level
@api_view(['POST'])
def create_level(request):
    if request.method == 'POST':
        serializer = LevelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Level successfully created'}, status=201)
        return Response(serializer.errors, status=400)
    

# Delete a user level
@api_view(['DELETE'])
def delete_level(request, level_id):
    try:
        level = Level.objects.get(levelID=level_id)
    except Level.DoesNotExist:
        return Response({'message': 'Level not found'}, status=404)

    if request.method == 'DELETE':
        level.delete()
        return Response({'message': 'Level deleted successfully'}, status=204)
    

# Edit a user level
@api_view(['PUT'])
def edit_level(request, level_id):
    try:
        level = Level.objects.get(levelID=level_id)
    except Level.DoesNotExist:
        return Response({'message': 'Level not found'}, status=404)

    if request.method == 'PUT':
        # Partial allows us not to update only selected fields, and not all
        serializer = LevelSerializer(level, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Level updated successfully'}, status=200)
        return Response(serializer.errors, status=400)
    
