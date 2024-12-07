from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class BoardModel(models.Model):
  name = models.CharField(max_length=100)
  created_by = models.ForeignKey(User, related_name="boards", on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now=True)
  shared_whit = models.ManyToManyField(User, related_name="shared_boards", blank=True)
 

class ListModel(models.Model):
  name = models.CharField(max_length=100)
  board = models.ForeignKey(BoardModel, related_name="lists", on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now=True)
  
class CardModel(models.Model):
  STATUS_CHOICES = [
        ('not_started', 'not_started'),
        ('in_progress', 'in_progress'),
        ('completed', 'completed'),
    ]
  title = models.CharField(max_length=100)
  description = models.TextField(blank=True, null=True)
  list = models.ForeignKey(ListModel, related_name="cards", on_delete=models.CASCADE)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  