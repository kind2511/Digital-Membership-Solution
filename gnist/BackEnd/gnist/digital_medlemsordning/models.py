from django.db import models

# Create your models here.

# Activieties a Member can signup to
class Activity(models.Model):
    activityID = models.AutoField(primary_key=True, unique=True)
    title = models.CharField(max_length=45)
    description = models.CharField(max_length=500) 


# The dates of the various activieties
class ActivityDate(models.Model):
    # Foreign Key. Links to an Activity. Deletes if the assosiated Activity is deleted
    activityID = models.ForeignKey(Activity, on_delete=models.CASCADE)
    date = models.DateField()


# Employees
class Employee(models.Model):
    employeeID = models.AutoField(primary_key=True, unique=True)
    employee_Name = models.CharField(max_length=100)


# Members
class Members(models.Model):
    # Primary key - Autofield is an IntegerField that automatically increments according to available IDs.
    userID = models.AutoField(primary_key=True, unique=True) 

    auth0ID = models.CharField(max_length=45, unique=True)
    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    birthdate = models.DateField()

    profile_pic = models.ImageField(upload_to="digital_medlemsordning/files/profile_pics", default="digital_medlemsordning/files/profile_pics/default_profile_picture.png", null=True)

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
    banned_until = models.DateField(null=True)
    info = models.CharField(max_length=1000, default="")

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

