# Generated by Django 3.2.8 on 2023-05-11 08:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='openid',
            field=models.CharField(blank=True, default='', max_length=50, null=True),
        ),
    ]
