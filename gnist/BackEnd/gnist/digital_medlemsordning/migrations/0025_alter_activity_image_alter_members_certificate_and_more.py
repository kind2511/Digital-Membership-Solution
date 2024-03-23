# Generated by Django 5.0.1 on 2024-03-11 19:02

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("digital_medlemsordning", "0024_members_certificate"),
    ]

    operations = [
        migrations.AlterField(
            model_name="activity",
            name="image",
            field=models.ImageField(
                blank=True,
                default="activity_pics/placeholder-image.png",
                null=True,
                upload_to="activity_pics",
            ),
        ),
        migrations.AlterField(
            model_name="members",
            name="certificate",
            field=models.ImageField(
                blank=True,
                default="certificates/placeholder-image.png",
                null=True,
                upload_to="certificates",
            ),
        ),
        migrations.AlterField(
            model_name="members",
            name="profile_pic",
            field=models.ImageField(
                blank=True,
                default="profile_pics/default_profile_picture.png",
                null=True,
                upload_to="profile_pics",
            ),
        ),
    ]