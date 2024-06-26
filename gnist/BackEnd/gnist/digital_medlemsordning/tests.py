from datetime import date, timedelta, datetime, timezone
import json
from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Activity, ActivitySignup, MemberAnswer, MemberCertificate, PollAnswer, PollQuestion
from .models import Members
from .models import MemberDates
from .models import Level
from .models import SuggestionBox
from .serializers import SuggestionBoxSerializer
from .serializers import ActivitySerializer
from .serializers import MembersSerializer

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

class GetSpecificActivityDetailsTests(APITestCase):
    def setUp(self):
        # Create a sample activity for testing
        self.activity = Activity.objects.create(title="Test Activity", description="Test Description", date="2024-05-09")
    
    def test_get_existing_activity_details(self):
        """
        Test retrieving details of an existing activity.
        """
        url = reverse('get_activity_details', kwargs={'activity_id': self.activity.activityID})
        response = self.client.get(url)
        
        # Assert status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert activity details
        self.assertEqual(response.data['title'], self.activity.title)
        self.assertEqual(response.data['description'], self.activity.description)
        self.assertEqual(response.data['date'], self.activity.date)
        
    
    def test_get_non_existing_activity_details(self):
        """
        Test retrieving details of a non-existing activity.
        """
        # Generate a non-existing activity ID
        non_existing_activity_id = self.activity.activityID + 1
        
        url = reverse('get_activity_details', kwargs={'activity_id': non_existing_activity_id})
        response = self.client.get(url)
        
        # Assert status code
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Assert error message
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Activity not found')

class CreateActivityAPITestCase(APITestCase):
    def test_create_activity_success(self):
        """
        Test creating a new activity successfully
        """
        url = reverse('create_activity')
        data = {
            'title': 'Test Activity',
            'description': 'This is a test activity.',
            'date': '2024-05-20',
            'limit': 50,
        }
        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {'message': 'Activity created successfully'})
        self.assertTrue(Activity.objects.filter(title='Test Activity').exists())

    def test_create_activity_without_limit_success(self):
        """
        Test creating a new activity without limit successfully 
        """
        url = reverse('create_activity')
        data = {
            'title': 'Test Activity',
            'description': 'This is a test activity.',
            'date': '2024-05-20',
        }
        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {'message': 'Activity created successfully'})
        self.assertTrue(Activity.objects.filter(title='Test Activity').exists())


#---------------------------------------------------------------------------------------------------------------------

#---------------------------------------------------------------------------------------------------------------------
# Member Attendence
#---------------------------------------------------------------------------------------------------------------------

class GetMemberAttendanceStatsTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Create test Members
        cls.member1 = Members.objects.create(
            auth0ID='test_auth0_id_1',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=0,
            phone_number='123456789',
            email='john.doe@example.com',
            role='member'
        )
        cls.member2 = Members.objects.create(
            auth0ID='test_auth0_id_2',
            first_name='Jane',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='jente',
            points=0,
            phone_number='123456789',
            email='jane.doe@example.com',
            role='member'
            )

        # Create test MemberDates
        MemberDates.objects.create(
            userID=cls.member1,
            date='2024-05-10'
        )
        MemberDates.objects.create(
            userID=cls.member2,
            date='2024-05-10'
        )

    def test_get_member_attendance_stats_success(self):
        url = reverse('member_attendance_stats')
        start_date = '2024-05-01'
        end_date = '2024-05-31'

        response = self.client.get(url, {'start_date': start_date, 'end_date': end_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIn('total_attendance', response.data)
        self.assertIn('attendance_by_gender', response.data)

    def test_get_member_attendance_stats_no_data(self):
        # Test when there is no data in the specified date range
        url = reverse('member_attendance_stats')
        start_date = '2024-06-01'
        end_date = '2024-06-30'

        response = self.client.get(url, {'start_date': start_date, 'end_date': end_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_attendance'], 0)
        self.assertEqual(response.data['attendance_by_gender'], {})

    def test_get_member_attendance_stats_one_date_only(self):
        # Test when attendance data for one day only
        url = reverse('member_attendance_stats')
        start_date = '2024-05-01'
        end_date = '2024-05-01'

        response = self.client.get(url, {'start_date': start_date, 'end_date': end_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIn('total_attendance', response.data)
        self.assertIn('attendance_by_gender', response.data)


class GetMemberAttendanceTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Create test Members
        cls.member1 = Members.objects.create(
            auth0ID='test_auth0_id_1',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=0,
            phone_number='123456789',
            email='john.doe@example.com',
            role='member'
        )
        cls.member2 = Members.objects.create(
            auth0ID='test_auth0_id_2',
                first_name='Jane',
            last_name='Doe',
                birthdate='1990-01-01',
            gender='jente',
                points=0,
            phone_number='123456789',
                email='jane.doe@example.com',
            role='member'
            )

        # Create test MemberDates
        cls.member_date1 = MemberDates.objects.create(
            userID=cls.member1,
            date=date.today()  # Today's date
        )
        cls.member_date2 = MemberDates.objects.create(
            userID=cls.member2,
            date='2024-05-10'  # Specific date
        )

    def test_get_member_attendance_success(self):
        # Test successful retrieval of member attendance for today's date
        url = reverse('get_member_attendance')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIn('message', response.data)
        self.assertIn('members_present', response.data)
        self.assertIsInstance(response.data['members_present'], list)

    def test_get_member_attendance_specific_date(self):
        # Test retrieval of member attendance for a specific date
        url = reverse('get_member_attendance')
        specific_date = '2024-05-10'

        response = self.client.get(url, {'date': specific_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIn('message', response.data)
        self.assertIn('members_present', response.data)
        self.assertIsInstance(response.data['members_present'], list)

    def test_get_member_attendance_no_attendance(self):
        # Test when no members attended on the specified date
        url = reverse('get_member_attendance')
        specific_date = '2024-01-01'  # Date with no attendance

        response = self.client.get(url, {'date': specific_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'No members attended on this date.')

#---------------------------------------------------------------------------------------------------------------------

class SearchMemberTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Create test Members
        cls.member1 = Members.objects.create(
            auth0ID='test_auth0_id_1',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=0,
            phone_number='123456789',
            email='john.doe@example.com',
            role='member'
        )
        cls.member2 = Members.objects.create(
            auth0ID='test_auth0_id_2',
            first_name='Jane',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='jente',
            points=0,
            phone_number='123456789',
            email='jane.doe@example.com',
            role='member'
        )

    def test_search_member_success(self):
        # Test successful search for members by name
        url = reverse('search_member')
        name = 'John'  # Searching for members with first name 'John'

        response = self.client.get(url, {'name': name})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIsInstance(response.data, list)

    def test_search_member_case_insensitive(self):
        # Test case-insensitive search for members by name
        url = reverse('search_member')
        name = 'doe'  # Searching for members with last name 'Doe' (case-insensitive)

        response = self.client.get(url, {'name': name})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIsInstance(response.data, list)

    def test_search_member_no_name_param(self):
        # Test when 'name' parameter is not provided in the query
        url = reverse('search_member')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Verify the structure of the response
        self.assertIn('message', response.data)


class DeleteMemberTestCase(APITestCase):
    def setUp(self):
        self.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=0,
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

class UnbanMemberTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a test member
        cls.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=0,
            phone_number='123456789',
            email='john.doe@example.com',
            role='member',
            banned=True,
            banned_from='2025-01-01',
            banned_until='2025-12-31'
        )

    def test_unban_member_success(self):
        # Test successful unbanning of a member
        url = reverse('unban_member', kwargs={'auth0_id': self.member.auth0ID})

        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Member unbanned successfully')

        # Fetch the member from the database to ensure it has been unbanned
        updated_member = Members.objects.get(auth0ID=self.member.auth0ID)
        self.assertFalse(updated_member.banned)
        self.assertIsNone(updated_member.banned_from)
        self.assertIsNone(updated_member.banned_until)

    def test_unban_member_not_found(self):
        # Test when member with provided auth0 ID is not found
        url = reverse('unban_member', kwargs={'auth0_id': 'non_existing_auth0_id'})

        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Verify the structure of the response
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Member not found')

class AddMemberInfoTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a test member
        cls.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=0,
            phone_number='123456789',
            email='john.doe@example.com',
            role='member'
        )

    def test_add_member_info_success(self):
        # Test successful addition of info to a member
        url = reverse('add_member_info', kwargs={'auth0_id': self.member.auth0ID})
        data = {
            'info': 'Updated information about the member'
        }

        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIn('info', response.data)
        self.assertEqual(response.data['info'], 'Updated information about the member')

        # Fetch the member from the database to ensure info has been updated
        updated_member = Members.objects.get(auth0ID=self.member.auth0ID)
        self.assertEqual(updated_member.info, 'Updated information about the member')

    def test_add_member_info_not_found(self):
        # Test when member with provided auth0 ID is not found
        url = reverse('add_member_info', kwargs={'auth0_id': 'non_existing_auth0_id'})
        data = {
            'info': 'Updated information about the member'
        }

        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Verify the response is empty
        self.assertIsNone(response.data)

class RemoveMemberInfoTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a test member
        cls.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=0,
            phone_number='123456789',
            email='john.doe@example.com',
            role='member',
            info='Some information about the member'
        )

    def test_remove_member_info_success(self):
        # Test successful removal of info from a member
        url = reverse('remove_member_info', kwargs={'auth0_id': self.member.auth0ID})

        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIn('info', response.data)
        self.assertEqual(response.data['info'], '')  # Info should be removed

        # Fetch the member from the database to ensure info has been removed
        updated_member = Members.objects.get(auth0ID=self.member.auth0ID)
        self.assertEqual(updated_member.info, '')  # Info should be removed

    def test_remove_member_info_not_found(self):
        # Test when member with provided auth0 ID is not found
        url = reverse('remove_member_info', kwargs={'auth0_id': 'non_existing_auth0_id'})

        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Verify the response is empty
        self.assertIsNone(response.data)

    def test_remove_member_info_already_empty_info(self):
        # Test when the member already has an empty 'info' field
        empty_info_member = Members.objects.create(
        auth0ID='empty_info_auth0_id',
        first_name='Jane',
        last_name='Doe',
        birthdate='1990-01-01',
        gender='jente',
        points=0,
        phone_number='987654321',
        email='jane.doe@example.com',
        role='member',
        info=''  # Empty 'info' field
        )

        url = reverse('remove_member_info', kwargs={'auth0_id': empty_info_member.auth0ID})

        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIn('info', response.data)
        self.assertEqual(response.data['info'], '')  # Info should remain empty

        # Fetch the member from the database to ensure 'info' remains empty
        updated_member = Members.objects.get(auth0ID=empty_info_member.auth0ID)
        self.assertEqual(updated_member.info, '')  # Info should remain empty

class MembersWithInfoTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Create test members with and without info
        cls.member_with_info = Members.objects.create(
            auth0ID='test_auth0_id_with_info',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=0,
            phone_number='123456789',
            email='john.doe@example.com',
            role='member',
            info='Some information about the member'
        )
        cls.member_without_info = Members.objects.create(
            auth0ID='test_auth0_id_without_info',
            first_name='Jane',
            last_name='Doe',
            birthdate='1995-05-15',
            gender='jente',
            points=0,
            phone_number='5551234567',
            email='jane.doe@example.com',
            role='member'
        )

    def test_members_with_info(self):
        # Test retrieving members with info
        url = reverse('get_members_with_info')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)  # Only one member should have info
        self.assertEqual(response.data[0]['auth0ID'], self.member_with_info.auth0ID)

    def test_members_with_info_no_members(self):
        # Test when there are no members with info
        # Remove the member with info
        self.member_with_info.delete()

        url = reverse('get_members_with_info')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 0)  # No members should be returned

class VerifyMemberTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a test member
        cls.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=0,
            phone_number='123456789',
            email='john.doe@example.com',
            role='member',
            verified=False  # Member initially not verified
        )

    def test_verify_member_success(self):
        # Test successful verification of a member
        url = reverse('verify_member', kwargs={'auth0_id': self.member.auth0ID})

        response = self.client.put(url, data={'verified': True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Member successfully verified')  # Check the success message

        # Verify that 'verified' field is not present in the response
        self.assertNotIn('verified', response.data)

        # Fetch the member from the database to ensure verification status has been updated
        updated_member = Members.objects.get(auth0ID=self.member.auth0ID)
        self.assertTrue(updated_member.verified)  # Member should be verified

    def test_verify_member_not_found(self):
        # Test when member with provided auth0 ID is not found
        url = reverse('verify_member', kwargs={'auth0_id': 'non_existing_auth0_id'})

        response = self.client.put(url, data={'verified': True})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Verify the response message
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Member not found')  # Check the not found message

        # Ensure other fields are not present
        self.assertNotIn('verified', response.data)


class GetAllUnverifiedMembersTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Create test members with and without verification
        cls.verified_member = Members.objects.create(
            auth0ID='verified_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=0,
            phone_number='123456789',
            email='john.doe@example.com',
            role='member',
            verified=True  # Member initially verified
        )
        cls.unverified_member = Members.objects.create(
            auth0ID='unverified_auth0_id',
            first_name='Jane',
            last_name='Doe',
            birthdate='1995-05-15',
            gender='jente',
            points=0,
            phone_number='5551234567',
            email='jane.doe@example.com',
            role='member',
            verified=False  # Member initially not verified
        )

    def test_get_all_unverified_members(self):
        # Test retrieving all unverified members
        url = reverse('get_all_unverified_members')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)  # Only one member should be unverified
        self.assertEqual(response.data[0]['auth0ID'], self.unverified_member.auth0ID)

    def test_get_all_unverified_members_no_unverified_members(self):
        # Test when there are no unverified members
        # Update the unverified member to be verified
        self.unverified_member.verified = True
        self.unverified_member.save()

        url = reverse('get_all_unverified_members')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 0)  # No unverified members should be returned

    def test_get_all_unverified_members_multiple_unverified_members(self):
        # Test when there are multiple unverified members
        another_unverified_member = Members.objects.create(
        auth0ID='another_unverified_auth0_id',
        first_name='Alice',
         last_name='Smith',
        birthdate='1990-01-01',
        gender='jente',
        points=0,
        phone_number='987654321',
        email='alice.smith@example.com',
        role='member',
        verified=False
        )

        url = reverse('get_all_unverified_members')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 2)  # Both unverified members should be returned
        # Ensure both member IDs are present in the response
        self.assertIn(self.unverified_member.auth0ID, [member['auth0ID'] for member in response.data])
        self.assertIn(another_unverified_member.auth0ID, [member['auth0ID'] for member in response.data])

class GetAllLevelsTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Create test levels
        cls.level1 = Level.objects.create(levelID=1, name='Bronze', points=100)
        cls.level2 = Level.objects.create(levelID=2, name='Silver', points=200)
        cls.level3 = Level.objects.create(levelID=3, name='Gold', points=300)

    def test_get_all_levels(self):
        # Test retrieving all user levels
        url = reverse('get_all_levels')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 3)  # All three levels should be returned

        # Verify the content of each level
        self.assertEqual(response.data[0]['levelID'], self.level1.levelID)
        self.assertEqual(response.data[0]['name'], self.level1.name)
        self.assertEqual(response.data[0]['points'], self.level1.points)

        self.assertEqual(response.data[1]['levelID'], self.level2.levelID)
        self.assertEqual(response.data[1]['name'], self.level2.name)
        self.assertEqual(response.data[1]['points'], self.level2.points)

        self.assertEqual(response.data[2]['levelID'], self.level3.levelID)
        self.assertEqual(response.data[2]['name'], self.level3.name)
        self.assertEqual(response.data[2]['points'], self.level3.points)

    def test_get_all_levels_empty(self):
        # Test when there are no levels in the database
        Level.objects.all().delete()  # Delete all levels

        url = reverse('get_all_levels')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the response is an empty list
        self.assertEqual(response.data, [])

class DeleteLevelTestCase(APITestCase):
    def setUp(self):
        # Create a test level for each test method
        self.level = Level.objects.create(levelID=1, name='Bronze', points=100)

    def test_delete_level_success(self):
        # Test deleting an existing level
        url = reverse('delete_level', kwargs={'level_id': self.level.levelID})

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

     # Verify the level is deleted from the database
        with self.assertRaises(Level.DoesNotExist):
            Level.objects.get(levelID=self.level.levelID)

        # Verify the response message
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Level deleted successfully')

    def test_delete_level_not_found(self):
        # Test deleting a non-existent level
        url = reverse('delete_level', kwargs={'level_id': 999})

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Verify the response message
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Level not found')

class CreateLevelTestCase(APITestCase):
    def test_create_level_success(self):
        # Test creating a level with valid data
        url = reverse('create_level')
        valid_payload = {'levelID': 1, 'name': 'Gold', 'points': 300}

        response = self.client.post(url, valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify the level is created in the database
        created_level = Level.objects.get(levelID=1)
        self.assertEqual(created_level.name, valid_payload['name'])
        self.assertEqual(created_level.points, valid_payload['points'])

        # Verify the response message
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Level successfully created')

    def test_create_level_invalid_data(self):
        # Test creating a level with invalid data
        url = reverse('create_level')
        invalid_payload = {'levelID': 1, 'name': 'Invalid Level', 'points': 'invalid'}

        response = self.client.post(url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Verify the response contains validation errors
        self.assertIn('points', response.data)
        self.assertEqual(response.data['points'][0], 'A valid integer is required.')

class EditLevelTestCase(APITestCase):
    def setUp(self):
        # Create a test level for each test method
        self.level = Level.objects.create(levelID=1, name='Bronze', points=100)

    def test_edit_level_success(self):
        # Test updating an existing level with valid data
        url = reverse('edit_level', kwargs={'level_id': self.level.levelID})
        valid_payload = {'name': 'Gold', 'points': 200}

        response = self.client.put(url, valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the level is updated in the database
        updated_level = Level.objects.get(levelID=self.level.levelID)
        self.assertEqual(updated_level.name, valid_payload['name'])
        self.assertEqual(updated_level.points, valid_payload['points'])

        # Verify the response message
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Level updated successfully')

    def test_edit_level_not_found(self):
        # Test updating a non-existent level
        url = reverse('edit_level', kwargs={'level_id': 999})
        invalid_payload = {'name': 'Gold', 'points': 200}

        response = self.client.put(url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Verify the response message
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Level not found')

    def test_edit_level_invalid_data(self):
        # Test updating a level with invalid data
        url = reverse('edit_level', kwargs={'level_id': self.level.levelID})
        invalid_payload = {'points': 'invalid'}

        response = self.client.put(url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Verify the response contains validation errors
        self.assertIn('points', response.data)
        self.assertEqual(response.data['points'][0], 'A valid integer is required.')

class SuggestionBoxCreateSuggestion(APITestCase):
    def test_create_valid_suggestion(self):
        #Test creating a valid suggestion.
        url = reverse('create_suggestion')  # Assuming you have configured your URL patterns
        data = {'title': 'Test Suggestion', 'description': 'This is a test suggestion.'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SuggestionBox.objects.count(), 1)
        
        # Check that the suggestionID is assigned automatically
        suggestion_id = response.data.get('suggestionID')
        self.assertIsNotNone(suggestion_id)
        self.assertEqual(SuggestionBox.objects.get().suggestionID, suggestion_id)

    def test_create_invalid_suggestion(self):
        #Test creating an invalid suggestion.
        url = reverse('create_suggestion')  # Assuming you have configured your URL patterns
        data = {'title': '', 'description': ''}  # Invalid data
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)  # Assuming the title field error message is returned
        
        # Check that no suggestion was created
        self.assertEqual(SuggestionBox.objects.count(), 0)

class SuggestionBoxGetSuggestionsTests(APITestCase):
    def setUp(self):
        # Create some sample suggestions for testing
        self.suggestion1 = SuggestionBox.objects.create(title="Suggestion 1", description="Description 1")
        self.suggestion2 = SuggestionBox.objects.create(title="Suggestion 2", description="Description 2")
    
    def test_get_all_suggestions(self):
        """
        Test retrieving all suggestions.
        """
        url = reverse('get_all_suggestions')  # Assuming you have configured your URL patterns
        response = self.client.get(url)
        
        # Assert status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert correct number of suggestions returned
        suggestions_count = SuggestionBox.objects.count()
        self.assertEqual(len(response.data), suggestions_count)
        
        # Assert that all suggestions are returned
        expected_data = SuggestionBoxSerializer(SuggestionBox.objects.all(), many=True).data
        self.assertEqual(response.data, expected_data)
        
    def test_get_all_suggestions_empty(self):
        """
        Test retrieving all suggestions when no suggestions exist.
        """
        # Delete all existing suggestions
        SuggestionBox.objects.all().delete()
        
        url = reverse('get_all_suggestions')  # Assuming you have configured your URL patterns
        response = self.client.get(url)
        
        # Assert status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert that no suggestions are returned
        self.assertEqual(len(response.data), 0)
        
class SuggestionBoxDeleteSuggestionsTests(APITestCase):
    def setUp(self):
        # Create a sample suggestion for testing
        self.suggestion = SuggestionBox.objects.create(title="Test Suggestion", description="Test Description")
    
    def test_delete_existing_suggestion(self):
        """
        Test deleting an existing suggestion.
        """
        url = reverse('delete_suggestion', kwargs={'suggestion_id': self.suggestion.suggestionID})
        response = self.client.delete(url)
        
        # Assert status code
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Assert success message
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Suggestion successfully deleted')
        
        # Assert that the suggestion is deleted
        with self.assertRaises(SuggestionBox.DoesNotExist):
            SuggestionBox.objects.get(suggestionID=self.suggestion.suggestionID)
    
    def test_delete_non_existing_suggestion(self):
        """
        Test deleting a non-existing suggestion.
        """
        # Generate a non-existing suggestion ID
        non_existing_suggestion_id = self.suggestion.suggestionID + 1
        
        url = reverse('delete_suggestion', kwargs={'suggestion_id': non_existing_suggestion_id})
        response = self.client.delete(url)
        
        # Assert status code
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Assert error message
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Suggestion not found')

class BanMemberTests(APITestCase):
    def setUp(self):
        # Create a sample member for testing
        self.member = Members.objects.create(
            auth0ID="test_auth0_id",
            first_name="Test",
            last_name="Member",
            birthdate=datetime.strptime("2000-01-01", "%Y-%m-%d").date(),
            gender="gutt",
            points=0,
            phone_number="1234567890",
            email="test@example.com"
        )
    
    def test_ban_existing_member(self):
        """
        Test banning an existing member.
        """
        url = reverse('ban_member', kwargs={'auth0_id': self.member.auth0ID})
        data = {
            'banned_from': '2024-05-10',
            'banned_until': '2024-05-20'
        }
        response = self.client.put(url, data, format='json')
        
        # Assert status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert ban details
        self.assertTrue(Members.objects.get(auth0ID=self.member.auth0ID).banned)
        self.assertEqual(str(Members.objects.get(auth0ID=self.member.auth0ID).banned_from), '2024-05-10')
        self.assertEqual(str(Members.objects.get(auth0ID=self.member.auth0ID).banned_until), '2024-05-20')
        
        # Assert success message
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], f'Member banned successfully from 2024-05-10 until 2024-05-20')
    
    def test_ban_non_existing_member(self):
        """
        Test banning a non-existing member.
        """
        # Generate a non-existing Auth0 ID
        non_existing_auth0_id = "non_existing_auth0_id"
        
        url = reverse('ban_member', kwargs={'auth0_id': non_existing_auth0_id})
        data = {
            'banned_from': '2024-05-10',
            'banned_until': '2024-05-20'
        }
        response = self.client.put(url, data, format='json')
        
        # Assert status code
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Assert error message
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Member not found')

    def test_ban_member_invalid_date_format(self):
        """
        Test banning a member with an invalid date format.
        """
        url = reverse('ban_member', kwargs={'auth0_id': self.member.auth0ID})
        data = {
            'banned_from': '2024/05/10',  # Invalid date format
            'banned_until': '2024-05-20'
        }
        response = self.client.put(url, data, format='json')
        
        # Assert status code
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Assert error message
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Invalid date format')

class GetBannedMemberTests(APITestCase):
    def setUp(self):
        # Create sample banned and non-banned members for testing
        self.banned_member = Members.objects.create(
            auth0ID="banned_auth0_id",
            first_name="Banned",
            last_name="Member",
            birthdate=datetime.strptime("2000-01-01", "%Y-%m-%d").date(),
            gender="gutt",
            points=0,
            phone_number="1234567890",
            email="banned@example.com",
            banned=True,
            banned_from=datetime.strptime("2024-05-10", "%Y-%m-%d").date(),
            banned_until=datetime.strptime("2024-05-20", "%Y-%m-%d").date()
        )
        self.non_banned_member = Members.objects.create(
            auth0ID="non_banned_auth0_id",
            first_name="Non",
            last_name="Banned",
            birthdate=datetime.strptime("2000-01-01", "%Y-%m-%d").date(),
            gender="gutt",
            points=0,
            phone_number="1234567890",
            email="nonbanned@example.com",
            banned=False
        )
    
    def test_get_banned_members(self):
        """
        Test retrieving all banned members.
        """
        url = reverse('get_banned_members')
        response = self.client.get(url)
        
        # Assert status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert message
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], "Banned members retrieved successfully.")
        
        # Assert banned members data
        self.assertIn('banned_members', response.data)
        self.assertTrue(len(response.data['banned_members']) > 0)
        banned_member_data = response.data['banned_members'][0]
        self.assertEqual(banned_member_data['full_name'], "Banned Member")
        self.assertEqual(str(banned_member_data['banned_from']), '2024-05-10')
        self.assertEqual(str(banned_member_data['banned_until']), '2024-05-20')
        self.assertEqual(banned_member_data['auth0_id'], "banned_auth0_id")
    
    def test_get_banned_members_no_banned_members(self):
        """
        Test retrieving banned members when there are no banned members.
        """
        # Unban the member to simulate no banned members
        self.banned_member.banned = False
        self.banned_member.save()
        
        url = reverse('get_banned_members')
        response = self.client.get(url)
        
        # Assert status code
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Assert message
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], "No banned members found.")


class MemberDashboardDataTests(APITestCase):
    def setUp(self):
        # Create some sample data for testing
        self.member = Members.objects.create(
            auth0ID="test_auth0_id",
            first_name="Test",
            last_name="User",
            birthdate="2000-01-01",
            gender="gutt",
            points=10,
            phone_number="123456789",
            email="test@example.com",
            role="member"
        )
        self.level = Level.objects.create(
            name="Test Level",
            points=5
        )

    def test_get_one_member_data(self):
        url = reverse('get_member', args=(self.member.auth0ID,))
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['member']['first_name'], "TEST")  
        self.assertEqual(response.data['member']['profile_pic'], "/media/profile_pics/default_profile_picture.png")  
        
        self.assertEqual(response.data['member']['banned_from'], None)
        self.assertEqual(response.data['member']['banned_until'], None)

    def test_get_one_member_data_nonexistent_member(self):
        url = reverse('get_member', args=("nonexistent_auth0_id",))
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], "User does not exist")

class GetAllMemberDashboardDataTests(APITestCase):
    def setUp(self):
        # Create sample members and levels for testing
        self.member1 = Members.objects.create(
            auth0ID="test_auth0_id_1",
            first_name="Test1",
            last_name="Member1",
            birthdate=datetime.strptime("2000-01-01", "%Y-%m-%d").date(),
            gender="gutt",
            points=5,
            phone_number="1234567890",
            email="test1@example.com",
            role="member",
            banned=False
        )
        self.member2 = Members.objects.create(
            auth0ID="test_auth0_id_2",
            first_name="Test2",
            last_name="Member2",
            birthdate=datetime.strptime("2000-01-01", "%Y-%m-%d").date(),
            gender="gutt",
            points=15,
            phone_number="1234567890",
            email="test2@example.com",
            role="member",
            banned=True,
            banned_from=datetime.strptime("2024-05-10", "%Y-%m-%d").date(),
            banned_until=datetime.strptime("2024-05-20", "%Y-%m-%d").date()
        )
        Level.objects.create(name="Level 1", points=10)
        Level.objects.create(name="Level 2", points=20)
    
    def test_get_all_member_data_success(self):
        """
        Test retrieving data of all members successfully.
        """
        url = reverse('get_all_members')
        response = self.client.get(url)
        
        # Assert status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert data
        self.assertIn('date', response.data)
        self.assertIn('members', response.data)
        members_data = response.data['members']
        self.assertEqual(len(members_data), 2)  # Two members created in setup
        # Add more assertions if needed
    
    def test_get_all_member_data_no_members(self):
        """
        Test retrieving data when there are no members.
        """
        # Delete all members
        Members.objects.all().delete()
        
        url = reverse('get_all_members')
        response = self.client.get(url)
        
        # Assert status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert data
        self.assertIn('date', response.data)
        self.assertIn('members', response.data)
        members_data = response.data['members']
        self.assertEqual(len(members_data), 0)  # No members

class RegisterUserAPITestCase(APITestCase):
    def setUp(self):
        self.valid_data = {
            "auth0id": "example_auth0_id",
            "first_name": "John",
            "last_name": "Doe",
            "birthdate": "1990-01-01",
            "gender": "male",
            "phone_number": "1234567890",
            "email": "john@example.com"
        }

    def test_register_user_success(self):
        """
        Test succesfully adding a new member
        """
        url = reverse('register_user')
        response = self.client.post(url, data=json.dumps(self.valid_data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'Added new user')

    def test_invalid_data(self):
        """
        Test where invalid data is sent in the request
        """
        invalid_data = self.valid_data.copy()
        # Remove a required field to make the data invalid
        del invalid_data["first_name"]
    
        url = reverse('register_user')
        response = self.client.post(url, data=json.dumps(invalid_data), content_type='application/json')
    
        # Verify that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Verify that the response contains the expected error message
        self.assertIn('Missing required field', response.data['error'])

    def test_invalid_request_method(self):
        """
        Test where use of wrong HTTP request method
        """
        # Attempt to send a GET request to the register_user endpoint
        url = reverse('register_user')
        response = self.client.get(url)
        
        # Verify that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

class AddDayAPITestCase(APITestCase):
    def setUp(self):
        self.valid_data = {
            "auth0ID": "test_auth0_id",
            "first_name": "John",
            "last_name": "Doe",
            "birthdate": "1990-01-01",
            "gender": "gutt",
            "phone_number": "1234567890",
            "email": "john@example.com",
            "points": 1,
            "role": "member"
        }

        self.member = Members.objects.create(**self.valid_data)
        self.today = datetime.today().date()

    def test_add_day_success(self):
        """
        Test of success case
        """
        url = reverse('add_day', kwargs={'auth0_id': 'test_auth0_id'})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Successfully registred members attendence')
        self.member.refresh_from_db()
        self.assertTrue(MemberDates.objects.filter(date=self.today, userID=self.member).exists())

    def test_add_day_non_existing_member(self):
        """
        Test where user does not exist
        """
        url = reverse('add_day', kwargs={'auth0_id': 'non_existing_auth0_id'})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'User does not exist')

    def test_add_day_already_registered(self):
        """
        Test where user has already registered
        """
        MemberDates.objects.create(date=self.today, userID=self.member)
        url = reverse('add_day', kwargs={'auth0_id': 'test_auth0_id'})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Cannot add one extra day')
        self.member.refresh_from_db()

    def test_add_day_banned_member(self):
        """
        Test where user is banned
        """
        self.member.banned = True
        self.banned_from = "2024-05-13"
        self.banned_until = "2024-05-16"
        self.member.save()
        url = reverse('add_day', kwargs={'auth0_id': 'test_auth0_id'})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Cannot add one extra day')
        self.member.refresh_from_db()

class GetAllMembersInfoAPITestCase(APITestCase):
    def setUp(self):
        # Create some test members
        self.member1 = Members.objects.create(
            auth0ID='test_auth0_id1',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=10,
            phone_number='1234567890',
            email='john@example.com',
            role='member'
        )
        self.member2 = Members.objects.create(
            auth0ID='test_auth0_id2',
            first_name='Jane',
            last_name='Smith',
            birthdate='1995-05-05',
            gender='jente',
            points=5,
            phone_number='9876543210',
            email='jane@example.com',
            role='member'
        )

    def test_get_all_members_info(self):
        """
        Test where retrieval of all member info is a success
        """
        url = reverse('get_all_members_info')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Retrieve members from the database
        members = Members.objects.all()
        serializer = MembersSerializer(members, many=True)

        # Compare serialized data from the response with the expected data
        self.assertEqual(response.data, serializer.data)

class AdjustMemberPointsTotalAPITestCase(APITestCase):
    def setUp(self):
        # Create a test member
        self.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=10,
            phone_number='1234567890',
            email='john@example.com',
            role='member'
        )

    def test_adjust_member_points_total_success(self):
        """
        Test for success case
        """
        url = reverse('adjust_member_points_total', kwargs={'auth0_id': 'test_auth0_id'})
        data = {'points': 5}  # Adjusting points by 5
        response = self.client.put(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Member points altered')
        self.member.refresh_from_db()
        self.assertEqual(self.member.points, 15)  # 10 (initial) + 5 (adjusted)

    def test_adjust_member_points_total_missing_member(self):
        """
        Test where member does not exist
        """
        url = reverse('adjust_member_points_total', kwargs={'auth0_id': 'non_existing_auth0_id'})
        data = {'points': 5}  # Adjusting points by 5
        response = self.client.put(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Member not found')

    def test_adjust_member_points_total_missing_points_field(self):
        """
        Test where points param is missing
        """
        url = reverse('adjust_member_points_total', kwargs={'auth0_id': 'test_auth0_id'})
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "Missing 'points' field in request data")

    def test_adjust_member_points_total_invalid_points(self):
        """
        Test where points param is not of type integer
        """
        url = reverse('adjust_member_points_total', kwargs={'auth0_id': 'test_auth0_id'})
        data = {'points': 'abc'}  # Invalid points value (non-integer)
        response = self.client.put(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "'points' must be an integer")


class UploadMemberProfilePicAPITestCase(APITestCase):
    def setUp(self):
        # Create a test member
        self.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=10,
            phone_number='1234567890',
            email='john@example.com',
            role='member'
        )

    def test_upload_member_profile_pic_success(self):
        """
        Test success case
        """
        url = reverse('upload_profile_picture', kwargs={'auth0_id': 'test_auth0_id'})
        # Create a sample image file
        image = SimpleUploadedFile("profile_pic.jpg", b"file_content", content_type="image/jpeg")
        data = {'profile_pic': image}
        response = self.client.patch(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Profile picture updated successfully')
        self.member.refresh_from_db()
        self.assertIsNotNone(self.member.profile_pic)

    def test_upload_member_profile_pic_missing_member(self):
        """
        Test where member is not found
        """
        url = reverse('upload_profile_picture', kwargs={'auth0_id': 'non_existing_auth0_id'})
        image = SimpleUploadedFile("profile_pic.jpg", b"file_content", content_type="image/jpeg")
        data = {'profile_pic': image}
        response = self.client.patch(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Member not found')

    def test_upload_member_profile_pic_missing_profile_pic_data(self):
        """
        Test where image is not provided
        """
        url = reverse('upload_profile_picture', kwargs={'auth0_id': 'test_auth0_id'})
        data = {}  # No profile picture data provided
        response = self.client.patch(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Profile picture data not provided')

class UploadMemberCertificatesAPITestCase(APITestCase):
    def setUp(self):
        # Create a test member
        self.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=10,
            phone_number='1234567890',
            email='john@example.com',
            role='member'
        )

    def test_upload_member_certificates_success(self):
        """
        Test success case
        """
        url = reverse('upload_member_certificates', kwargs={'auth0_id': 'test_auth0_id'})
        # Create sample certificate images
        certificate_image1 = SimpleUploadedFile("certificate1.jpg", b"file_content", content_type="image/jpeg")
        certificate_image2 = SimpleUploadedFile("certificate2.jpg", b"file_content", content_type="image/jpeg")
        data = {
            'certificate_image': [certificate_image1, certificate_image2],
            'certificate_name': ['Certificate 1', 'Certificate 2']
        }
        response = self.client.post(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'Certificate uploaded successfully')
        self.assertEqual(MemberCertificate.objects.filter(member=self.member).count(), 2)  

    def test_upload_member_certificates_missing_member(self):
        url = reverse('upload_member_certificates', kwargs={'auth0_id': 'non_existing_auth0_id'})
        # Create a sample certificate image
        certificate_image = SimpleUploadedFile("certificate.jpg", b"file_content", content_type="image/jpeg")
        data = {
            'certificate_image': [certificate_image],
            'certificate_name': ['Certificate']
        }
        response = self.client.post(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, 'Member not found')

    def test_upload_member_certificates_missing_certificate_data(self):
        url = reverse('upload_member_certificates', kwargs={'auth0_id': 'test_auth0_id'})
        data = {}  # No certificate data provided
        response = self.client.post(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'certificate_image': ['This field is required.'], 'certificate_name': ['This field is required.']})

class GetMemberActivitiesAPITestCase(APITestCase):
    def setUp(self):
        # Create a test member
        self.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=10,
            phone_number='1234567890',
            email='john@example.com',
            role='member'
        )

        # Create test activities
        self.activity1 = Activity.objects.create(
            title='Activity 1',
            description='Description 1',
            date='2024-06-01',
        )
        self.activity2 = Activity.objects.create(
            title='Activity 2',
            description='Description 2',
            date='2024-06-02',
        )

        # Sign up the member for activity 1
        ActivitySignup.objects.create(userID=self.member, activityID=self.activity1)

    def test_get_member_activities_success(self):
        """
        Test success case
        """
        url = reverse('get_member_activities', kwargs={'auth0_id': 'test_auth0_id'})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Ensure only one activity is returned
        self.assertEqual(response.data[0]['title'], 'Activity 1')  # Ensure correct activity is returned

    def test_get_member_activities_missing_member(self):
        """
        Test where member is not found
        """
        url = reverse('get_member_activities', kwargs={'auth0_id': 'non_existing_auth0_id'})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Member not found')
    
class GetMemberCertificatesAPITestCase(APITestCase):
    def setUp(self):
        # Create a test member
        self.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=10,
            phone_number='1234567890',
            email='john@example.com',
            role='member'
        )

        # Create test certificates for the member
        MemberCertificate.objects.create(
            member=self.member,
            certificate_name='Certificate 1',
            certificate_image='certificate1.jpg'
        )
        MemberCertificate.objects.create(
            member=self.member,
            certificate_name='Certificate 2',
            certificate_image='certificate2.jpg'
        )

    def test_get_member_certificates_success(self):
        """
        Test success case
        """
        url = reverse('get_member_certificates', kwargs={'auth0_id': 'test_auth0_id'})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Ensure correct number of certificates returned

    def test_get_member_certificates_missing_member(self):
        """
        Test where member is not found
        """
        url = reverse('get_member_certificates', kwargs={'auth0_id': 'non_existing_auth0_id'})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, 'Member not found')

    def test_get_member_certificates_empty(self):
        """
        Test where a member has no certificates
        """
        # Delete the certificates created in the setUp method
        MemberCertificate.objects.filter(member=self.member).delete()

        url = reverse('get_member_certificates', kwargs={'auth0_id': 'test_auth0_id'})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

class DeleteMemberCertificateAPITestCase(APITestCase):
    def setUp(self):
        # Create a test member
        self.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=10,
            phone_number='1234567890',
            email='john@example.com',
            role='member'
        )

        # Create a test certificate associated with the test member
        self.certificate = MemberCertificate.objects.create(
            member=self.member,
            certificate_name='Certificate 1',
            certificate_image='certificate1.jpg'
        )

    def test_delete_member_certificate_success(self):
        """
        Test success case
        """
        url = reverse('delete_member_certificate', kwargs={'certificate_id': self.certificate.certificateID})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(MemberCertificate.objects.filter(certificateID=self.certificate.certificateID).exists())

    def test_delete_member_certificate_not_found(self):
        """
        Test case where certificate is not found
        """
        url = reverse('delete_member_certificate', kwargs={'certificate_id': 999})  # Non-existing certificate_id
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, 'Certificate not found')

    def test_delete_member_certificate_method_not_allowed(self):
        # Attempt to make a request using an unsupported method (e.g., GET)
        url = reverse('delete_member_certificate', kwargs={'certificate_id': self.certificate.certificateID})
        response = self.client.get(url)

        # Verify that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

class CreateQuestionWithAnswersAPITestCase(APITestCase):
    def test_create_question_with_answers_success(self):
        """
        Test creating a question with answers successfully
        """
        data = {
            'question': 'What is your favorite color?',
            'answers': [
                {'answer': 'Red'},
                {'answer': 'Blue'},
                {'answer': 'Green'}
            ]
        }
        url = reverse('create_question')
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PollQuestion.objects.count(), 1)
        self.assertEqual(PollQuestion.objects.get().question, 'What is your favorite color?')
        self.assertEqual(PollQuestion.objects.get().answers.count(), 3)

    def test_create_question_with_answers_invalid_data(self):
        """
        Test creating a question with invalid data
        """
        data = {
            'question': '',  # Invalid: Missing question
            'answers': [
                {'answer': 'Red'},
                {'answer': 'Blue'},
                {'answer': 'Green'}
            ]
        }
        url = reverse('create_question')
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(PollQuestion.objects.count(), 0)

    def test_invalid_http_method(self):
        """
        Test sending a request with an invalid HTTP method
        """
        url = reverse('create_question')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

class GetAllQuestionsWithAnswersAPITestCase(APITestCase):
    def setUp(self):
        # Create sample questions with answers
        self.question1 = PollQuestion.objects.create(question='Question 1')
        self.question2 = PollQuestion.objects.create(question='Question 2')
        self.answer1_1 = PollAnswer.objects.create(question=self.question1, answer='Answer 1 for Question 1')
        self.answer1_2 = PollAnswer.objects.create(question=self.question1, answer='Answer 2 for Question 1')
        self.answer2_1 = PollAnswer.objects.create(question=self.question2, answer='Answer 1 for Question 2')

    def test_get_all_questions_with_answers_success(self):
        """
        Test retrieving all questions with answers successfully
        """
        url = reverse('get_all_questions')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['questions']), 2)

        # Check questions and their answers
        self.assertEqual(response.data['questions'][0]['question'], 'Question 1')
        self.assertEqual(len(response.data['questions'][0]['answers']), 2)
        self.assertEqual(response.data['questions'][0]['answers'][0]['answer_id'], self.answer1_1.answerID)
        self.assertEqual(response.data['questions'][0]['answers'][0]['answer_text'], 'Answer 1 for Question 1')

    def test_get_all_questions_with_answers_no_questions(self):
        """
        Test retrieving all questions with answers when there are no questions
        """
        # Delete all questions to simulate no questions in the database
        PollQuestion.objects.all().delete()

        url = reverse('get_all_questions')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['questions']), 0)

class DeleteQuestionAPITestCase(APITestCase):
    def setUp(self):
        # Create a sample question
        self.question = PollQuestion.objects.create(question='Sample Question')

    def test_delete_question_success(self):
        """
        Test deleting a question successfully
        """
        url = reverse('delete_question', kwargs={'question_id': self.question.questionID})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(PollQuestion.objects.filter(questionID=self.question.questionID).exists())
        self.assertEqual(response.data, {'message': 'Question deleted successfully'})

    def test_delete_question_not_found(self):
        """
        Test deleting a question that does not exist
        """
        url = reverse('delete_question', kwargs={'question_id': 999})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'error': 'Question not found'})

class GetAnswerCountsForQuestionAPITestCase(APITestCase):
    def setUp(self):
        # Create a sample question with answers
        self.question = PollQuestion.objects.create(question='Sample Question')
        self.answer1 = PollAnswer.objects.create(question=self.question, answer='Answer 1')
        self.answer2 = PollAnswer.objects.create(question=self.question, answer='Answer 2')

        # Create a sample member
        self.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=10,
            phone_number='1234567890',
            email='john@example.com',
            role='member'
        )

        # Create sample member answers associated with the member
        # Create sample member answers associated with the member and the question's answers
        MemberAnswer.objects.create(member=self.member, answer=self.answer1, question=self.question)
        MemberAnswer.objects.create(member=self.member, answer=self.answer1, question=self.question)
        MemberAnswer.objects.create(member=self.member, answer=self.answer2, question=self.question)

    def test_get_answer_counts_for_question_success(self):
        """
        Test retrieving answer counts for a question successfully
        """
        url = reverse('get_question_responses', kwargs={'question_id': self.question.questionID})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Answer counts retrieved successfully')
        self.assertEqual(response.data['question'], 'Sample Question')
        self.assertEqual(response.data['answer_counts'], {'Answer 1': 2, 'Answer 2': 1})

    def test_get_answer_counts_for_question_not_found(self):
        """
        Test retrieving answer counts for a question that does not exist
        """
        url = reverse('get_question_responses', kwargs={'question_id': 999})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'error': 'Question not found'})

class SubmitUserResponseAPITestCase(APITestCase):
    def setUp(self):
        # Create a sample member
        self.member = Members.objects.create(
            auth0ID='test_auth0_id',
            first_name='John',
            last_name='Doe',
            birthdate='1990-01-01',
            gender='gutt',
            points=10,
            phone_number='1234567890',
            email='john@example.com',
            role='member'
        )

        # Create a sample question with answers
        self.question = PollQuestion.objects.create(question='Sample Question')
        self.answer1 = self.question.answers.create(answer='Answer 1')
        self.answer2 = self.question.answers.create(answer='Answer 2')

    def test_submit_user_response_success(self):
        """
        Test submitting a user response successfully
        """
        url = reverse('submit_response', kwargs={'auth0_id': self.member.auth0ID})
        data = {'question': self.question.pk, 'answer': self.answer1.pk}
        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {'message': 'User response submitted successfully.'})

    def test_submit_user_response_member_not_found(self):
        """
        Test submitting a user response when member is not found
        """
        url = reverse('submit_response', kwargs={'auth0_id': 'non_existing_id'})
        data = {'question': self.question.pk, 'answer': self.answer1.pk}
        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'error': 'Member not found'})

    def test_submit_user_response_question_not_found(self):
        """
        Test submitting a user response for a non-existing question
        """
        url = reverse('submit_response', kwargs={'auth0_id': self.member.auth0ID})
        data = {'question': 999, 'answer': self.answer1.pk}
        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'error': 'Question not found'})

    def test_submit_user_response_user_already_answered(self):
        """
        Test submitting a user response when the user has already answered the question
        """
        # Create a member answer for the same question and member
        MemberAnswer.objects.create(member=self.member, question=self.question, answer=self.answer1)

        url = reverse('submit_response', kwargs={'auth0_id': self.member.auth0ID})
        data = {'question': self.question.pk, 'answer': self.answer2.pk}
        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'User has already answered this question'})

class UndoSignUpActivityAPITestCase(APITestCase):
    def setUp(self):
        # Set up sample user and activity
        self.user = Members.objects.create(auth0ID="test_auth0_id", first_name="John", last_name="Doe", birthdate="1990-01-01", gender="male", phone_number="1234567890", email="john@example.com", points=0)
        self.activity = Activity.objects.create(title="Test Activity", description="Sample description", date="2024-01-01")

    def test_undo_sign_up_activity_success(self):
        """
        Test unregistering from an activity successfully
        """
        # Sign up the user for the activity
        ActivitySignup.objects.create(userID=self.user, activityID=self.activity)

        url = reverse('undo_signup_activity')
        data = {
            'user_id': self.user.userID,
            'auth0_id': self.user.auth0ID,
            'activity_id': self.activity.activityID
        }
        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'message': 'Sign-up undon successfully'})

    def test_undo_sign_up_activity_record_not_found(self):
        """
        Test unregistering when the sign-up record is not found
        """
        url = reverse('undo_signup_activity')
        data = {
            'user_id': self.user.userID,
            'auth0_id': self.user.auth0ID,
            'activity_id': self.activity.activityID
        }
        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'error': 'Sign-up record not found'})
