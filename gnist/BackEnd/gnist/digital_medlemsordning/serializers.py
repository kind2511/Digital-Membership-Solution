from rest_framework import serializers
from .models import Members
from .models import SuggestionBox
from .models import Level
from .models import Message
from .models import Activity


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

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['activityID', 'title', 'description', 'image', 'sign_up']     

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id','sender', 'recipient', 'subject', 'body', 'is_read']
