# Generated by Django 5.0.1 on 2024-02-29 13:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('facilities', '0003_alter_facility_description_alter_facility_location'),
    ]

    operations = [
        migrations.CreateModel(
            name='FileStorageItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_name', models.CharField(max_length=300)),
                ('path', models.CharField(max_length=300)),
                ('facility', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='facilities.facility')),
            ],
        ),
    ]
