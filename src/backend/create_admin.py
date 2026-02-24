import mysql.connector
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Conexión MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="2118",
    database="map"
)

cursor = db.cursor()

# Datos del admin
nombre = "Administrador2"
email = "admin@gmail.com"
password = "admin123."
id_rol = 1  # Admin

# Generar hash bcrypt
hashed_password = pwd_context.hash(password)

# Insertar admin
cursor.execute("""
    INSERT INTO usuarios (name_user, email_user, pass_user, id_rol)
    VALUES (%s, %s, %s, %s)
""", (nombre, email, hashed_password, id_rol))

db.commit()

print("✅ Admin creado correctamente con contraseña encriptada")

cursor.close()
db.close()
