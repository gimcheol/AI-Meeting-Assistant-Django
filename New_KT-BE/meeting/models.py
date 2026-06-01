from django.db import models
from django.contrib.auth.models import User
from schedule.models import Event
from django.dispatch import receiver
        
class Keyword(models.Model):
    meeting = models.ForeignKey(Event, on_delete=models.CASCADE)
    keyword = models.CharField(max_length=255)
    news_summary = models.TextField(null = True)
    
    def __str__(self):
        return f'{self.meeting.summary} - {self.keyword}'
    
class News(models.Model):
    meeting = models.ForeignKey(Event, on_delete=models.CASCADE)
    keyword = models.ForeignKey(Keyword, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    link = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.meeting.summary} - {self.title}'
    
class MeetingSummary(models.Model):
    meeting = models.ForeignKey(Event, on_delete=models.CASCADE)
    conference_title = models.TextField(null = True)
    issues_progress = models.TextField(null = True)
    situation_announcement = models.TextField(null = True)
    agenda = models.TextField(null = True)
    
    def __str__(self):
        return f'{self.meeting.summary} - {self.summary}'