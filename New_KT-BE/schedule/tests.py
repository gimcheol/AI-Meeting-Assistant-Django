from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
import json

class MyAPITestCase(TestCase):
    def setUp(self):
        # 테스트에 사용할 유저 생성
        self.test_user = User.objects.create_user(username='testuser',email='testuser@naver.com' ,password='testpassword')
        self.client = APIClient()

    def test_get_user_events(self):
        # 테스트 유저로 로그인
        self.client.force_authenticate(user=self.test_user)

        # GET 요청 테스트
        response = self.client.get('/schedule/')
        self.assertEqual(response.status_code, 200)

        # JSON 응답 데이터 확인
        data = json.loads(response.content)
        self.assertIn('events', data)
        self.assertIsInstance(data['events'], list)

    # Meeting True인 이벤트 가져오기
    def test_create_event(self):
        # 테스트 유저로 로그인
        self.client.force_authenticate(user=self.test_user)

        # POST 요청 테스트
        event_data = {
            'title': 'Test Event',
            'start': '2023-01-01T08:00:00',
            'end': '2023-01-01T10:00:00',
            'memo': 'Test Memo',
            'meeting': True,
        }
        print('create',event_data)
        event_data['start'] += 'Z'
        event_data['end'] += 'Z'
        response = self.client.post('/schedule/create/', data=json.dumps(event_data), content_type='application/json')
        print(response)
        self.assertEqual(response.status_code, 201)
    
    # Meeting False인 이벤트 가져오기   
    def test_create_event_no_meeting(self):
        # 테스트 유저로 로그인
        self.client.force_authenticate(user=self.test_user)

        # POST 요청 테스트
        event_data = {
            'title': 'Test Event',
            'start': '2023-01-01T00:00:00',
            'end': '2023-01-03T00:00:00',
            'memo': 'Test Memo',
            'meeting': False,
        }
        print(event_data)
        event_data['start'] += 'Z' 
        event_data['end'] += 'Z'
        response = self.client.post('/schedule/create/', data=json.dumps(event_data), content_type='application/json')
        self.assertEqual(response.status_code, 201)