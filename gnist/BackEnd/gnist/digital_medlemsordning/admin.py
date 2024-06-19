from django.contrib import admin
from .models import Activity
from .models import Members
from .models import MemberDates
from .models import ActivitySignup
from .models import SuggestionBox
from .models import Level
from .models import PollQuestion
from .models import PollAnswer
from .models import MemberAnswer


# Register your models here.
admin.site.register(Activity)
admin.site.register(Members)
admin.site.register(MemberDates)
admin.site.register(ActivitySignup)
admin.site.register(SuggestionBox)
admin.site.register(Level)
admin.site.register(PollQuestion)
admin.site.register(PollAnswer)
admin.site.register(MemberAnswer)

