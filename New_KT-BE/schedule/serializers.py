from rest_framework import serializers
from .models import Event
class UploadDataSerializer(serializers.Serializer):
    json = serializers.JSONField()
    file = serializers.FileField()
    
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'start', 'end', 'memo']   