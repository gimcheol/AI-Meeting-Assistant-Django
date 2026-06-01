from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.GetUserEventsView.as_view(), name='get_user_events'),
    path('create/', views.CreateEventView.as_view(), name='create_event'),
    path('loginhome/', views.LoginHomeBannerView.as_view(), name='login_home'),
    path('eventclick/<int:event_id>', views.EventClick.as_view(), name='event_click'),
    path('eventdelete/<int:event_id>', views.EventDelete.as_view(), name='event_delete'),
    path('filedownload/<int:event_id>', views.EventDownload.as_view(), name='file_download'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)