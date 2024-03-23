# Generated by Django 5.0.1 on 2024-03-19 20:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("digital_medlemsordning", "0034_remove_questionnaire_chosen_answer_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="PollQuestion",
            fields=[
                (
                    "questionID",
                    models.AutoField(primary_key=True, serialize=False, unique=True),
                ),
                ("question", models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name="PollAnswer",
            fields=[
                (
                    "anwserID",
                    models.AutoField(primary_key=True, serialize=False, unique=True),
                ),
                ("answer", models.CharField(max_length=100)),
                (
                    "question",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="answers",
                        to="digital_medlemsordning.pollquestion",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Questionnaire",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "chosen_answer",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="chosen_in_questionnaires",
                        to="digital_medlemsordning.pollanswer",
                    ),
                ),
                (
                    "member",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="digital_medlemsordning.members",
                    ),
                ),
                (
                    "question",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="digital_medlemsordning.pollquestion",
                    ),
                ),
            ],
        ),
    ]