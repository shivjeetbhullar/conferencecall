from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = "thisismySECURESecretKEYSHIV"

socketio = SocketIO(app,path='collab.io', cors_allowed_origins='*')

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")

@socketio.on("start-stream")
def startstream(roomId,userId):
    emit("video-connected", userId, broadcast=True, include_self=False, to=roomId)

@socketio.on("send-peer")
def sendpeer(data):
    emit("store-peers", data, broadcast=True, include_self=False, to=data['data'][0])

@socketio.on("stop-call")
def stop_call(data):
    emit("stop-call", data, broadcast=True, include_self=False, to=data['room_id'])

@socketio.on("join-room")
def on_join_vid_room(roomId, userId):
    join_room(roomId)
    session.peerid = userId
    session.roomid = roomId
    emit("share-peers", userId, broadcast=True, to=roomId)

@socketio.on("disconnect")
def disconnect_vid():
    emit("vpeer-disconnect", session.peerid, broadcast=True, to=session.roomid)

if __name__ == "__main__":
    socketio.run(app,host='0.0.0.0', debug=True, port=5000)