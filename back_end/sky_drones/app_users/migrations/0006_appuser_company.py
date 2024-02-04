# Generated by Django 5.0.1 on 2024-02-04 21:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_users', '0005_alter_appuser_role_delete_userrole'),
        ('companies', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='appuser',
            name='company',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='companies.company'),
        ),
    ]
