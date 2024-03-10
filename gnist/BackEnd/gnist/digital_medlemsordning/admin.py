from django.contrib import admin
from .models import Activity
from .models import ActivityDate
from .models import Members
from .models import Employee
from .models import MemberDates
from .models import ActivitySignup
from .models import SuggestionBox

# Register your models here.
admin.site.register(Activity)
admin.site.register(ActivityDate)
admin.site.register(Members)
admin.site.register(Employee)
admin.site.register(MemberDates)
admin.site.register(ActivitySignup)
admin.site.register(SuggestionBox)