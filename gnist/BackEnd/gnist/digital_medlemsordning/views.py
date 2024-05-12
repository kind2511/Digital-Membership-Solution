from django.http import HttpResponse
from datetime import date, datetime
from .models import Members
from .models import Employee
from .models import MemberDates
from .models import Activity
from .models import ActivitySignup
from .models import SuggestionBox
from .models import Level
from .models import Message
from .models import MemberAnswer
from .models import PollQuestion
from .models import MemberCertificate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count
import json
from .serializers import MembersSerializer
from .serializers import SuggestionBoxSerializer
from .serializers import LevelSerializer
from .serializers import MessageSerializer
from .serializers import ActivitySerializer
from .serializers import PollQuestionSerializer
from .serializers import MemberAnswerSerializer
from .serializers import MemberAttendanceSerializer
from .serializers import MemberCertificateSerializer
from django.db.models import Q


# Create your views here.

@api_view(['GET'])
def index(request):
    return HttpResponse("Hello, from the root path of digital_medlemsording.")


#signs up for an activity
@api_view(['POST'])
def sign_up_activity(request):
    if request.method == 'POST':
        # Extract data from the request body
        data = json.loads(request.body)
        auth0_id = data.get('auth0_id')
        activity_id = data.get('activity_id')

        try:
            # Retrieve the user and activity objects from the database
            user = Members.objects.get(auth0ID=auth0_id)
            activity = Activity.objects.get(activityID=activity_id)
        except (Members.DoesNotExist, Activity.DoesNotExist):
            # Handle case where user or activity does not exist
            return Response({'error': 'User or Activity does not exist'}, status=404)

        # Check if the user is already signed up for the activity
        if ActivitySignup.objects.filter(userID=user, activityID=activity).exists():
            return Response({'message': 'User already signed up for this activity'}, status=400)

        # Check if there's a limit for the activity and if it's already full
        if activity.limit is not None and activity.signed_up_count >= activity.limit:
            return Response({'error': 'Activity is already full'}, status=400)

        # Increment the sign-up count by one
        activity.signed_up_count += 1
        activity.save()

        # Create a sign-up entry for the user and activity
        signup = ActivitySignup(userID=user, activityID=activity)
        signup.save()

        # Return success response with the signed-up activity details
        return Response({
            'message': 'User signed up for the activity successfully'}, status=201)
    else:
        # Handle invalid request method
        return Response({'error': 'Invalid request method'})
    

# Lets a user unregister or be unregistered for an activity 
@api_view(['POST'])
def undo_sign_up_activity(request):
    if request.method == 'POST':
        # Gets data from body
        data = request.data
        user_id = data.get('user_id')
        auth0_id = data.get('auth0_id')
        activity_id = data.get('activity_id')

        # tryes to find the correct signup. If found, it is deleted
        try:
            # Querying with OR condition for both user_id and auth0_id
            signup = ActivitySignup.objects.get(
                Q(userID__userID=user_id) | Q(userID__auth0ID=auth0_id),
                activityID__activityID=activity_id
            )
            activity = signup.activityID

            # Decrement the sign_up_count by one
            if activity.signed_up_count > 0:
                activity.signed_up_count -= 1
                activity.save()

            signup.delete()
            return Response({'message': 'Sign-up undone successfully'}, status=200)
        except ActivitySignup.DoesNotExist:
            return Response({'error': 'Sign-up record not found'}, status=404)
    else:
        return Response({'error': 'Invalid request method'})


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
    

# Uploads certificates to member
@api_view(['POST'])
def upload_member_certificates(request, auth0_id):
    if request.method == 'POST':
        try:
            # Get the member object based on auth0_id
            member = Members.objects.get(auth0ID=auth0_id)
        except Members.DoesNotExist:
            return Response("Member not found", status=404)

        # Retrieve list of uploaded certificates and names
        member_certificates = request.FILES.getlist('certificate_image')
        certificate_names = request.POST.getlist('certificate_name')

        # Iterate over each uploaded certificate image and corresponding name
        for certificate, name in zip(member_certificates, certificate_names):
            # Create a MemberCertificate object and associate it with the member
            member_certificate = MemberCertificate(member=member, certificate_image=certificate, certificate_name=name)

            # Save the MemberCertificate object
            member_certificate.save()

        return Response("Certificates uploaded successfully", status=200)
    else:
        return Response("Method not allowed", status=405)


@api_view(['GET'])
def get_member_certificates(request, auth0_id):
    if request.method == 'GET':
        try:
            # Retrieve member object based on auth0_id
            member = Members.objects.get(auth0ID=auth0_id)

            # Filter certificates belonging to the member
            certificates = MemberCertificate.objects.filter(member=member)
            serializer = MemberCertificateSerializer(certificates, many=True)
            return Response(serializer.data, status=200)
        except Members.DoesNotExist:
            return Response("Member not found", status=405)
    else:
        return Response("Method not allowed", status=405)


# Deletes a specific certificate for one member
@api_view(['DELETE'])
def delete_member_certificate(request, certificate_id):
    try:
        certificate = MemberCertificate.objects.get(certificateID=certificate_id)
    except MemberCertificate.DoesNotExist:
        return Response("Certificate not found", status=404)

    if request.method == 'DELETE':
        certificate.delete()
        return Response("Certificate deleted successfully", status=204)
    else:
        return Response("Method not allowed", status=405)

#-------------------------------------------------------------------------------------------------------    

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

    
    
#----------------------------------------------------------------------------------------------------------------------------
# TETED VIEWS
#----------------------------------------------------------------------------------------------------------------------------

#----------------------------------------------------------------------------------------------------------------------------
# Activities
#----------------------------------------------------------------------------------------------------------------------------

# Gets all activites that that happens today or in the future
@api_view(['GET'])
def get_future_activities(request):
    if request.method == 'GET':
        today = date.today()
        future_activities = Activity.objects.filter(date__gte=today)
        serializer = ActivitySerializer(future_activities, many=True)
        return Response(serializer.data)


# View that gets all past activities
@api_view(['GET'])
def get_past_activities(request):
    if request.method == 'GET':
        today = date.today()
        past_activities = Activity.objects.filter(date__lt=today)
        serializer = ActivitySerializer(past_activities, many=True)
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

#----------------------------------------------------------------------------------------------------------------------------

# Reomves a member that does not pass the verification process in the employee dashboard
@api_view(['DELETE'])
def delete_member(request, auth0_id):
    # Attempts to find member in databse
    try:
        member = Members.objects.get(auth0ID=auth0_id)
    except Members.DoesNotExist:
        return Response({"message": "Member not found"}, status=404)
    
    # Deletes member
    if request.method == 'DELETE':
        member.delete()
        return Response({'message': 'Member deleted successfully'}, status=204)


# Gets the stats of all attended members based on gender from one date to another
@api_view(['GET'])
def get_member_attendance_stats(request):
    if request.method == 'GET':
        # Get start and end dates from query parameters
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')

        # Convert date strings to datetime objects
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()

        # Query MemberDates model to get counts of different genders
        attendance_counts = MemberDates.objects.filter(date__range=(start_date, end_date)).values('userID__gender').annotate(count=Count('userID__gender'))

        # Calculate combined total attendance
        total_attendance = sum(attendance['count'] for attendance in attendance_counts)

        # Serialize data
        serializer = MemberAttendanceSerializer({
            'total_attendance': total_attendance,
            'attendance_by_gender': {attendance['userID__gender']: attendance['count'] for attendance in attendance_counts}
        })

        return Response(serializer.data)


# Gets all members the attendend on a specific date. If no date is provided todays date is the one used
@api_view(['GET'])
def get_member_attendance(request):
    # Looks for provided date in the request body
    date_str = request.query_params.get('date')

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
        return Response(serializer.data, status=200)
    else:
        return Response({"message": "Please provide a 'name' parameter in the query."}, status=400)
    

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
            # Manually construct response data with desired fields
            response_data = {
                "auth0ID": serializer.data.get('auth0ID'),
                "info": serializer.data.get('info')
            }
            return Response(response_data, status=200)
        return Response(serializer.errors, status=400)
    
    
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
            # Manually construct response data with desired fields
            response_data = {
                "auth0ID": serializer.data.get('auth0ID'),
                "info": serializer.validated_data.get('info')
            }
            return Response(response_data, status=200)
        return Response(serializer.errors, status=400)
    

# Get all members with specific info
@api_view(['GET'])
def members_with_info(request):
    members_with_info = Members.objects.exclude(info="")
    serializer = MembersSerializer(members_with_info, many=True)
    
    # Extracting only auth0ID and info from the serializer data
    response_data = [{"auth0ID": member['auth0ID'], "info": member['info']} for member in serializer.data]

    return Response(response_data, status=200)


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
            return Response({"message": "Member successfully verified"}, status=200)
        return Response({"message": "Verification unsuccessful"}, status=400)
    
    
# Retrieves all unverfieid members
@api_view(['GET'])
def get_all_unverified_members(request):
    unverified_members = Members.objects.filter(verified=False)
    serializer = MembersSerializer(unverified_members, many=True)
    
    # Extracting only the desired fields from the serializer data
    response_data = []
    for member in serializer.data:
        member_data = {
            "auth0ID": member['auth0ID'],
            "birthdate": member['birthdate'],
            "first_name": member['first_name'],
            "last_name": member['last_name'],
            "guardian_name": member['guardian_name'],
            "guardian_phone": member['guardian_phone']
        }
        response_data.append(member_data)

    return Response(response_data, status=200)


# Gets dashboard information about a specific member
@api_view(['GET'])
def get_one_member_data(request, auth0_id):

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

    member_info = {
        'first_name': member.first_name.upper(),
        'level': level_name,
        'profile_pic': member.profile_pic.url,
        'banned_from': member.banned_from,  
        'banned_until': member.banned_until,
    }

    response_data = {
        'member': member_info
    }
    return Response(response_data, status=200)

#-------------------------------------------------------------------------------------------------------
# Levels
#-------------------------------------------------------------------------------------------------------

# Get all user levels
@api_view(['GET'])
def get_all_levels(request):
    if request.method == 'GET':
        levels = Level.objects.all()
        serializer = LevelSerializer(levels, many=True)
        return Response(serializer.data)


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


# Create a user level
@api_view(['POST'])
def create_level(request):
    if request.method == 'POST':
        serializer = LevelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Level successfully created'}, status=201)
        return Response(serializer.errors, status=400)


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

#-------------------------------------------------------------------------------------------------------

#-------------------------------------------------------------------------------------------------------
# Suggestions
#-------------------------------------------------------------------------------------------------------

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
@api_view(['DELETE'])
def delete_suggestion(request, suggestion_id):
    try:
        suggestion = SuggestionBox.objects.get(suggestionID=suggestion_id)
        suggestion.delete()
        return Response({"message": "Suggestion successfully deleted"}, status=204)
    
    except SuggestionBox.DoesNotExist:
        return Response({"error": "Suggestion not found"}, status=404)
    
#-------------------------------------------------------------------------------------------------------

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


# Unbans a memebr
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
            'banned_until': member.banned_until,
            'auth0_id': member.auth0ID,
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

#---------------------------------------------------------------------------------------------------------------------
# Tested views (But not currently used in application)
#---------------------------------------------------------------------------------------------------------------------

# Gets all activities
@api_view(['GET'])
def get_all_activity(request):
    if request.method == 'GET':
        activities = Activity.objects.all()
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)
    

# Get one specific activity
@api_view(['GET'])
def get_activity_details(request, activity_id):
    try:
        activity = Activity.objects.get(activityID=activity_id)
    except Activity.DoesNotExist:
      
        return Response({'error': 'Activity not found'}, status=404)
    
    serializer = ActivitySerializer(activity)
    
    return Response(serializer.data)


# Gets dashboard information about all members
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


#-------------------------------------------------------------------------------------------------------------------------------

#-------------------------------------------------------------------------------------------------------------------------------
# Code not used or tested or used by the application
#-------------------------------------------------------------------------------------------------------------------------------

# send message from employee to member
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
    

# get messages sent from a specific employee
@api_view(['GET'])
def get_sent_messages(request, sender_id):
    try:
        sent_messages = Message.objects.filter(sender_id=sender_id)
        serializer = MessageSerializer(sent_messages, many=True)
        return Response(serializer.data)
    except Message.DoesNotExist:
        return Response({'error': 'No messages found for the sender'}, status=404)
    

