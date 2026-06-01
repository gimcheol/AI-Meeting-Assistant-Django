from django.urls import path
from . import views

urlpatterns = [
    path('meetsum/', views.MeetingSummaryAPI.as_view(), name='meeting_end'),
]