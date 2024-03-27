from rest_framework import serializers
from .models import Members
from .models import SuggestionBox
from .models import Level
from .models import Message
from .models import Activity
from .models import PollQuestion 
from .models import PollAnswer
from .models import MemberAnswer


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
        fields = ['activityID', 'title', 'description', 'image']     


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

