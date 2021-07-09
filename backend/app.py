import flask
from flask import jsonify, request

app = flask.Flask(__name__)
app.config['DEBUG'] = True

applications = [
    {
        'id': 0,
        'state': 'Interested',
        'company': 'Google',
        'position': 'Software Engineer'
    },
    {
        'id': 1,
        'state': 'Applied',
        'company': 'Apple',
        'position': 'Software Engineer'
    },
    {
        'id': 2,
        'state': 'Interested',
        'company': 'Google',
        'position': 'AI/ML Engineer'
    },
    {
        'id': 3,
        'state': 'In progress',
        'company': 'Facebook',
        'position': 'R&D Engineer'
    }
]

@app.route("/api/v1/applications/all", methods=['GET'])
def get_all_apps():
    return jsonify(applications)

@app.route("/api/v1/applications/interested", methods=['GET'])
def get_interested_apps():
    int_apps = []
    # Filter through the applications list to find only interested apps
    for a in applications:
        if a['state'] == 'interested':
            int_apps.append(a)
    return jsonify(int_apps)

@app.route("/api/v1/applications/create", methods=['POST'])
def create_app():
    data = request.form

@app.route("/api/v1/applications/update", methods=['POST'])
def update_app():
    data = request.form
    print(data)

app.run()
