# Generated by Django 5.0.1 on 2024-04-05 18:06

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('file_storage_items', '0003_template'),
        ('inspections', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
                ('file_storage_item', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to='file_storage_items.filestorageitem')),
                ('inspection', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to='inspections.inspection')),
                ('template', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='file_storage_items.template')),
            ],
        ),
    ]
