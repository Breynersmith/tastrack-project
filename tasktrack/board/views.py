from rest_framework import viewsets, permissions, decorators, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import BoardModel, ListModel, CardModel
from .serializers import BoardSerializer, ListSerializer, CardSerializer

class IsBoardOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):

        if isinstance(obj, BoardModel):
            return obj.created_by == request.user or request.user in obj.shared_whit.all()

        if isinstance(obj, ListModel):
            return obj.board.created_by == request.user or request.user in obj.board.shared_whit.all()

        if isinstance(obj, CardModel):
            return obj.list.board.created_by == request.user or request.user in obj.list.board.shared_whit.all()

        return False


class BoardViewset(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated, IsBoardOwner]

    def get_queryset(self):

        user = self.request.user
        return BoardModel.objects.filter(created_by=user) | BoardModel.objects.filter(shared_whit=user)

    @decorators.action(detail=True, methods=['post'], url_path='share')
    def share(self, request, pk=None):

        try:
            board = self.get_object()
            email = request.data.get('email')  

            if not email:
                return Response({'Error': 'email is required'}, status=status.HTTP_400_BAD_REQUEST)


            user_email = User.objects.filter(email=email).first()
            if not user_email:
                return Response({'Error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)


            board.shared_whit.add(user_email)
            return Response({'Board': 'Successfully shared dashboard'}, status=status.HTTP_200_OK)

        except BoardModel.DoesNotExist:
            return Response({'Error': 'Board not found'}, status=status.HTTP_400_BAD_REQUEST)


class ListViewset(viewsets.ModelViewSet):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated, IsBoardOwner]

    def get_queryset(self):

        user = self.request.user
        boards = BoardModel.objects.filter(created_by=user) | BoardModel.objects.filter(shared_whit=user)
        board_id = self.request.query_params.get('board_id')
        
        if board_id:
            return ListModel.objects.filter(board__id=board_id, board__in=boards)
        return ListModel.objects.filter(board__in=boards)


class CardViewset(viewsets.ModelViewSet):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated, IsBoardOwner]

    def get_queryset(self):
        user = self.request.user
        boards = BoardModel.objects.filter(created_by=user) | BoardModel.objects.filter(shared_whit=user)
        lists = ListModel.objects.filter(board__in=boards)

        queryset = CardModel.objects.filter(list__in=lists)
        return queryset

        list = self.request.query_params.get('list') 
        if list:
            return CardModel.objects.filter(list__id=list, list__in=lists)

        return CardModel.objects.none()

    def perform_create(self, serializer):

        list = self.request.data.get('list') 
        if not list:
            raise serializers.ValidationError({'Error': 'list is required'})

        try:
            user = self.request.user
            boards = BoardModel.objects.filter(created_by=user) | BoardModel.objects.filter(shared_whit=user)
            valid_list = ListModel.objects.get(id=list, board__in=boards)


            serializer.save(list=valid_list)
        except ListModel.DoesNotExist:
            raise serializers.ValidationError({'Error': 'Invalid list'})
    
    def destroy(self, request, *args, **kwargs):
        try:
            card = self.get_object() 
            if card:

                self.perform_destroy(card)
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"detail": "Card not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

