# Generated by Django 2.0 on 2017-12-13 20:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('snap', '0008_droppedblock_parent'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='droppedblock',
            name='parent',
        ),
        migrations.AddField(
            model_name='droppedblock',
            name='parent_id',
            field=models.IntegerField(null=True),
        ),
    ]