from slowapi import Limiter
from slowapi.util import get_remote_address

# Keyed by client IP. Render sits behind a proxy, so make sure
# ProxyHeadersMiddleware / X-Forwarded-For is trusted in production,
# otherwise every request may appear to come from the same IP.
limiter = Limiter(key_func=get_remote_address)
