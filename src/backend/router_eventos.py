from fastapi import APIRouter, HTTPException
from database import get_db_connection
from schemas import EventoCreate, EventoResponse
from typing import List

router = APIRouter(prefix="/eventos", tags=["Eventos"])
router = APIRouter()

# ===============================
# EVENTOS CRUD
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



@router.post("/", response_model=EventoResponse)
def create_evento(evento: EventoCreate):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        INSERT INTO eventos (name_event, id_building, timedate_event, status_event, id_profe, id_user)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        evento.name_event,
        evento.id_building,
        evento.timedate_event,
        evento.status_event,
        evento.id_profe,
        evento.id_user
    ))

    db.commit()

    new_id = cursor.lastrowid

    cursor.execute("SELECT * FROM eventos WHERE id_event=%s", (new_id,))
    nuevo_evento = cursor.fetchone()

    cursor.close()
    db.close()

    return nuevo_evento



@router.put("/eventos/{id_event}")
def update_evento(id_event: int, evento: dict):
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
        evento["name_event"],
        evento["id_building"],
        evento["timedate_event"],
        evento["id_profe"],
        evento["id_user"],
        evento.get("status_event", 1),
        id_event
    ))

    db.commit()
    cursor.close()
    db.close()

    return {"message": "Evento actualizado correctamente"}


@router.delete("/eventos/{id_event}")
def delete_evento(id_event: int):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("DELETE FROM eventos WHERE id_event=%s", (id_event,))
    db.commit()

    cursor.close()
    db.close()

    return {"message": "Evento eliminado correctamente"}

# ===============================
# LISTAS PARA SELECTS
# ===============================

@router.get("/usuarios")
def get_usuarios():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id_user, name_user FROM usuarios")
    data = cursor.fetchall()

    cursor.close()
    db.close()
    return data


@router.get("/edificios")
def get_edificios():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id_building, name_building FROM edificios")
    data = cursor.fetchall()

    cursor.close()
    db.close()
    return data


@router.get("/profesores")
def get_profesores():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id_profe, nombre_profe FROM profesor")
    data = cursor.fetchall()

    cursor.close()
    db.close()
    return data
