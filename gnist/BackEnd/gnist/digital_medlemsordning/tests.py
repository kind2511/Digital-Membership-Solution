from django.test import Client, TestCase
from datetime import date, timedelta
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Activity
from .models import Members
from .serializers import ActivitySerializer

# Create your tests here.

#---------------------------------------------------------------------------------------------------------------------
# Activites
#---------------------------------------------------------------------------------------------------------------------

class GetFutureActivitiesTestCase(APITestCase):
    def setUp(self):
        # Create test data
        today = date.today()
        Activity.objects.create(title="Activity 1", description="Description 1", date=today)
        Activity.objects.create(title="Activity 2", description="Description 2", date=today)
        Activity.objects.create(title="Future Activity", description="Description 3", date=today + timedelta(days=1))
        Activity.objects.create(title="Past Activity", description="Description 4", date=today - timedelta(days=1))

    def test_get_future_activities(self):
        url = reverse('get_future_activities')
        response = self.client.get(url)
        # Test correct statuscode
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get expected data of only activites with a date of today or in the future
        today = date.today()
        future_activities = Activity.objects.filter(date__gte=today)
        expected_data = ActivitySerializer(future_activities, many=True).data
        
        self.assertEqual(response.data, expected_data)

    def test_get_future_activities_no_data(self):
        # Test when there are no future activities
        url = reverse('get_future_activities')
        Activity.objects.filter(date__gte=date.today()).delete()
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])


class GetPastActivitiesTestCase(APITestCase):
    def setUp(self):
        # Create test data
        today = date.today()
        Activity.objects.create(title="Activity 1", description="Description 1", date=today)
        Activity.objects.create(title="Activity 2", description="Description 2", date=today)
        Activity.objects.create(title="Future Activity", description="Description 3", date=today + timedelta(days=1))
        Activity.objects.create(title="Past Activity", description="Description 4", date=today - timedelta(days=1))

    def test_past_future_activities(self):
        url = reverse('get_past_activities')
        response = self.client.get(url)
        # Test correct status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get expected data of only activites that has already occured
        today = date.today()
        future_activities = Activity.objects.filter(date__lt=today)
        expected_data = ActivitySerializer(future_activities, many=True).data
        
        self.assertEqual(response.data, expected_data)

    def test_get_past_activities_no_data(self):
        # Test when there are no past activities
        url = reverse('get_past_activities')
        Activity.objects.filter(date__lt=date.today()).delete()
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])


class GetTodaysActivitiesTestCase(APITestCase):
    def setUp(self):
        # Create test data
        today = date.today()
        Activity.objects.create(title="Activity 1", description="Description 1", date=today)
        Activity.objects.create(title="Activity 2", description="Description 2", date=today)
        Activity.objects.create(title="Future Activity", description="Description 3", date=today + timedelta(days=1))
        Activity.objects.create(title="Past Activity", description="Description 4", date=today - timedelta(days=1))

    def test_get_todays_activities(self):
        url = reverse('get_activity_today')
        response = self.client.get(url)
        # Test correct status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get expected data of only todays activites
        today = date.today()
        future_activities = Activity.objects.filter(date=today)
        expected_data = ActivitySerializer(future_activities, many=True).data
        
        self.assertEqual(response.data, expected_data)

    def test_get_todays_activities_no_data(self):
        # Test when there are no activities for today
        url = reverse('get_activity_today')
        Activity.objects.filter(date=date.today()).delete()
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])


class GetAllActivitiesTestCase(APITestCase):
    def setUp(self):
        # Create test data for activities
        Activity.objects.create(title="Activity 1", description="Description 1", date=date.today())
        Activity.objects.create(title="Activity 2", description="Description 2", date=date.today())
        Activity.objects.create(title="Future Activity", description="Description 3", date=date.today() + timedelta(days=1))
        Activity.objects.create(title="Past Activity", description="Description 4", date=date.today() - timedelta(days=1))

    def test_get_all_activities(self):
        url = reverse('get_all_activity')
        response = self.client.get(url)
        
        # Check that the status code is 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get expected data for all activities
        all_activities = Activity.objects.all()
        expected_data = ActivitySerializer(all_activities, many=True).data
        
        # Check that the response data matches the expected data
        self.assertEqual(response.data, expected_data)
        
    def test_get_all_activities_no_activities(self):
        # Clear all activities
        Activity.objects.all().delete()
        
        url = reverse('get_all_activity')
        response = self.client.get(url)
        
        # Check that the status code is 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that the response data is an empty list
        self.assertEqual(response.data, [])


class DeleteActivityTestCase(APITestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            activityID=1,
            title='Test Activity',
            description='Test description',
            image='test_image.jpg',
            date='2024-05-10',
            limit=10,
            signed_up_count=0
        )
        self.url = reverse('delete_activity', kwargs={'activity_id': self.activity.activityID})

    def test_delete_activity_success(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Check if the activity is deleted from the database
        self.assertFalse(Activity.objects.filter(activityID=self.activity.activityID).exists())

    def test_delete_activity_not_found(self):
        non_existent_url = reverse('delete_activity', kwargs={'activity_id': 999})
        response = self.client.delete(non_existent_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Activity not found')


class DeleteMemberTestCase(APITestCase):
    def setUp(self):
        self.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            days_without_incident=0,
            phone_number='123456789',
            email='john.doe@example.com',
            role='member'
        )
        self.url = reverse('delete_member', kwargs={'auth0_id': self.member.auth0ID})

    def test_delete_member_success(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Check if the member is deleted from the database
        self.assertFalse(Members.objects.filter(auth0ID=self.member.auth0ID).exists())

    def test_delete_member_not_found(self):
        non_existent_url = reverse('delete_member', kwargs={'auth0_id': 'non_existent_id'})
        response = self.client.delete(non_existent_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['message'], 'Member not found')

