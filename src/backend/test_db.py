from database import get_db_connection

conn = get_db_connection()

if conn:
    print("Conexión exitosa a MySQL 🎉")
else:
    print("Falló conexión 💀")