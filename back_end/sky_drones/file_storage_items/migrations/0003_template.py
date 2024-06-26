# Generated by Django 5.0.1 on 2024-04-03 14:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('file_storage_items', '0002_filestorageitem_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Template',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('file_storage_item', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to='file_storage_items.filestorageitem')),
            ],
        ),
    ]
