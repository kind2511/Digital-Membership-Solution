from datetime import date, timedelta
from .models import Members

# Middleware that unbannes a member once the banned period has expired
class UnbannedMemberMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

    # Check if any members are currently banned
        banned_members = Members.objects.filter(banned=True)
    
     # Iterate over banned members and update their banned status if ban has expired
        for member in banned_members:
            if member.banned_until <= date.today():
                member.banned = False
                member.banned_from = None
                member.banned_until = None
                member.save()

        return response
    

# Middleware that removes guardian information (name and phonenumber) when a member turns 18
class RemoveGuardianInfoMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Check if any member is 18 or older (timdelta takes leapyears into account)
        adult_members = Members.objects.filter(birthdate__lte=date.today() - timedelta(days=365*18))

        # Iterate over adult members and update guardian info
        for member in adult_members:
            if member.guardian_name or member.guardian_phone:
                member.guardian_name = None
                member.guardian_phone = None
                member.save()

        return response
