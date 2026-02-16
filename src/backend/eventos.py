from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔹 Conexión a Supabase
DATABASE_URL = os.getenv("DATABASE_URL")
print("DATABASE_URL:", DATABASE_URL)


def get_connection():
    return psycopg2.connect(DATABASE_URL)


# ===============================
# GET TODOS LOS EVENTOS
# ===============================
@app.route("/api/eventos", methods=["GET"])
def get_eventos():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM eventos ORDER BY id_event;")
    rows = cur.fetchall()

    eventos = []
    for row in rows:
        eventos.append({
            "id_event": row[0],
            "name_event": row[1],
            "id_building": row[2],
            "timedate_event": row[3],
            "status_event": row[4],
            "id_profe": row[5],
            "id_user": row[6]
        })

    cur.close()
    conn.close()

    return jsonify(eventos)


# ===============================
# GET EVENTO POR ID
# ===============================
@app.route("/api/eventos/<int:id>", methods=["GET"])
def get_evento(id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM eventos WHERE id_event = %s;", (id,))
    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        return jsonify({"error": "Evento no encontrado"}), 404

    evento = {
        "id_event": row[0],
        "name_event": row[1],
        "id_building": row[2],
        "timedate_event": row[3],
        "status_event": row[4],
        "id_profe": row[5],
        "id_user": row[6]
    }

    return jsonify(evento)


# ===============================
# CREAR EVENTO
# ===============================
@app.route("/api/eventos", methods=["POST"])
def create_evento():
    data = request.json
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO eventos (name_event, id_building, timedate_event, id_profe, id_user)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id_event;
    """, (
        data.get("name_event"),
        data.get("id_building"),
        data.get("timedate_event"),
        data.get("id_profe"),
        data.get("id_user")
    ))

    new_id = cur.fetchone()[0]
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"message": "Evento creado", "id_event": new_id}), 201


# ===============================
# ACTUALIZAR EVENTO
# ===============================
@app.route("/api/eventos/<int:id>", methods=["PUT"])
def update_evento(id):
    data = request.json
    conn = get_connection()
    cur = conn.cursor()

    # Asegurar que status_event sea un número
    status_value = data.get("status_event")
    if isinstance(status_value, str):
        status_value = 1 if status_value in ["Activo", "1"] else 0

    cur.execute("""
        UPDATE eventos
        SET name_event = %s,
            id_building = %s,
            timedate_event = %s,
            id_profe = %s,
            id_user = %s,
            status_event = %s
        WHERE id_event = %s
        RETURNING id_event;
    """, (
        data.get("name_event"),
        data.get("id_building"),
        data.get("timedate_event"),
        data.get("id_profe"),
        data.get("id_user"),
        status_value,
        id
    ))

    updated = cur.fetchone()
    conn.commit()

    cur.close()
    conn.close()

    if not updated:
        return jsonify({"error": "Evento no encontrado"}), 404

    return jsonify({"message": "Evento actualizado"})


# ===============================
# ELIMINAR EVENTO
# ===============================
@app.route("/api/eventos/<int:id>", methods=["DELETE"])
def delete_evento(id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM eventos WHERE id_event = %s RETURNING id_event;", (id,))
    deleted = cur.fetchone()
    conn.commit()

    cur.close()
    conn.close()

    if not deleted:
        return jsonify({"error": "Evento no encontrado"}), 404

    return jsonify({"message": "Evento eliminado"})


# ===============================
# GET USUARIOS
# ===============================
@app.route("/api/usuarios", methods=["GET"])
def get_usuarios():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id_user, name_user FROM usuarios ORDER BY name_user;")
    rows = cur.fetchall()

    usuarios = []
    for row in rows:
        usuarios.append({
            "id_user": row[0],
            "name_user": row[1]
        })

    cur.close()
    conn.close()

    return jsonify(usuarios)


# ===============================
# GET EDIFICIOS
# ===============================
@app.route("/api/edificios", methods=["GET"])
def get_edificios():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id_building, name_building FROM edificios ORDER BY name_building;")
    rows = cur.fetchall()

    edificios = []
    for row in rows:
        edificios.append({
            "id_building": row[0],
            "name_building": row[1]
        })

    cur.close()
    conn.close()

    return jsonify(edificios)


# ===============================
# GET PROFESORES
# ===============================
@app.route("/api/profesores", methods=["GET"])
def get_profesores():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id_profe, nombre_profe FROM profesor ORDER BY nombre_profe;")
    rows = cur.fetchall()

    profesores = []
    for row in rows:
        profesores.append({
            "id_profe": row[0],
            "nombre_profe": row[1]
        })

    cur.close()
    conn.close()

    return jsonify(profesores)


if __name__ == "__main__":
    app.run(debug=True)


