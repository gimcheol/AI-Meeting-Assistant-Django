from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

class RegisterSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        required=True,
        validators=[
            
            UniqueValidator(queryset=User.objects.all(), message="This email is already registered."),
        
        ]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
    )

    allowed_domain = "aivle.kt.co.kr"
    
    class Meta:
        model = User
        fields = ( 'email', 'password', 'password2')
        
    # 이메일 형식이 올바른지 검증하는 메서드
    def validate_email_format(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Not a valid email format.")
        
        return value
    
    # 비밀번호와 비밀번호 확인이 일치하고 이메일 형식이 올바른지, 특정 도메인인지 검증하는 메서드
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "The password does not match."})

        data['email'] = self.validate_email_format(data['email'])
        
        # 특정 도메인(@aivle.kt.co.kr)으로만 가입 가능하도록 검증
        if not data['email'].endswith(self.allowed_domain):
            raise serializers.ValidationError("You can sign up via aivle e-mail. example : 'example@aivle.kt.co.kr'")
        
        return data

    def create(self, validated_data):
        email = validated_data['email']
        username = email.split('@')[0]
        user = User.objects.create_user(
            email=email,
            username = username,
        )

        user.set_password(validated_data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return user
 
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        email = data.get('email')
        username = email.split('@')[0]
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), username=username, password=password)

            if user:
                token, created = Token.objects.get_or_create(user=user)
                return {
                    'access_token': token.key,
                    'username': user.username,
                }

            raise serializers.ValidationError({"error": "Invalid credentials."})

        raise serializers.ValidationError({"error": "Email and password are required."})