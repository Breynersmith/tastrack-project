from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BoardViewset, ListViewset, CardViewset

router = DefaultRouter()
router.register(r'boards', BoardViewset, basename='boards')
router.register(r'lists', ListViewset, basename='lists')
router.register(r'cards', CardViewset, basename='cards')

urlpatterns = [
  path('', include(router.urls))
  ]