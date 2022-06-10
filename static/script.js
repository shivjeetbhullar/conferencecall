"use strict";
$('#menu').css("right", "-300px");
$('.menu_icon').on('click', function() {
    if ($('#vid_cion').hasClass('open')) {
        $('#vid_cion').removeClass('open');
        $('#vid_cion').animate({ "right": "100px", "background-position": "0px" }, 180);
        $('#vid_cion').animate({ "right": "300px", "background-position": "-40px" }, 180);
        $('.menu_icon').animate({ "right": "100px", "background-position": "0px" }, 180);
        $('.menu_icon').animate({ "right": "300px", "background-position": "-40px" }, 180);
        $('#vidcon').animate({ "right": "-306px" });
    }
    if ($('.menu_icon').hasClass('open')) {
        $(this).removeClass('open');
        $(this).animate({
            "right": "0px",
            "background-position": "0px"
        });
        $('#menu').animate({ "right": "-306px" });
        $('#maincon').animate({
            "right": "5px"
        });
        $('#vid_cion').animate({
            "right": "0px",
            "background-position": "0px"
        });
        $('#maincon').width($('#maincon').width() + 302)
            // editor.resize()
    } else {
        $(this).addClass('open');
        $(this).animate({
            "right": "300px",
            "background-position": "-40px"
        });
        $('#vid_cion').animate({
            "right": "300px",
            "background-position": "-40px"
        });
        $('#menu').animate({ "right": "0px" });
        $('#maincon').width($('#maincon').width() - 302)
            // editor.resize()
        $('#maincon').animate({
            "right": "306px",
        });
    }
});

$('#vidcon').css("right", "-300px");
$('.vid_cion').on('click', function() {
    if ($('.menu_icon').hasClass('open')) {
        $('.menu_icon').removeClass('open');
        $('#vid_cion').animate({ "right": "100px", "background-position": "0px" }, 180);
        $('#vid_cion').animate({ "right": "300px", "background-position": "-40px" }, 180);
        $('.menu_icon').animate({ "right": "100px", "background-position": "0px" }, 180);
        $('.menu_icon').animate({ "right": "300px", "background-position": "-40px" }, 180);
        $('#menu').animate({ "right": "-306px" });
    }
    if ($('.vid_cion').hasClass('open')) {
        $(this).removeClass('open');
        $(this).animate({
            "right": "0px",
            "background-position": "0px"
        });
        $('#vidcon').animate({ "right": "-306px" });
        $('#maincon').animate({
            "right": "5px"
        });
        $('.menu_icon').animate({
            "right": "0px",
            "background-position": "0px"
        });
        $('#maincon').width($('#maincon').width() + 302)
            //editor.resize()
    } else {
        $(this).addClass('open');
        $(this).animate({
            "right": "300px",
            "background-position": "-40px"
        });
        $('.menu_icon').animate({
            "right": "300px",
            "background-position": "-40px"
        });
        $('#vidcon').animate({ "right": "0px" });
        $('#maincon').width($('#maincon').width() - 302)
            //editor.resize()
        $('#maincon').animate({
            "right": "306px",
        });
    }
});




////////////////////////////////////
var myVideo;
var videoMuted = true;
var audioMuted = true;
var cam_allowed = false;
var media_options = {
    audio: false,
    video: false
};

document.addEventListener("DOMContentLoaded", (event) => {
    myVideo = document.getElementById("local_video");
    myVideo.onloadeddata = () => { console.log("W,H: ", myVideo.videoWidth, ", ", myVideo.videoHeight); };
    var mic_btn = document.getElementById("micbtn");
    var vid_btn = document.getElementById("vidbtn");

    mic_btn.addEventListener("click", (event) => {
        setAudioState(!audioMuted);
        setservercon()
    });
    vid_btn.addEventListener("click", (event) => {
        setVideoState(!videoMuted);
        setservercon()
    });
    //startCamera(media_options);
});


function adduservideo(vid_strm, user_name, call, user_id) {
    let vid_div = document.createElement("div");
    let video = document.createElement("video");
    let name_span = document.createElement("span");

    vid_div.id = "div_" + user_id;
    video.id = "vid_" + user_id;
    vid_div.className = "uservid";
    name_span.className = "username_vid";
    name_span.innerText = user_name;

    vid_div.appendChild(name_span);
    vid_div.appendChild(video);
    video.srcObject = vid_strm
    video.addEventListener('loadedmetadata', () => {
        setTimeout(function() { video.play() }, 2000);
    })
    call.on('close', () => {
        video.remove()
        vid_div.remove()
    })
    document.querySelector('.callbar').appendChild(vid_div)
}

function removeuservideo(user_id) {
    let vid = document.getElementById("vid_" + user_id);
    if (vid.srcObject) {
        vid.srcObject.getTracks().forEach(track => track.stop());
    }
    vid.removeAttribute("srcObject");
    vid.removeAttribute("src");
    document.getElementById("div_" + user_id).remove();
}

function setAudioState(flag) {
    let local_stream = myVideo.srcObject;
    document.getElementById("micic").innerText = (flag) ? "mic_off" : "mic";
    if (flag) {
        local_stream.getAudioTracks().forEach((track) => {
            media_options.audio = false
            track.enabled = !flag;
            track.stop()
            cam = false
            audioMuted = true;
        });
    } else {
        media_options.audio = true;
        startCamera(media_options)
        audioMuted = false;

    }
}

function setVideoState(flag) {
    let local_stream = myVideo.srcObject;
    document.getElementById("vidicm").innerText = (flag) ? "videocam_off" : "videocam";
    if (flag) {
        local_stream.getVideoTracks().forEach((track) => {
            track.enabled = !flag;
            media_options.video = false;
            track.stop()
            videoMuted = true;
            cam = false
        });
    } else {
        media_options.video = { height: 360 };
        videoMuted = false;
        startCamera(media_options)

    }
}
var local_str = null;
var peer_calls = {}
var peer_list = {}
var peer = new Peer();
var cam = false;

function startCamera(media_options) {
    navigator.mediaDevices.getUserMedia(media_options)
        .then((stream) => {
            myVideo.srcObject = stream;
            local_str = stream
            cam = true
            createcall(stream)
        })
        .catch((e) => {
            console.log("Error! ", e);
            alert("Unable to access Cam or Mic! ");
        });
}

peer.on('open', function(id) {
    socket.emit('join-room', v_room, id)
});

socket.on("share-peers", userId => {
    socket.emit('send-peer', { data: [v_room, peer.id, user_n] })
})

socket.on("store-peers", data => {
    let ud = data['data']
    peer_list[ud[1]] = ud[2]
    if (cam && !(ud[1] in peer_calls)) {
        peer.call(ud[1], myVideo.srcObject)
    }
    console.log('new-user')
})

function createcall(stream) {
    for (let x in peer_list) {
        var call = peer.call(x, stream)
    }
}


peer.on('call', call => {
    if ($('#div_' + call.peer).length == 0) {
        call.answer()
        call.on('stream', userVideoStream => {
            adduservideo(userVideoStream, peer_list[call.peer], call, call.peer)
        })
        peer_calls[call.peer] = call
    }
})

socket.on("vpeer-disconnect", peerid => {
    console.log('vpeer-disconnect ', peerid)
    try {
        peer_calls[peerid].close()
        delete peer_calls[peerid]
    } catch (err) {}
    delete peer_list[peerid]
})

socket.on("stop-call", data => {
    peer_calls[data.peerid].close()
})


function setservercon() {
    if (audioMuted && videoMuted) {
        socket.emit("stop-call", { "room_id": v_room, 'name': user_n, 'peerid': peer.id });
    }
}