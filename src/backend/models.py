from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    email_user: EmailStr
    pass_user: str

class RegisterRequest(BaseModel):
    name_user: str
    email_user: EmailStr
    pass_user: str
    matricula_user: int
    id_rol: int = 2

class UserResponse(BaseModel):
    id_user: int
    name_user: str
    email_user: str
    matricula_user: Optional[int]
    rol: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    user: Optional[UserResponse] = None