from django.test import Client, TestCase
from datetime import date, timedelta
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Activity
from .models import Members
from .models import MemberDates
from .models import Level
from .models import SuggestionBox
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
            days_without_incident=0,
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
            days_without_incident=0,
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
            days_without_incident=0,
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
                days_without_incident=0,
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
            days_without_incident=0,
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
            days_without_incident=0,
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

        # Add more assertions to check the response data

    def test_search_member_case_insensitive(self):
        # Test case-insensitive search for members by name
        url = reverse('search_member')
        name = 'doe'  # Searching for members with last name 'Doe' (case-insensitive)

        response = self.client.get(url, {'name': name})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the structure of the response
        self.assertIsInstance(response.data, list)

        # Add more assertions to check the response data

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
            days_without_incident=0,
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
            days_without_incident=0,
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
            days_without_incident=0,
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
        days_without_incident=0,
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
            days_without_incident=0,
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
            days_without_incident=0,
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
            days_without_incident=0,
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
            days_without_incident=0,
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
            days_without_incident=0,
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
        days_without_incident=0,
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

class SuggestionBoxTests(APITestCase):
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

    