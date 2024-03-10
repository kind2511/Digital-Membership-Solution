from rest_framework import serializers
from .models import Members
from .models import SuggestionBox

class MembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Members
        fields = '__all__'

class SuggestionBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuggestionBox
        fields = ['suggestionID', 'title', 'description']

