from django.test import TestCase
from datetime import date, timedelta
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Activity
from .serializers import ActivitySerializer

# Create your tests here.

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

