from rest_framework import serializers
from .views import BoardModel, ListModel, CardModel

class BoardSerializer(serializers.ModelSerializer):
  class Meta:
    model = BoardModel
    fields = '__all__'
    

class ListSerializer(serializers.ModelSerializer):
  class Meta:
    model = ListModel
    fields = '__all__'
    
    
class CardSerializer(serializers.ModelSerializer):
  class Meta:
    model = CardModel
    fields = '__all__'