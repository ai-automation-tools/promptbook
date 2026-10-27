---
title: "📌 API Integration"
tags: ["it", "development", "integration", "template"]
category: "IT"
subcategory: "Development"
---
# API Integration Template

Template for integrating with external APIs including authentication, error handling, and rate limiting.

## Requirements

### Authentication Methods
- API keys (header/query param)
- OAuth 2.0
- Basic auth
- Bearer tokens
- Custom authentication

### Error Handling
- HTTP status code handling
- Retry logic with exponential backoff
- Rate limit detection
- Timeout management
- Connection error recovery

### Rate Limiting
- Request throttling
- Burst handling
- Queue management
- Backoff strategies

## Bash Implementation

```bash
#!/bin/bash
# API Integration Script

API_BASE_URL="${API_BASE_URL:-https://api.example.com}"
API_KEY="${API_KEY:-}"
RATE_LIMIT_DELAY=1  # seconds between requests
MAX_RETRIES=3

api_request() {
    local method="$1"
    local endpoint="$2"
    local data="${3:-}"
    local retry=0
    
    while [ $retry -lt $MAX_RETRIES ]; do
        response=$(curl -s -w "\n%{http_code}" \
            -X "$method" \
            -H "Authorization: Bearer $API_KEY" \
            -H "Content-Type: application/json" \
            ${data:+-d "$data"} \
            "$API_BASE_URL/$endpoint")
        
        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | sed '$d')
        
        case $http_code in
            200|201)
                echo "$body"
                return 0
                ;;
            429)  # Rate limited
                sleep $((2 ** retry))
                ;;
            5*)  # Server error
                ((retry++))
                sleep $((2 ** retry))
                ;;
            *)
                echo "Error: HTTP $http_code" >&2
                return 1
                ;;
        esac
    done
    
    echo "Max retries exceeded" >&2
    return 1
}

# Usage
api_request "GET" "users/123"
api_request "POST" "items" '{"name":"example"}'
```

## Python Implementation

```python
import requests
from time import sleep
from functools import wraps

class APIClient:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })
    
    def retry_with_backoff(max_retries=3):
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                for attempt in range(max_retries):
                    try:
                        response = func(*args, **kwargs)
                        response.raise_for_status()
                        return response.json()
                    except requests.exceptions.HTTPError as e:
                        if e.response.status_code == 429:
                            sleep(2 ** attempt)
                        elif 500 <= e.response.status_code < 600:
                            sleep(2 ** attempt)
                        else:
                            raise
                raise Exception("Max retries exceeded")
            return wrapper
        return decorator
    
    @retry_with_backoff(max_retries=3)
    def get(self, endpoint):
        return self.session.get(f"{self.base_url}/{endpoint}")
    
    @retry_with_backoff(max_retries=3)
    def post(self, endpoint, data):
        return self.session.post(f"{self.base_url}/{endpoint}", json=data)
```

## Best Practices
- Store credentials in environment variables
- Implement exponential backoff for retries
- Log all API calls
- Monitor rate limits
- Cache responses when appropriate
- Use connection pooling
- Handle pagination
- Validate responses

---

*Based on: GitHub API, ElevenLabs API, Discord API integrations*
