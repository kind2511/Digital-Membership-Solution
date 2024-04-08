from django.http import HttpResponse
from datetime import date, datetime, timedelta
from .models import Members
from .models import Employee
from .models import MemberDates
from .models import Activity
from .models import ActivityDate
from .models import ActivitySignup
from .models import SuggestionBox
from .models import Level
from .models import Message
from .models import MemberAnswer
from .models import PollQuestion
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count
import json
from .serializers import MembersSerializer
from .serializers import SuggestionBoxSerializer
from .serializers import LevelSerializer
from .authurization import authorize_user
from .serializers import MessageSerializer
from .serializers import ActivitySerializer
from .serializers import PollQuestionSerializer
from .serializers import MemberAnswerSerializer
from django.db.models import Q




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

        # Check if certificate field is not empty before accessing its URL
        certificate_url = member.certificate.url if member.certificate else ''

        member_info = {
            'first_name': member.first_name.upper(),
            'level': level_name,
            'profile_color': profile_color,
            'profile_pic': member.profile_pic.url,
            'certificate': certificate_url,
            'banned_from': member.banned_from,  
            'banned_until': member.banned_until,
            'role': member.role,
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
def get_one_member_data(request, auth0_id):

    # Authorization check using validate_access_token function
    auth_result = authorize_user(auth0_id)
    if auth_result.status_code != 200:
        return auth_result  # Return the response from validate_access_token if not authorized

    try:
        member = Members.objects.get(auth0ID=auth0_id)
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
        'role': member.role, 
    }
    
    today_date = date.today().strftime("%Y-%m-%d")

    response_data = {
        'date': today_date,
        'member': member_info
    }
    return Response({"message": "Authorization Granted!", "data": response_data}, status=200)

# # Gets activity today
# @api_view(['GET'])
# def get_activity_today(request):
#     today_date = date.today()

#     # Filter activity dates happening on the same day
#     activity_dates = ActivityDate.objects.filter(date=today_date)

#     activity_data = []
#     for activity_date in activity_dates:
#         activity = activity_date.activityID
#         activity_info = {
#             'title': activity.title, 
#             'description': activity.description,
#             'image': activity.image.url if activity.image else None,
#         }
#         activity_data.append(activity_info)

#     response_data = {
#         'date': today_date.strftime("%Y-%m-%d"),
#         'activities': activity_data
#     }
#     return Response(response_data)

#lists all activity
# @api_view(['GET'])
# def get_all_activity(request):
#     activities = Activity.objects.all()

#     activity_data = []
#     for activity in activities:
#         activity_dates = ActivityDate.objects.filter(activityID=activity)
#         dates_list = [date.date.strftime('%Y-%m-%d') for date in activity_dates]

#         activity_info = {
#             'activity_id': activity.activityID,
#             'title': activity.title,
#             'description': activity.description,
#             'dates': dates_list,
#             'image': activity.image.url,
#         }

#         activity_data.append(activity_info)

#     response_data = {
#         'activities': activity_data
#     }
#     return Response(response_data)

#signs up for an activity
@api_view(['POST'])
def sign_up_activity(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        auth0_id = data.get('auth0_id')
        activity_id = data.get('activity_id')

        try:
            user = Members.objects.get(auth0ID=auth0_id)
            activity = Activity.objects.get(activityID=activity_id)
        except (Members.DoesNotExist, Activity.DoesNotExist):
            return Response({'error': 'User or Activity does not exist'}, status=404)

        if ActivitySignup.objects.filter(userID=user, activityID=activity).exists():
            return Response({'message': 'User already signed up for this activity'}, status=400)

        signup = ActivitySignup(userID=user, activityID=activity)
        signup.save()

        activity_serializer = ActivitySerializer(activity)

        return Response({
            'message': 'User signed up for the activity successfully',
            'activity': activity_serializer.data  
        }, status=201)
    else:
        return Response({'error': 'Invalid request method'})
    

# Get one specific activity
@api_view(['GET'])
def get_activity_details(request, activity_id):
    try:
       
        activity = Activity.objects.get(activityID=activity_id)
    except Activity.DoesNotExist:
      
        return Response({'error': 'Activity not found'}, status=404)
    
    serializer = ActivitySerializer(activity)
    
    return Response(serializer.data)

# Get activity a specific member has signed up for
# @api_view(['GET'])
# def get_member_activity(request, user_id):
#     try:
#         activity_signups = ActivitySignup.objects.filter(userID=user_id)

#         activity_data = []
#         for signup in activity_signups:
#             activity_info = {
#                 'title': signup.activityID.title, 
#                 'description': signup.activityID.description,
#                 'dates': [],  
#             }

#             activity_dates = ActivityDate.objects.filter(activityID=signup.activityID)

#             for date in activity_dates:
#                 activity_info['dates'].append(date.date.strftime('%Y-%m-%d'))

#             activity_data.append(activity_info)

#         response_data = {
#             'activities': activity_data
#         }
#         return Response(response_data)
#     except Members.DoesNotExist:
#         return Response({'error': 'User does not exist'}, status=404)
    

# Get signed up members for a specific activity
@api_view(['GET'])
def get_signed_up_members(request, activity_id):
    try:
      
        activity = Activity.objects.get(activityID=activity_id)
    except Activity.DoesNotExist:
        return Response({'error': 'Activity does not exist'}, status=404)

    sign_up_entries = ActivitySignup.objects.filter(activityID=activity)

    member_data = []
    for entry in sign_up_entries:
        member_info = {
            'user_id': entry.userID.userID,
            'first_name': entry.userID.first_name,
            'last_name': entry.userID.last_name,
            'birthdate': entry.userID.birthdate,
            'profile_pic': entry.userID.profile_pic.url if entry.userID.profile_pic else None,
          
        }
        member_data.append(member_info)

   
    response_data = {
        'activity_id': activity_id,
        'activity_title': activity.title,
        'sign_up_members': member_data
    }

    return Response(response_data)

@api_view(['GET'])
def add_day(request, auth0_id):
    today = datetime.today()

    try:
        member = Members.objects.get(auth0ID=auth0_id)
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
def ban_member(request, auth0_id):
    try:
        member = Members.objects.get(auth0ID=auth0_id)
    except Members.DoesNotExist:
        return Response({"error": "Member not found"}, status=404)
    
    banned_from = request.data.get('banned_from')
    banned_until = request.data.get('banned_until')

    # Check if both banned_from and banned_until are provided
    if not (banned_from and banned_until):
        return Response({"error": "Both banned_from and banned_until dates are required"}, status=400)

    try:
        banned_from_date = datetime.strptime(banned_from, '%Y-%m-%d').date()
        banned_until_date = datetime.strptime(banned_until, '%Y-%m-%d').date()
    except ValueError:
        return Response({"error": "Invalid date format"}, status=400)

    # Banned from must be earlier than banned unitl
    if banned_from_date >= banned_until_date:
        return Response({"error": "banned_from must be earlier than banned_until"}, status=400)

    # Ban the member
    member.banned = True
    member.banned_from = banned_from_date
    member.banned_until = banned_until_date
    member.save()

    return Response({'message': f'Member banned successfully from {member.banned_from} until {member.banned_until}'}, status=200)


# Unbanns a memebr
@api_view(['PUT'])
def unban_member(request, auth0_id):
    try:
        member = Members.objects.get(auth0ID=auth0_id)
    except Members.DoesNotExist:
        return Response({"error": "Member not found"}, status=404)
    
    member.banned = False
    member.banned_from = None
    member.banned_until = None

    member.save()

    return Response({'message': f'Member unbanned successfully'})


# Gets all banned members and their relevant info
@api_view(['GET'])
def get_banned_members(request):
    # Retrieve all members where banned is True
    banned_members = Members.objects.filter(banned=True)

    # Extracting relevand data about the banned users
    members_data = []
    for member in banned_members:
        member_data = {
            'full_name': f"{member.first_name} {member.last_name}",
            'profile_picture': member.profile_pic.url if member.profile_pic else None,
            'banned_from': member.banned_from,
            'banned_until': member.banned_until
        }
        members_data.append(member_data)

    if members_data:
        message = "Banned members retrieved successfully."
        status_code = 200  # OK
    else:
        message = "No banned members found."
        status_code = 404  # Not Found

    response_data = {
        'message': message,
        'banned_members': members_data
    }

    return Response(response_data, status=status_code)


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


# Gets all members the attendend on a specific date. If no date is provided todays date is the one used
@api_view(['GET'])
def get_member_attendance(request):
    # Looks for provided date in the request body
    date_str = request.query_params.get('date') # :)

    # If date is provided
    if date_str:
        try:
            selected_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({'message': 'Invalid date format. Please provide date in YYYY-MM-DD format.'}, status=400)
    else:
        # If no date is provided in the request body, set date to today
        selected_date = date.today()

    try:
        # Extract all members that registered on selected date
        datelist = MemberDates.objects.filter(date=selected_date)
    except MemberDates.DoesNotExist:
        return Response({'message': 'No one has registered for the specified date.'}, status=404)
    
    # Gets the full name and profile picture of the users
    members_present = []
    for member_date in datelist:
        member = member_date.userID
        member_info = {
            'name': f"{member.first_name} {member.last_name}",
            'profile_pic': member.profile_pic.url if member.profile_pic else None
        }
        members_present.append(member_info)
    
    # Returns the members if there are any
    if members_present:
        response_data = {
            'message': f'Member attendance for {selected_date} retrieved successfully.',
            'members_present': members_present
        }
        return Response(response_data, status=200)
    else:
        return Response({'message': 'No members attended on this date.'}, status=200)


@api_view(['GET'])
def get_visit_numbers(request):
    try:
        dates = MemberDates.objects.all().values('date').annotate(visits=Count('userID', distinct=True)).order_by()
    except:
        return Response({'error':'No dates exist'}, status=404)
    
    return Response(dates)

@api_view(['GET'])
def get_visit_by_gender(request):
    try:
        dates = MemberDates.objects.all()
    except:
        return Response({'error':'No dates exist'}, status=404)
    

    response_data = []

    for date in dates:
        male = 0
        female = 0
        non_binary = 0
        pref_not_say = 0

        gender = date.userID.gender

        match gender:
            case 'gutt':
                male += 1
            case 'jente':
                female += 1
            case 'ikke-binær':
                non_binary += 1
            case 'vil ikke si':
                pref_not_say += 1

        gender_data = {
            'date':date.date,
            'gutter':male,
            'jenter':female,
            'ikke-binære':non_binary,
            'vil ikke si':pref_not_say
        }
        response_data.append(gender_data)
    
    return Response(response_data)

@api_view(['GET'])
def get_visit_by_gender_one_day(request, one_date):
    try:
        current_date = MemberDates.objects.filter(date=one_date)
    except:
        return Response({'error':'No dates exist'},status=404)
    
    male = 0
    female = 0
    non_binary = 0
    pref_not_say = 0

    for users in current_date:
        gender = users.userID.gender

        match gender:
            case 'gutt':
                male += 1
            case 'jente':
                female += 1
            case 'ikke-binær':
                non_binary += 1
            case 'vil ikke si':
                pref_not_say += 1

    gender_data = {
        'gutter':male,
        'jenter':female,
        'ikke-binære':non_binary,
        'vil ikke si':pref_not_say
    }
    
    return Response(gender_data)


# adds a new activity  
# @api_view(['POST'])
# @csrf_exempt
# def create_activity(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
        
#         activityid = data['activityID'] 
#         title = data['title']
#         description = data['description']
#         date = data['date'] 
#         image = image['image']

#         new_activity  = Activity(activityID=activityid, title=title, description=description, image=image)
#         new_activity .save()

#         new_activity_date = ActivityDate(activityID=new_activity, date=date)
#         new_activity_date.save()

#         return Response({'message': 'Activity added successfully'})
#     else:
#         return Response({'error': 'Invalid request method'})


# Creates a new activity 
@api_view(['POST'])
def create_activity(request):
    if request.method == 'POST':
        serializer = ActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Activity added successfully'}, status=201)
        return Response(serializer.errors, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=405)


# Gets all activities
@api_view(['GET'])
def get_all_activity(request):
    if request.method == 'GET':
        activities = Activity.objects.all()
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)


# Gets todays activity
@api_view(['GET'])
def get_activity_today(request):
    if request.method == 'GET':
        today = date.today()
        activities = Activity.objects.filter(date=today)
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)


# Delete an activity
@api_view(['DELETE'])
def delete_activity(request, activity_id):
    try:
        activity = Activity.objects.get(activityID=activity_id)
    except Activity.DoesNotExist:
        return Response({'error': 'Activity not found'}, status=404)

    if request.method == 'DELETE':
        activity.delete()
        return Response({'message': 'Activity deleted successfully'}, status=204)


# Get all activities a specific member is signed up to
@api_view(['GET'])
def get_member_activities(request, auth0_id):
    if request.method == 'GET':
        try:
            member = Members.objects.get(auth0ID=auth0_id)
            member_activities = ActivitySignup.objects.filter(userID=member)
            activity_ids = member_activities.values_list('activityID', flat=True)
            activities = Activity.objects.filter(activityID__in=activity_ids)
            serializer = ActivitySerializer(activities, many=True)
            return Response(serializer.data)
        except Members.DoesNotExist:
            return Response({'error': 'Member not found'}, status=404)



# Gets all info about all members
@api_view(['GET'])
def get_all_members_info(request):
    members = Members.objects.all()
    serializer = MembersSerializer(members, many=True)
    return Response(serializer.data)
    

# # Lets a member add additional info about a specific memeber
# @api_view(['PUT'])
# def alter_member_info(request, user_id):
#         try:
#             member = Members.objects.get(userID=user_id)
#         except Members.DoesNotExist:
#              return Response({"error": "Member not found"}, status=404)
        
#         new_info = request.data.get("info")
#         if new_info is None:
#             return Response({"error": "Missing 'info' field in request data"}, status=400)
        
#         member.info = new_info
#         member.save()

#         serializer = MembersSerializer(member)
#         return Response(serializer.data)
        

# Lets an employee adjust the members points total up or down
@api_view(['PUT'])
def adjust_member_points_total(request, auth0_id):
    try:
        member = Members.objects.get(auth0ID=auth0_id)
    except Members.DoesNotExist:
        return Response({"error": "Member not found"}, status=404)
    
    adjusted_points = request.data.get("days_without_incident")
    if adjusted_points is None:
        return Response({"error": "Missing 'days_without_incident' field in request data"}, status=400)

    member.days_without_incident = member.days_without_incident + adjusted_points
    member.save()

    serializer = MembersSerializer(member)
    return Response(serializer.data)


#------------------------------------------------------------------------------------------------------
# Suggestions

# Lets a user create a new suggestion
@api_view(['POST'])
def create_suggestion(request):
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

#------------------------------------------------------------------------------------------------------


# Duplicate Code
#-------------------------------------------------------------------------------------------------------

# Upload member profile picture
@api_view(['PATCH'])
def upload_member_profile_pic(request, auth0_id):
    try:
        member = Members.objects.get(auth0ID=auth0_id)
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
def upload_user_certificate(request, auth0_id):
    try:
        member = Members.objects.get(auth0ID=auth0_id)
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

#-------------------------------------------------------------------------------------------------------
# Levels

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
    
#-------------------------------------------------------------------------------------------------------------------------------

# get messages sent from a specific employee
@api_view(['GET'])
def get_sent_messages(request, sender_id):
    try:
        sent_messages = Message.objects.filter(sender_id=sender_id)
        serializer = MessageSerializer(sent_messages, many=True)
        return Response(serializer.data)
    except Message.DoesNotExist:
        return Response({'error': 'No messages found for the sender'}, status=404)
    

#-------------------------------------------------------------------------------------------------------------------------------
# Handling Polls

# Create a question and corresponding possible answers
@api_view(['POST'])
def create_question_with_answers(request):
    serializer = PollQuestionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Question and answers successfully created.", "data": serializer.data}, status=201)
    return Response({"message": "Could not create question."}, status=400)


# Create the ability for a member to answer a question
@api_view(['POST'])
def submit_user_response(request, auth0_id):
    try:
        member = Members.objects.get(auth0ID=auth0_id)
    except Members.DoesNotExist:
        return Response({"error": "Member not found"}, status=404)

    # Extract question and answer from request data
    question_id = request.data.get('question')
    answer_id = request.data.get('answer')

    # Check if the user has already answered the question
    if MemberAnswer.objects.filter(member=member, question_id=question_id).exists():
        return Response({"error": "User has already answered this question"}, status=400)

    # Create MemberAnswer object
    member_answer = MemberAnswer(member=member, question_id=question_id, answer_id=answer_id)
    member_answer.save()

    # Serialize the data
    serializer = MemberAnswerSerializer(member_answer)

    return Response({"message": "User response submitted successfully.", "data": serializer.data}, status=201)


# Gets all anwesers and correspoinding answer alternatives
@api_view(['GET'])
def get_all_questions_with_answers(request):
    questions = PollQuestion.objects.all()
    serialized_data = []

    for question in questions:
        serialized_question = PollQuestionSerializer(question).data
        answers_data = []
        
        # Loop through answers for the current question
        for answer in question.answers.all():
            answer_data = {
                'answer_id': answer.answerID,
                'answer_text': answer.answer
            }
            answers_data.append(answer_data)
        
        serialized_question['answers'] = answers_data
        serialized_data.append(serialized_question)

    return Response({'questions': serialized_data}, status=200)


# Gets the number of answers for each alternative answer for a specific question
@api_view(['GET'])
def get_answer_counts_for_question(request, question_id):
    try:
        question = PollQuestion.objects.get(questionID=question_id)
    except PollQuestion.DoesNotExist:
        return Response({"error": "Question not found"}, status=404)

    # Retrieve all answers for the given question along with their counts
    answer_counts = {}
    for answer in question.answers.all():
        count = answer.memberanswer_set.count()
        answer_counts[answer.answer] = count

    # Return response with serialized question and answer counts
    return Response({
        "message": "Answer counts retrieved successfully",
        "question": question.question,  # Manually serialize the question
        "answer_counts": answer_counts
    }, status=200)


# Deletes a specific question
@api_view(['DELETE'])
def delete_question(request, question_id):
    try:
        question = PollQuestion.objects.get(questionID=question_id)
    except PollQuestion.DoesNotExist:
        return Response({"error": "Question not found"}, status=404)

    # Delete the question
    question.delete()

    return Response({"message": "Question deleted successfully"}, status=204)

#-------------------------------------------------------------------------------------------------------------------------------

# Checks if the user is fully registered
@api_view(['GET'])
def check_user_registration_status(request):
    if request.method == 'GET':
        sub = request.GET.get('sub')  # Sub passed as a query param (registration_status/?sub=your_sub_value)
        
        if not sub:
            return Response({'error': 'Auth0 ID (sub) not provided'}, status=400)
        
        try:
            # Query the database to get the user by Auth0 ID (sub)
            user = Members.objects.get(auth0ID=sub)
            
            # Check if any required field is null
            if (not user.first_name or not user.last_name or not user.birthdate or
                not user.phone_number or not user.gender):
                return Response({'registered': False}, status=200)
            
            # All required fields are present and age is valid
            return Response({'registered': True}, status=200)
        
        except Members.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
    
    else:
        return Response({'error': 'Method not allowed'}, status=405)
    

@api_view(['POST'])
def send_message(request):
    if request.method == 'POST':
      
        data = request.data
        sender_id = data.get('sender_id')
        recipient_id = data.get('recipient_id')
        subject = data.get('subject')
        body = data.get('body')

        try:
         
            sender = Employee.objects.get(employeeID=sender_id)
            recipient = Members.objects.get(userID=recipient_id)
        except (Employee.DoesNotExist, Members.DoesNotExist):
            return Response({'error': 'Sender or recipient does not exist'}, status=404)

       
        message = Message.objects.create(
            sender=sender,
            recipient=recipient,
            subject=subject,
            body=body
        )

        # Serialize the message data
        serializer = MessageSerializer(message)

        return Response(serializer.data, status=201)
    else:
        return Response({'error': 'Invalid request method'})
    

# Retrieves all unverfieid members
@api_view(['GET'])
def get_all_unverified_members(request):
    unverified_members = Members.objects.filter(verified=False)
    serializer = MembersSerializer(unverified_members, many=True)
    return Response(serializer.data)


# Verifies a member
@api_view(['PUT'])
def verify_member(request, auth0_id):
    try:
        member = Members.objects.get(auth0ID=auth0_id)
    except Members.DoesNotExist:
        return Response({"message": "Member not found"}, status=404)

    if request.method == 'PUT':
        serializer = MembersSerializer(member, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(verified=True)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    

# Get all members with specific info
@api_view(['GET'])
def members_with_info(request):
    members_with_info = Members.objects.exclude(info="")
    serializer = MembersSerializer(members_with_info, many=True)
    return Response(serializer.data)


# Removes specific info from a user
@api_view(['PUT'])
def remove_member_info(request, auth0_id):
    try:
        member = Members.objects.get(auth0ID=auth0_id)
    except Members.DoesNotExist:
        return Response(status=404)

    if request.method == 'PUT':
        serializer = MembersSerializer(member, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.validated_data['info'] = ""
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    

# Add info to a specific user
@api_view(['PUT'])
def add_member_info(request, auth0_id):
    try:
        member = Members.objects.get(auth0ID=auth0_id)
    except Members.DoesNotExist:
        return Response(status=404)

    if request.method == 'PUT':
        serializer = MembersSerializer(member, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    

# Register an employee
@api_view(['POST'])
def register_employee(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        auth0id = data['auth0id']
        employeeName = data['employeeName']

        new_employee = Employee(auth0ID=auth0id, employee_Name=employeeName)  
        new_employee.save()
        return Response({'message': 'Added new employee'})
    else:
        return Response({'error': 'Invalid request method'})
    

# Searches for members by first and or last name
@api_view(['GET'])
def search_member(request):
    # looks for name in params
    if 'name' in request.query_params:
        name = request.query_params['name']
        # Perform case-insensitive search by full name
        users = Members.objects.filter(
            Q(first_name__icontains=name) | Q(last_name__icontains=name)
        )
        serializer = MembersSerializer(users, many=True)
        return Response(serializer.data)
    else:
        return Response({"message": "Please provide a 'name' parameter in the query."}, status=400)
    
