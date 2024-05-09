from rest_framework import serializers
from .models import Members
from .models import SuggestionBox
from .models import Level
from .models import Message
from .models import Activity
from .models import ActivitySignup
from .models import PollQuestion 
from .models import PollAnswer
from .models import MemberAnswer
from .models import MemberCertificate


class MembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Members
        fields = '__all__'


class SuggestionBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuggestionBox
        fields = ['suggestionID', 'title', 'description']


class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['levelID', 'name', 'points']


class ActivitySignupSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='userID.first_name')
    last_name = serializers.CharField(source='userID.last_name')
    auth0ID = serializers.CharField(source='userID.auth0ID')

    class Meta:
        model = ActivitySignup
        fields = ['first_name', 'last_name', 'auth0ID']


class ActivitySerializer(serializers.ModelSerializer):
    signed_up_members = ActivitySignupSerializer(many=True, source='activitysignup_set')

    class Meta:
        model = Activity
        fields = ['activityID', 'title', 'description', 'image', 'date', 'limit', 'signed_up_count', 'signed_up_members']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id','sender', 'recipient', 'subject', 'body', 'is_read']


class PollAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollAnswer
        fields = ['answerID', 'answer']


class PollQuestionSerializer(serializers.ModelSerializer):
    answers = PollAnswerSerializer(many=True)

    class Meta:
        model = PollQuestion
        fields = ['questionID', 'question', 'answers']

    # Creates Poll Question instance and one or multiple Poll answer instances
    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        question = PollQuestion.objects.create(**validated_data)
        for answer_data in answers_data:
            PollAnswer.objects.create(question=question, **answer_data)
        return question


class MemberAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberAnswer
        fields = ['question', 'answer']


class MemberAttendanceSerializer(serializers.Serializer):
    total_attendance = serializers.IntegerField()
    attendance_by_gender = serializers.DictField(child=serializers.IntegerField())


class MemberCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberCertificate
        fields = ['certificateID', 'certificate_image', 'certificate_name']

