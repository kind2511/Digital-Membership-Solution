from django.http import JsonResponse
from .models import Members

# Authorizes the user
def authorize_user(sub):
    try:
        # Query the database to get the user by Auth0 ID (sub)
        user = Members.objects.get(auth0ID=sub)
    except Members.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    # Authorization check based on user's role
    if user.role == 'member':
        return JsonResponse({'message': 'Member access granted'})
    elif user.role == 'employee':
        return JsonResponse({'message': 'Employee access granted'})
    else:
        return JsonResponse({'error': 'Unauthorized role'}, status=403)

