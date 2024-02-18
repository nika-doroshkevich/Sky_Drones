# Generated by Django 5.0.1 on 2024-02-18 20:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('companies', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Facility',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('latitude', models.DecimalField(decimal_places=20, max_digits=23)),
                ('longitude', models.DecimalField(decimal_places=20, max_digits=23)),
                ('name', models.CharField(max_length=300)),
                ('type', models.CharField(max_length=50)),
                ('location', models.CharField(max_length=300, null=True)),
                ('description', models.TextField(null=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='companies.company')),
            ],
        ),
    ]
