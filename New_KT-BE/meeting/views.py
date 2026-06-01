from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
import json
from schedule.models import Event
from .models import MeetingSummary, Keyword
from .ai.meeting_summary import *
from datetime import timedelta, datetime

# Meeting 요약 정보를 가져오는 API
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class MeetingSummaryAPI(APIView):
    
    def get(self, request, *args, **kwargs):
        
        # 최근 회의 정보 가져오기
        recent_meeting = Event.objects.filter(user=request.user, meeting=True).latest('start')
        keywords = Keyword.objects.filter(meeting=recent_meeting)
        keywords_list = []
        conference = mts(recent_meeting.meeting_text)
        
        # 회의 종료 시간 업데이트
        recent_meeting.end = (datetime.strptime(str(datetime.now()), '%Y-%m-%d %H:%M:%S.%f')).replace(microsecond=0) + timedelta(hours=9)
        recent_meeting.save()
        
        for keyword in keywords:
            keywords_list.append(keyword.keyword)
            
        conference_summary = MeetingSummary.objects.create(
            meeting=recent_meeting,
            conference_title=conference['회의 제목'],
            issues_progress=conference['주요 이슈 및 진행상황'],
            situation_announcement=conference['새로운 상황 및 공지사항'],
            agenda=conference['추가 안건']
        )
        
        if conference_summary is None:
            meeting_summary_data = {
                '회의 제목': '',
                '주요 이슈 및 진행상황': '',
                '새로운 상황 및 공지사항': '',
                '추가 안건': '',
                'keywords': keywords_list,
            }
        else:
        
            meeting_summary_data = {
                '회의 제목': conference_summary.conference_title,
                '주요 이슈 및 진행상황': [value.strip() for value in conference_summary.issues_progress.split(',')],
                '새로운 상황 및 공지사항': [value.strip() for value in conference_summary.situation_announcement.split(',')],
                '추가 안건': [value.strip() for value in conference_summary.agenda.split(',')],
                'keywords': keywords_list,
            }
        
        return JsonResponse(meeting_summary_data, status=status.HTTP_200_OK)