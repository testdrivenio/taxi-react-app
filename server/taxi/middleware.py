from urllib.parse import parse_qs

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections

from channels.auth import AuthMiddlewareStack
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        close_old_connections()
        query_string = parse_qs(scope['query_string'].decode())
        token = query_string.get('token')
        if not token:
            scope['user'] = AnonymousUser()
            return self.inner(scope)
        try:
            access_token = AccessToken(token[0])
            user = User.objects.get(id=access_token['id'])
        except Exception as exception:
            scope['user'] = AnonymousUser()
            return self.inner(scope)
        if not user.is_active:
            scope['user'] = AnonymousUser()
            return self.inner(scope)
        scope['user'] = user
        return self.inner(scope)


def TokenAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(AuthMiddlewareStack(inner))
