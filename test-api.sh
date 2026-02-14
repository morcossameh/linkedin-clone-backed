#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Testing LinkedIn Backend API ==="
echo ""

# Test root endpoint
echo "1. Testing root endpoint..."
curl -s $BASE_URL/
echo -e "\n"

# Register a new user
echo "2. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword",
    "firstName": "Jane",
    "lastName": "Smith"
  }')
echo $REGISTER_RESPONSE
echo -e "\n"

# Extract access token from registration
ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

# Login with existing user
echo "3. Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword"
  }')
echo $LOGIN_RESPONSE
echo -e "\n"

# Update access token from login
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)

# Get current user
echo "4. Testing protected endpoint (GET /me)..."
curl -s -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
echo -e "\n"

# Test refresh token
echo "5. Testing refresh token..."
curl -s -X POST $BASE_URL/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
echo -e "\n"

echo "=== All tests completed ==="
