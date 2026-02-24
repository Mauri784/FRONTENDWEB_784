from fastapi import APIRouter, HTTPException
from database import get_db_connection
from schemas import EventoCreate, EventoResponse
from typing import List

router = APIRouter(prefix="/eventos", tags=["Eventos"])

# ===============================
# GET TODOS LOS EVENTOS
# ===============================
@router.get("/", response_model=List[EventoResponse])
def get_eventos():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM eventos")
    eventos = cursor.fetchall()

    cursor.close()
    db.close()

    return eventos



# ===============================
# CREAR EVENTO
# ===============================
@router.post("/eventos")
def create_evento(data: dict):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO eventos (name_event, id_building, timedate_event, id_profe, id_user)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        data["name_event"],
        data["id_building"],
        data["timedate_event"],
        data["id_profe"],
        data["id_user"]
    ))

    db.commit()
    cursor.close()
    db.close()

    return {"message": "Evento creado"}


# ===============================
# ACTUALIZAR EVENTO
# ===============================
@router.put("/eventos/{id_event}")
def update_evento(id_event: int, data: dict):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        UPDATE eventos
        SET name_event=%s,
            id_building=%s,
            timedate_event=%s,
            id_profe=%s,
            id_user=%s,
            status_event=%s
        WHERE id_event=%s
    """, (
        data["name_event"],
        data["id_building"],
        data["timedate_event"],
        data["id_profe"],
        data["id_user"],
        data.get("status_event", 1),
        id_event
    ))

    db.commit()
    cursor.close()
    db.close()

    return {"message": "Evento actualizado"}


# ===============================
# ELIMINAR EVENTO
# ===============================
@router.delete("/eventos/{id_event}")
def delete_evento(id_event: int):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("DELETE FROM eventos WHERE id_event=%s", (id_event,))
    db.commit()

    cursor.close()
    db.close()

    return {"message": "Evento eliminado"}


# ===============================
# GET USUARIOS
# ===============================
@router.get("/usuarios")
def get_usuarios():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id_user, name_user FROM usuarios ORDER BY name_user;")
    usuarios = cursor.fetchall()

    cursor.close()
    db.close()
    return usuarios


# ===============================
# GET EDIFICIOS
# ===============================
@router.get("/edificios")
def get_edificios():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id_building, name_building FROM edificios ORDER BY name_building;")
    edificios = cursor.fetchall()

    cursor.close()
    db.close()
    return edificios


# ===============================
# GET PROFESORES
# ===============================
@router.get("/profesores")
def get_profesores():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id_profe, nombre_profe FROM profesor ORDER BY nombre_profe;")
    profesores = cursor.fetchall()

    cursor.close()
    db.close()
    return profesores
