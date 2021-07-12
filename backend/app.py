import flask
from db import DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT
import psycopg2
from flask import jsonify, request

# POSTGRES DATABASE
def db_setup():
    try:
        conn = psycopg2.connect(database=DB_NAME, user=DB_USER, 
            password=DB_PASS, host=DB_HOST, port=DB_PORT)
        print("Database connected")
    except:
        print("Database not connected successfully")

    # Create the Application table to store all applications. If already exists, then don't
    # do anything on server start
    cur = conn.cursor()
    cur.execute("""

    CREATE TABLE IF NOT EXISTS Application
    (
        ID SERIAL PRIMARY KEY,
        STATE TEXT NOT NULL,
        COMPANY TEXT NOT NULL,
        POSITION TEXT NOT NULL,
        NOTES TEXT
    )

    """)
    conn.commit()
    print("Application table created successfully")
    cur.close()
    conn.close()
    print("Database successfully closed")

def create_dummy_data():
    insert_sql = """
        INSERT INTO Application (STATE, COMPANY, POSITION, NOTES)
        VALUES(%s, %s, %s, %s) RETURNING ID AS app_id;
    """
    try:
        conn = psycopg2.connect(database=DB_NAME, user=DB_USER, 
            password=DB_PASS, host=DB_HOST, port=DB_PORT)
        print("Database connected")
    except:
        print("Database not connected successfully")
    
    cur = conn.cursor()
    cur.execute(insert_sql, ("Interested", "Google", "Bitch", ""))
    # Get the generated id back for this application
    app_id = cur.fetchone()[0]
    print("New data inserted successfully with id: ", app_id)

    conn.commit()
    cur.close()
    conn.close()


# SET UP THE FLASK SERVER AND POSTGRESQL DB
app = flask.Flask(__name__)
app.config['DEBUG'] = True
db_setup()
# create_dummy_data()

@app.route("/api/v1/applications/all", methods=['GET'])
def get_all_apps():
    # Get all applications from the database
    print("GETTING ALL APPLICATIONS")
    query_all_sql = """
        SELECT ID, STATE, COMPANY, POSITION, NOTES 
        FROM Application
    """
    try:
        conn = psycopg2.connect(database=DB_NAME, user=DB_USER, 
            password=DB_PASS, host=DB_HOST, port=DB_PORT)
        print("Database connected")
    except:
        print("Database not connected successfully")
    
    cur = conn.cursor()
    cur.execute(query_all_sql)

    # Fetch the data from the database
    rows = cur.fetchall()
    all_apps = []
    for data in rows:
        curr_app = {
            'id': data[0],
            'state': data[1],
            'company': data[2],
            'position': data[3],
            'notes': data[4]
        }
        all_apps.append(curr_app)

    cur.close()
    conn.close()

    return jsonify(all_apps)

@app.route("/api/v1/applications/create", methods=['POST'])
def create_app():
    print("CREATING NEW APPLICATION")
    new_app_data = request.json
    print(new_app_data)
    insert_sql = """
        INSERT INTO Application (STATE, COMPANY, POSITION, NOTES)
        VALUES(%s, %s, %s, %s) RETURNING ID AS app_id;
    """
    try:
        conn = psycopg2.connect(database=DB_NAME, user=DB_USER, 
            password=DB_PASS, host=DB_HOST, port=DB_PORT)
        print("Database connected")
    except:
        print("Database not connected successfully")
    
    cur = conn.cursor()
    cur.execute(insert_sql, (new_app_data['state'], new_app_data['company'], 
        new_app_data['position'], new_app_data['notes']))
    # Get the generated id back for this application
    app_id = cur.fetchone()[0]
    print("New data inserted successfully with id: ", app_id)

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        'state': 'succ',
        'app_id': app_id
    })

@app.route("/api/v1/applications/update/<id>", methods=['POST'])
def update_app(id):
    print("UPDATING NEW APPLICATION WITH ID: ", id)
    app_data = request.json
    update_sql = """
        UPDATE Application
        SET STATE = %s,
            COMPANY = %s,
            POSITION = %s,
            NOTES = %s
        WHERE ID = %s
    """
    try:
        conn = psycopg2.connect(database=DB_NAME, user=DB_USER, 
            password=DB_PASS, host=DB_HOST, port=DB_PORT)
        print("Database connected")
    except:
        print("Database not connected successfully")

    cur = conn.cursor()
    cur.execute(update_sql, (app_data['state'], app_data['company'], app_data['position'], 
        app_data['notes'], id))
    print("APPLICATION WITH ID, ", id, ", SUCCESSFULLY UPDATED")

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        'state': 'succ',
        'app_id': id
    })

app.run()
