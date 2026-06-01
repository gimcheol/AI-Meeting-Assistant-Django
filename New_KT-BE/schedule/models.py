from django.db import models
from django.contrib.auth.models import User

class FileModel(models.Model):
    file = models.FileField(upload_to='event_files/')
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.file.name

class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=255)
    start = models.DateTimeField()
    end = models.DateTimeField(null=True, blank=True)
    memo = models.TextField(blank=True, null=True)
    meeting = models.BooleanField(default=False)
    files = models.ManyToManyField(FileModel)
    meeting_text = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.title
    
    def delete(self, using=None, keep_parents=False):
        for file in self.files.all():
            file.file.delete()
            file.delete()

        super().delete(using=using, keep_parents=keep_parents)