from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Activieties a Member can signup to
class Activity(models.Model):
    activityID = models.AutoField(primary_key=True, unique=True)
    title = models.CharField(max_length=45)
    description = models.CharField(max_length=500)
    image = models.ImageField(upload_to="activity_pics", default="activity_pics/placeholder-image.png" ,blank=True ,null=True) 
    date = models.DateField(null=True)
    limit = models.PositiveIntegerField(null=True, blank=True)
    signed_up_count = models.PositiveIntegerField(default=0)

# The dates of the various activieties
class ActivityDate(models.Model):
    # Foreign Key. Links to an Activity. Deletes if the assosiated Activity is deleted
    activityID = models.ForeignKey(Activity, on_delete=models.CASCADE)
    date = models.DateField()

# Employees
class Employee(models.Model):
    employeeID = models.AutoField(primary_key=True, unique=True)
    auth0ID = models.CharField(max_length=45, null=True)
    employee_Name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, default="employee", null=False)


# Members
class Members(models.Model):
    # Primary key - Autofield is an IntegerField that automatically increments according to available IDs.
    userID = models.AutoField(primary_key=True, unique=True) 

    auth0ID = models.CharField(max_length=45, unique=True)
    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    birthdate = models.DateField()

    profile_pic = models.ImageField(upload_to="profile_pics", default="profile_pics/default_profile_picture.png", null=True, blank=True)
    certificate = models.ImageField(upload_to="certificates", default="certificates/placeholder-image.png" ,null=True, blank=True)

    # Enum for gender possibilities
    GENDER_CHOICES = [
        ("gutt", "Gutt"),
        ("jente", "Jente"),
        ("ikke-binær", "Ikke-binær"),
        ("vil ikke si", "Vil ikke si"),
    ]
    gender = models.CharField(max_length=15, choices=GENDER_CHOICES)

    days_without_incident = models.IntegerField()
    phone_number = models.CharField(max_length=20)

    # EmailField checks that the value is a valid email address using EmailValidator.
    email = models.EmailField(max_length=45, unique=True)
    
    guardian_name = models.CharField(max_length=100, null=True)
    guardian_phone = models.CharField(max_length=20, null=True)
    verified = models.BooleanField(default=False)
    banned = models.BooleanField(default=False)
    banned_from = models.DateField(blank=True, null=True)
    banned_until = models.DateField(blank=True, null=True)
    info = models.CharField(max_length=1000, default="", null=True)
    role = models.CharField(max_length=20, default="member", null=False)


# # This keeps track of all the certificates of a given member
# class MemberCertificate(models.Model):
#     certificateID = models.AutoField(primary_key=True)
#     member = models.ForeignKey(Members, on_delete=models.CASCADE)
#     certificate_image = models.ImageField(upload_to="certificates")


# The dates in which a member has physically attended Fyrverkeriet ungdomshus
class MemberDates(models.Model):
    # Foreign Key. Links to a Member. Deletes if the assosiated Member is deleted
    userID = models.ForeignKey(Members, on_delete=models.CASCADE)
    date = models.DateField()


# Keeps track of which Members took part of the various Activities
class ActivitySignup(models.Model):
    # ForeignKey for the activityID, linking to the Activity model
    activityID = models.ForeignKey(Activity, on_delete=models.CASCADE)

    # ForeignKey for the userID, linking to the Members model
    userID = models.ForeignKey(Members, on_delete=models.CASCADE)


# Lets users send in suggestions
class SuggestionBox(models.Model):
    suggestionID = models.AutoField(primary_key=True, unique=True)
    title = models.CharField(max_length=45, null=True)
    description = models.CharField(max_length=500, null=True) 


# Level of user
class Level(models.Model):
    levelID = models.AutoField(primary_key=True, unique=True)
    name = models.CharField(max_length=45)
    points = models.IntegerField()


class Message(models.Model):
    sender = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(Members, on_delete=models.CASCADE, related_name='received_messages')
    subject = models.CharField(max_length=100)
    body = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)


# Questions for employees to ask a user
class PollQuestion(models.Model):
    questionID = models.AutoField(primary_key=True, unique=True)
    question = models.CharField(max_length=100, null=False)


# Possible anwsers to the PollQuestions
class PollAnswer(models.Model):
    answerID = models.AutoField(primary_key=True, unique=True)
    answer = models.CharField(max_length=100, null=False)
    question = models.ForeignKey(PollQuestion, on_delete=models.CASCADE, related_name='answers')
    

# Answer of a Member
class MemberAnswer(models.Model):
    member = models.ForeignKey(Members, on_delete=models.CASCADE)
    question = models.ForeignKey(PollQuestion, on_delete=models.CASCADE)
    answer = models.ForeignKey(PollAnswer, on_delete=models.CASCADE)
