# Generated by Django 4.2.1 on 2024-11-23 18:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BoardModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='boards', to=settings.AUTH_USER_MODEL)),
                ('shared_whit', models.ManyToManyField(blank=True, related_name='shared_boards', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ListModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lists', to='board.boardmodel')),
            ],
        ),
        migrations.CreateModel(
            name='CardModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, null=True)),
                ('status', models.CharField(choices=[('not_started', 'not_started'), ('in_progress', 'in_progress'), ('completed', 'completed')], default='not_started', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cards', to='board.listmodel')),
            ],
        ),
    ]
