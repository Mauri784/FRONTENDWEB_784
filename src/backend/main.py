from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import LoginRequest, RegisterRequest, LoginResponse, UserResponse
from database import get_db_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    db = get_db_connection()
    if not db:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")

    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT u.id_user, u.name_user, u.email_user, u.pass_user, 
               u.matricula_user, r.name_rol
        FROM usuarios u
        JOIN rol r ON u.id_rol = r.id_rol
        WHERE u.email_user = %s
    """, (credentials.email_user,))

    user = cursor.fetchone()
    cursor.close()
    db.close()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if user["pass_user"] != credentials.pass_user:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    return LoginResponse(
        success=True,
        message="Login exitoso",
        user=UserResponse(
            id_user=user["id_user"],
            name_user=user["name_user"],
            email_user=user["email_user"],
            matricula_user=user["matricula_user"],
            rol=user["name_rol"]
        )
    )

@app.post("/register", response_model=LoginResponse)
async def register(user_data: RegisterRequest):
    db = get_db_connection()
    if not db:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")

    cursor = db.cursor(dictionary=True)
    
    cursor.execute("SELECT id_user FROM usuarios WHERE email_user = %s", (user_data.email_user,))
    if cursor.fetchone():
        cursor.close()
        db.close()
        raise HTTPException(status_code=400, detail="El correo electrónico ya está registrado")
    
    cursor.execute("SELECT id_user FROM usuarios WHERE matricula_user = %s", (user_data.matricula_user,))
    if cursor.fetchone():
        cursor.close()
        db.close()
        raise HTTPException(status_code=400, detail="La matrícula ya está registrada")
    
    cursor.execute("""
        INSERT INTO usuarios (name_user, email_user, pass_user, matricula_user, id_rol)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_data.name_user, user_data.email_user, user_data.pass_user, 
          user_data.matricula_user, user_data.id_rol))
    
    db.commit()
    user_id = cursor.lastrowid
    
    cursor.execute("SELECT name_rol FROM rol WHERE id_rol = %s", (user_data.id_rol,))
    rol = cursor.fetchone()
    
    cursor.close()
    db.close()
    
    return LoginResponse(
        success=True,
        message="Usuario registrado exitosamente",
        user=UserResponse(
            id_user=user_id,
            name_user=user_data.name_user,
            email_user=user_data.email_user,
            matricula_user=user_data.matricula_user,
            rol=rol["name_rol"] if rol else "Usuario"
        )
    )

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)