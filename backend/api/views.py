from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.db import db
import bcrypt
from rest_framework.decorators import authentication_classes

@api_view(['POST'])
def register(request):
    data = request.data

    # Check if user already exists
    existing_user = db.users.find_one({"email": data['email']})
    if existing_user:
        return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

    # Hash the password before saving
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    # Create user object
    user = {
        "name": data['name'],
        "email": data['email'],
        "password": hashed_password,
        "profile_image": None
    }

    # Save to MongoDB
    db.users.insert_one(user)

    return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login(request):
    data = request.data

    # Find user by email
    user = db.users.find_one({"email": data['email']})
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check password
    password_match = bcrypt.checkpw(data['password'].encode('utf-8'), user['password'])
    if not password_match:
        return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)

    # Create token manually using the user's MongoDB ID
    refresh = RefreshToken()
    refresh['user_id'] = str(user['_id'])
    refresh['email'] = user['email']

    return Response({
        "message": "Login successful",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "name": user['name'],
            "email": user['email'],
        }
    })

from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from bson import ObjectId

#logout is done in frontend 
@api_view(['POST'])
def logout(request):
    return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.authentication import BaseAuthentication

@api_view(['GET'])
@authentication_classes([])
def get_profile(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({"error": "Authorization header missing"}, status=status.HTTP_401_UNAUTHORIZED)

    token_string = auth_header.split(' ')[1]

    try:
        token = AccessToken(token_string)
    except TokenError:
        return Response({"error": "Invalid or expired token"}, status=status.HTTP_401_UNAUTHORIZED)

    user_id = token['user_id']
    user = db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        "name": user['name'],
        "email": user['email'],
        "profile_image": user.get('profile_image')
    })

@api_view(['PUT'])
@authentication_classes([])
def update_profile(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({"error": "Authorization header missing"}, status=status.HTTP_401_UNAUTHORIZED)

    token_string = auth_header.split(' ')[1]

    try:
        token = AccessToken(token_string)
    except TokenError:
        return Response({"error": "Invalid or expired token"}, status=status.HTTP_401_UNAUTHORIZED)

    user_id = token['user_id']
    data = request.data

    update_fields = {}
    if 'name' in data:
        update_fields['name'] = data['name']
    if 'email' in data:
        update_fields['email'] = data['email']

    if not update_fields:
        return Response({"error": "No fields to update"}, status=status.HTTP_400_BAD_REQUEST)

    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields}
    )

    updated_user = db.users.find_one({"_id": ObjectId(user_id)})

    return Response({
        "message": "Profile updated successfully",
        "name": updated_user['name'],
        "email": updated_user['email'],
        "profile_image": updated_user.get('profile_image')
    })

@api_view(['POST'])
@authentication_classes([])
def upload_profile_image(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({"error": "Authorization header missing"}, status=status.HTTP_401_UNAUTHORIZED)

    token_string = auth_header.split(' ')[1]

    try:
        token = AccessToken(token_string)
    except TokenError:
        return Response({"error": "Invalid or expired token"}, status=status.HTTP_401_UNAUTHORIZED)

    user_id = token['user_id']
    data = request.data

    if 'profile_image' not in data:
        return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"profile_image": data['profile_image']}}
    )

    return Response({"message": "Profile image updated successfully"})

from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
@authentication_classes([])
def refresh_token(request):
    refresh_token_string = request.data.get('refresh')

    if not refresh_token_string:
        return Response({"error": "Refresh token missing"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        refresh = RefreshToken(refresh_token_string)
        access_token = refresh.access_token
    except TokenError:
        return Response({"error": "Invalid or expired refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

    return Response({"access": str(access_token)})