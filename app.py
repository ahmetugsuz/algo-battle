from flask import Flask, redirect, jsonify, request, make_response, Response, session
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin # deploy
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import random, time
"""
app = Flask(__name__, static_folder='my-app/build', static_url_path='/static')
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://b9de329fa96869:edb01807@us-cdbr-east-06.cleardb.net/heroku_131b1afcdbd2c42?'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'algobattle'
app.config['CORS_HEADERS'] = 'Content-Type'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
"""

# Create Flask app
app = Flask(__name__, static_folder='my-app/build', static_url_path='/static')
CORS(app)
app.config['SECRET_KEY'] = 'algobattle'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure local MySQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:mysql@localhost/algobattle'





# Initialize SQLAlchemy and migration
db = SQLAlchemy(app)
migrate = Migrate(app, db)

ENEMIES_PLAYED = []
GAME_BOARD = []
ALL_CLICKED = []
ALGORITME = ""
ANTALL_BOKS = 0
TOTAL_POINTS = 0
ANSWER = 7
KONSTANT_VALG = 1
MIDLERTIDIG_TALL = 1
SJEKK_DATA = 0

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(80), unique=True, nullable=False)
  points = db.Column(db.Integer, nullable=False)

  def __init__(self, username, points):
    self.username = username
    self.points = points


@app.route("/")
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/lets_begin", methods=['POST'])
@cross_origin()
def restart_and_to_optionpage():   
    restart()
    control_receives()
    return jsonify({"enemies_played":ENEMIES_PLAYED})


@app.route("/algoritme_data", methods=['POST'])
@cross_origin()
def start_game():
    data = request.get_json()

    global ALGORITME
    global ANTALL_BOKS
    global ENEMIES_PLAYED
    global GAME_BOARD
    global TOTAL_POINTS
    GAME_BOARD.clear()
    ANTALL_BOKS = 0

    ANTALL_BOKS = data["antall"]
    ALGORITME = str(data["algoritme"])
    ENEMIES_PLAYED.append(data["algoritme"]) 

    for enemie in data["enemies_played"]:
        if enemie not in ENEMIES_PLAYED:
            print("Error at ENEMIES PLAYED!! the enemies played doesent match")
            ENEMIES_PLAYED.append(enemie)

    """
    if data["total_points"] != TOTAL_POINTS:
        print("Error at POINTS!! the points doesent match")
        print("Points received from client: ", data["total_points"])
        print("Points received from server: ", TOTAL_POINTS)
        TOTAL_POINTS = int(data["total_points"])
    """

    if (len(data["enemies_played"]) == 3):
        ENEMIES_PLAYED.clear()
    #control_receives() # kontrollerer om data har blitt satt fra API - client side
    lag_game_board() # Lager game board som det skal bli spilt på

    data = jsonify({})
    data.status_code = 200
    return data



@app.route('/arena')
@cross_origin()
def arena():
    global ALGORITME
    global ENEMIES_PLAYED

    game_board = []
    [game_board.append(i) for i in range(1, int(ANTALL_BOKS)+1)]
    valgte_elementer = []

    if ALGORITME == "Tesla":
        [valgte_elementer.append(i) for i in range(0, len(GAME_BOARD))]
    elif ALGORITME == "Alan":
        valgte_elementer = lag_binary_list()
    elif ALGORITME == "Kidy":
        valgte_elementer = lag_random_liste()

    if len(game_board) == 0:
        [game_board.append(i) for i in range(1, int(ANTALL_BOKS)+1)]

    control_receives()

    response = make_response(jsonify({"gameboard": game_board, "algorithm": ALGORITME, "answer": ANSWER, "valgte_elementer": valgte_elementer, "enemies_played": ENEMIES_PLAYED}))
    #response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    #response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response



@app.route('/last_standing')
@cross_origin()
def midlertidig_data():
    response = make_response(jsonify({"total_points": TOTAL_POINTS, "enemies_played": ENEMIES_PLAYED}))
    print("response", response, ", ENEMIES PLAYED: ", ENEMIES_PLAYED)
    #response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    #response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    response.headers["Content-Type"] = "application/json"
    return response



@app.route('/round_results', methods=['POST'])
@cross_origin()
def round_end():
    data = request.get_json()
    reset_to_new_game()

    global TOTAL_POINTS

    TOTAL_POINTS = TOTAL_POINTS + int(data["poeng"])
    print("Total poeng er: ", TOTAL_POINTS)
    response = jsonify({"total_points": TOTAL_POINTS})
    response.status_code = 200
    return response


@app.route('/register_user_points', methods=['POST'])
@cross_origin()
def register_user():
    data = request.get_json()
    session.permanent = True
    session["username"] = data["username"]
    session["points"] = int(data["total_points"])
    new_user = User(username=session["username"], points=session["points"])
    db.session.add(new_user)
    db.session.commit()
    return jsonify("success")

@app.route('/retrieve_database')
@cross_origin()
def get_database():
  # Retrieve all rows from the table with 'username' and 'points' columns
  # Execute a SQL query
  query = User.query.order_by(User.points.desc()).all() # henter ut data med order, fra hoyest poeng til lavest
  
  # Retrieve the data
  data = query

  # Format the data as a list of dictionaries
  data_dict = [{"username": row.username, "points": row.points} for row in data]

  # Close the connection
  ...
  # Send the data to the client
  return jsonify(data_dict)

@app.route('/retrieve_all_users')
def get_users_db():
    query = User.query.all()

    usernames = [user.username.lower() for user in query]

    return jsonify(usernames)



def lag_game_board():
    print("DEBUG: making game board")
    global GAME_BOARD
    global ANSWER 
    global MIDLERTIDIG_TALL

    board_storrelse = int(ANTALL_BOKS)
    ANSWER = random.randint(1, board_storrelse)
    box_number = 1
    for i in range(board_storrelse): # it could be range(1, length) but it gave som error
        GAME_BOARD.append(box_number)
        box_number += 1

def reset_to_new_game():
    global ALL_CLICKED
    global ALGORITME
    global GAME_BOARD
    global ANTALL_BOKS
    global ANSWER
    global KONSTANT_VALG

    ALL_CLICKED.clear()
    ALGORITME = ""
    GAME_BOARD.clear()
    ANTALL_BOKS = 0
    ANSWER = 7
    KONSTANT_VALG = 1

def restart():
    global ENEMIES_PLAYED
    global ALGORITME
    global ANTALL_BOKS
    global TOTAL_POINTS
    global KONSTANT_VALG
    global ALL_CLICKED
    global GAME_BOARD


    ENEMIES_PLAYED.clear()
    ALGORITME = ""
    ANTALL_BOKS = 0
    TOTAL_POINTS = 0
    KONSTANT_VALG = 1
    ALL_CLICKED.clear()
    GAME_BOARD.clear()


def lag_binary_list():
    low = 0
    high = len(GAME_BOARD)
    binary_list = [0] # first element is 0 because its starting from inedex 1
    while low <= high:
        mid = (low + high) // 2
        binary_list.append(mid)

        if GAME_BOARD[mid] < ANSWER:
            low = mid +1
        
        elif GAME_BOARD[mid] > ANSWER:
            high = mid -1
        
        else:
            binary_list.append(ANSWER)
            return binary_list
        
    return binary_list
    
def lag_random_liste():
    random_liste = [0] # first element is 0 because its starting from inedex 1
    while len(random_liste) <= len(GAME_BOARD):
        selected_number = random.randint(1, len(GAME_BOARD))
        while selected_number in random_liste:
            selected_number = random.randint(1, len(GAME_BOARD))
        random_liste.append(selected_number)
    return random_liste

def Tesla(valg: int):
    return valg+1     

#binary search
def Alan(start, end):
    i = (start + end) // 2
    if start <= end:
        selected_element = int(GAME_BOARD[i])
        if selected_element in ALL_CLICKED:
            if selected_element < ANSWER:
                return Alan(i + 1, end)
            else:
                return Alan(start, i - 1)
        return selected_element
    else:
        return -1


def Kidy():
    size = len(GAME_BOARD)
    tilfeldig_tall = random.randint(1, size)
    for i in ALL_CLICKED:
        if tilfeldig_tall == i:
            if len(ALL_CLICKED) < size:
                return Kidy()
            else:
                return None
    #print("Valgte tall fra Kidy er: ", tilfeldig_tall)
    control_receives()
    return tilfeldig_tall

def double_check(valgte_tall):
    for i in ALL_CLICKED:
        if int(i) == int(valgte_tall):
            print("Algoritme har valgt samme element")
            return True
    return False

def control_receives():
    print("Control API DEBUG: ENEMIES_PLAYED: ", ENEMIES_PLAYED, ", ALGORITME: ", ALGORITME,
    ", ANTALL_BOKS: ",ANTALL_BOKS, "TOTAL_POINTS: ",TOTAL_POINTS, ", ALL_CLICKED: ", ALL_CLICKED, "ANSWER:", ANSWER)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run()
