from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import LoginRequest, RegisterRequest, LoginResponse, UserResponse
from database import get_db_connection
from eventos_router import router as eventos_router

from security import (
    verify_password,
    hash_password,
    validate_password
)

app = FastAPI()

app.include_router(eventos_router)

# ============================
# 🌍 Configuración CORS
# ============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# 🔑 LOGIN
# ============================
@app.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):

    db = get_db_connection()
    if not db:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")

    cursor = db.cursor(dictionary=True)

    cursor.execute("""
    SELECT u.id_user, u.name_user, u.email_user, u.pass_user,
           u.matricula_user, u.id_rol, r.name_rol
    FROM usuarios u
    JOIN rol r ON u.id_rol = r.id_rol
    WHERE u.email_user = %s
""", (credentials.email_user,))


    user = cursor.fetchone()
    cursor.close()
    db.close()

    # Usuario no existe
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Contraseña incorrecta
    if not verify_password(credentials.pass_user, user["pass_user"]):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    return LoginResponse(
    success=True,
    message="Login exitoso",
    user=UserResponse(
        id_user=user["id_user"],
        name_user=user["name_user"],
        email_user=user["email_user"],
        matricula_user=user["matricula_user"],
        id_rol=user["id_rol"],      
        rol=user["name_rol"]
    )
)


# ============================
# 📝 REGISTER
# ============================
@app.post("/register")
async def register(user_data: RegisterRequest):

    db = get_db_connection()
    cursor = db.cursor()

    # Verificar email duplicado
    cursor.execute(
        "SELECT id_user FROM usuarios WHERE email_user=%s",
        (user_data.email_user,)
    )
    if cursor.fetchone():
        raise HTTPException(status_code=409, detail="Correo ya registrado")

    # 🔐 Hashear contraseña (ya valida dentro)
    try:
        hashed_password = hash_password(user_data.pass_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Insertar usuario
    cursor.execute("""
        INSERT INTO usuarios (name_user, email_user, pass_user, matricula_user, id_rol)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        user_data.name_user,
        user_data.email_user,
        hashed_password,
        user_data.matricula_user,
        user_data.id_rol
    ))

    db.commit()
    cursor.close()
    db.close()

    return {"success": True, "message": "Usuario registrado correctamente"}

app.include_router(eventos_router)

# ============================
# 🚀 Run local
# ============================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
