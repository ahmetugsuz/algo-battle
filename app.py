from flask import Flask, redirect, jsonify, request, make_response, Response, session
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin # deploy
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import random, time
import redis
import os
import json
# Create Flask app
app = Flask(__name__, static_folder='my-app/build', static_url_path='/')
CORS(app)

app.config['SECRET_KEY'] = 'mysql'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure local MySQL database
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:mysql@localhost/algobattle'

# Heroku Postgres URI (latest one)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://u60sb86l93kiv6:pec990bfdd7e77fa388db7b43850d46d1f6f0d5dd11f60266e69e4fb6458b7452@cdgn4ufq38ipd0.cluster-czz5s0kz4scl.eu-west-1.rds.amazonaws.com:5432/dfn1js36r6tq3f?sslmode=require'

# Initialize SQLAlchemy and migration
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Path to your CA certificate or self-signed certificate
ssl_ca_certs = '/Users/ahmettugsuz/Documents/GitHub/algorithmbattle/redis.crt'

# Initialize Redis client with SSL/TLS parameters
redis_url = os.environ.get('REDIS_URL')  # or REDIS_TLS_URL

redis_client = redis.StrictRedis.from_url(redis_url)


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

def add_enemies_played(enemy_played):
    # Add enemies played to the list in Redis
    redis_client.rpush("enemies_played", enemy_played)

def get_enemies_played():
    # Retrieve all enemies played from the list in Redis and decode them
    return [enemy.decode('utf-8') for enemy in redis_client.lrange("enemies_played", 0, -1)]

def clean_enemies_played():
    # Check if the list exists before attempting to delete it
    if redis_client.exists("enemies_played"):
        # Clean all values in redis list, it deletes the whole list
        redis_client.delete("enemies_played")
        return True
    else:
        return False

def get_variable(key):
    """
    Retrieve the value of a variable from Redis.

    Args:
        key (str): The name of the variable (Redis key).

    Returns:
        str or None: The current value of the variable, or None if the key does not exist.
    """
    value = redis_client.get(key)
    return value.decode('utf-8') if value else None

def get_integer_variable(key):
    """
    Retrieve the value of a variable from Redis.

    Args:
        key (str): The name of the variable (Redis key).

    Returns:
        int or None: The current value of the variable as an integer, or None if the key does not exist.
    """
    value = redis_client.get(key)
    return int(value) if value is not None else None

def set_variable(key, value):
    """
    Set the value of a variable in Redis.

    Args:
        key (str): The name of the variable (Redis key).
        value (str or int): The new value to set.

    Returns:
        None
    """
    redis_client.set(key, value)

def reset_variable(key):
    """
    Reset the value of a variable in Redis (set it to an empty value).

    Args:
        key (str): The name of the variable (Redis key).

    Returns:
        None
    """
    redis_client.delete(key)

def create_game_board():
    """
    Create or retrieve the game board from Redis.

    Returns:
        list: The game board (list of integers).
    """

    # Check if the game board already exists in Redis
    game_board = get_variable("game_board")
    if game_board:
        # Convert the string representation back to a list
        game_board = json.loads(game_board)
    else:
        # Create a new game board
        antall_boks = get_integer_variable("antall_boks")
        if antall_boks == None:
            start_game()
            antall_boks = get_integer_variable("antall_boks")
            if antall_boks is None:
                # Optionally handle the case where the API call fails
                raise ValueError("Failed to retrieve antall_boks from API")
            else:
                set_variable("antall_boks", antall_boks)
        else:
            game_board = list(range(1, antall_boks + 1))

        # Store the initial game board in Redis
        set_variable("game_board", json.dumps(game_board))

    return game_board


@app.route("/")
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')


@app.route("/lets_begin", methods=['POST'])
@cross_origin()
def restart_and_to_optionpage():
    try:
        # Restart and control functions
        restart()

        #cleaning up the redis list by deleting it
        clean_enemies_played()

        # controlling the values if it is correctly handled
        control_receives()

        # Retrieve enemies played from Redis
        enemies_played = get_enemies_played()
        return jsonify(enemies_played), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/algoritme_data", methods=['POST'])
@cross_origin()
def start_game():
    data = request.get_json()

    global ALGORITME
    global ANTALL_BOKS
    global GAME_BOARD

    GAME_BOARD.clear()
    #ANTALL_BOKS = 0
    #ANTALL_BOKS = data["antall"]

    set_variable("antall_boks", data["antall"])
    #ALGORITME = str(data["algoritme"])
    set_variable("algoritme", str(data["algoritme"]))

    # Adding algorithme played to Redis list
    add_enemies_played(data["algoritme"])

    """
    for enemie in data["enemies_played"]:
        if enemie not in ENEMIES_PLAYED:
            print("--DEBUG-- Error at ENEMIES PLAYED!! the enemies played doesent match")
            ENEMIES_PLAYED.append(enemie)
    
    if (len(data["enemies_played"]) == 3):
        ENEMIES_PLAYED.clear()
    """

    #control_receives() # kontrollerer om data har blitt satt fra API - client side
    #lag_game_board() # Lager game board som det skal bli spilt på
    set_answer() #setting the answer on the game_board randomly

    data = jsonify({})
    data.status_code = 200
    return data



@app.route('/arena')
@cross_origin()
def arena():
    global ALGORITME

    # Phase 1: Creating the game board
    # game_board = []
    # [game_board.append(i) for i in range(1, int(ANTALL_BOKS)+1)]
    antall_boks = get_integer_variable("antall_boks")
    if antall_boks == None:
        start_game()
        antall_boks = get_integer_variable("antall_boks")
        if antall_boks is None:
            # Optionally handle the case where the API call fails
            raise ValueError("Failed to retrieve antall_boks from API")
        else:
            set_variable("antall_boks", antall_boks)
    game_board = create_game_board()
    
    valgte_elementer = []

    algoritme = get_variable("algoritme")
    if algoritme == None:
        print("DEBUG: algoritme received from redis is None")

    if algoritme == "Tesla":
        [valgte_elementer.append(i) for i in range(0, len(game_board)+1)]
    elif algoritme == "Alan":
        valgte_elementer = lag_binary_list()
    elif algoritme == "Kidy":
        valgte_elementer = lag_random_liste()

    if len(game_board) == 0:
        [game_board.append(i) for i in range(1, antall_boks+1)]

    control_receives()
    answer = get_integer_variable("answer")
    if not answer:
        set_answer()

    response = make_response(jsonify({"gameboard": game_board, "algorithm": algoritme, "answer": answer, "valgte_elementer": valgte_elementer}))
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response



@app.route('/last_standing')
@cross_origin()
def midlertidig_data():
    control_receives()
    total_points = get_integer_variable("total_points")
    if not total_points:
        total_points = 0
    
    response = make_response(jsonify({"total_points": total_points, "enemies_played": get_enemies_played()}))
    print("response", response, ", ENEMIES PLAYED: ", get_enemies_played())
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    response.headers["Content-Type"] = "application/json"
    return response



@app.route('/round_results', methods=['POST'])
@cross_origin()
def round_end():
    data = request.get_json()
    reset_to_new_game()
    global TOTAL_POINTS

    total_points = get_integer_variable("total_points")  
    set_variable("total_points", total_points + int(data["poeng"]) if total_points is not None else int(data["poeng"]))
    response = jsonify({"total_points": total_points})
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



def set_answer():
    #print("--DEBUG-- Creating game board")
    global GAME_BOARD
    global ANSWER 
    global MIDLERTIDIG_TALL

    game_board = create_game_board()
    board_storrelse = int(len(game_board))
    answer = random.randint(1, board_storrelse)
    set_variable("answer", answer)



def reset_to_new_game():
    global ALL_CLICKED
    global ALGORITME
    global GAME_BOARD
    global ANTALL_BOKS
    global ANSWER
    global KONSTANT_VALG
    

    reset_variable("algoritme")
    reset_variable("antall_boks")
    reset_variable("game_board")
    reset_variable("answer")
    ALL_CLICKED.clear()
    ALGORITME = ""
    GAME_BOARD.clear()
    ANTALL_BOKS = 0
    ANSWER = 7
    KONSTANT_VALG = 1

def restart():
    global ALGORITME
    global ANTALL_BOKS
    global TOTAL_POINTS
    global KONSTANT_VALG
    global ALL_CLICKED
    global GAME_BOARD

    ALGORITME = ""
    reset_variable("antall_boks")
    reset_variable("algoritme")
    reset_variable("game_board")
    reset_variable("total_points")
    ANTALL_BOKS = 0
    TOTAL_POINTS = 0
    KONSTANT_VALG = 1
    ALL_CLICKED.clear()
    GAME_BOARD.clear()


def lag_binary_list():
    low = 1
    game_board = create_game_board()
    high = len(game_board)
    binary_list = [0] # first element is 0 because its starting from inedex 1
    answer = get_integer_variable("answer")
    while low <= high:
        mid = (low + high) // 2
        binary_list.append(mid)

        if game_board[mid] < answer:
            low = mid +1
        
        elif game_board[mid] > answer:
            high = mid -1
        
        else:
            binary_list.append(answer)
            return binary_list
        
    return binary_list
    
def lag_random_liste():
    game_board = create_game_board()
    random_liste = [0] # first element is 0 because its starting from index 1
    while len(random_liste) <= len(game_board):
        selected_number = random.randint(1, len(game_board))
        while selected_number in random_liste:
            selected_number = random.randint(1, len(game_board))
        random_liste.append(selected_number)
    return random_liste

def Tesla(valg: int):
    return valg+1     

#binary search
def Alan(start, end):
    game_board = create_game_board()
    i = (start + end) // 2
    answer = get_integer_variable("answer")
    if start <= end:
        selected_element = int(game_board[i])
        if selected_element in ALL_CLICKED:
            if selected_element < answer:
                return Alan(i + 1, end)
            else:
                return Alan(start, i - 1)
        return selected_element
    else:
        return -1


def Kidy():
    game_board = create_game_board()
    size = len(game_board)
    tilfeldig_tall = random.randint(1, size)
    for i in ALL_CLICKED:
        if tilfeldig_tall == i:
            if len(ALL_CLICKED) < size:
                return Kidy()
            else:
                return 0 # as Null but to not get error
    control_receives()
    return tilfeldig_tall

def double_check(valgte_tall):
    for i in ALL_CLICKED:
        if int(i) == int(valgte_tall):
            return True #Algoritme har valgt samme element
    return False

def control_receives():
    print("Control API DEBUG: ENEMIES_PLAYED: ", get_enemies_played(), ", ALGORITME: ", get_variable("algoritme"),
    ", ANTALL_BOKS: ",get_integer_variable("antall_boks"), "TOTAL_POINTS: ",get_integer_variable("total_points"), ", ALL_CLICKED: ", ALL_CLICKED, "ANSWER:", get_integer_variable("answer"))


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    #app.run()
