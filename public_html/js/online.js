
var selectedCategory = 0;
function setupOnline() {
    
    $("#title").text("Räume");
    
    conn.send("ROOMS");
    $("#action-button").css({display: "block"});
    $("#action-button").click(function() {
        $("#modalCreateRoom").openModal();
    });
    $("#action-button-category").click(function() {
        $("#modalSetCategory").openModal();
    });
    ownRoom = false;
    
    $($("#categoryCollection").find("a")[0]).toggleClass("active", true);
    
}

function pickCategory(i) {
    $("#category-" + selectedCategory).toggleClass("active", false);
    selectedCategory = i;
    $("#category-" + selectedCategory).toggleClass("active", true);
}

function exitOnline() {
    
    $("#action-button").css({display: "none"});
    
}

var currentRoom = false;
var conn = false;
var ownRoom = false;
function setupServer() {
    
    $("#title").text("Charade");
    
    if(!conn) {
        //conn = new WebSocket('ws://192.168.178.50:8080');
        conn = new WebSocket('ws://93.135.190.180:8080');
        var auth = localStorage.getItem("email");
        conn.onopen = function(e) {
            console.log("Connection established!");
            conn.send("AUTH\n" + auth);
        };
        conn.onerror = function(e) {
            conn = false;
            Materialize.toast('Server nicht erreichbar', 3000, "red white-text");
        };
        conn.onmessage = function(e) {
            console.log(e.data);
            
            var segments = e.data.split("\n");
            if(segments[0] === "AUTH") {
                if(segments[1] === "SUCCESS") {
                    $("#online").css({visibility: "visible"});
                } else {
                    Materialize.toast('Authentifizierungsfehler', 3000, "red white-text");
                }
            } else if(segments[0] === "CREATE") {
                if(segments[1] === "SUCCESS") {
                    $("#modalCreateRoom").closeModal();
                    ownRoom = true;
                    joinRoom(segments[2]);
                } else {
                    Materialize.toast('Name schon vergeben', 2000, "red white-text");
                }
                $("#raumname").val("");
            } else if(segments[0] === "ROOMS") {
                var roomJSON = {rooms: []};
                for(var i = 1; i < segments.length; i++) {
                    roomJSON.rooms.push({name: segments[i]});
                }
                var tmpl = '{{#rooms}}<div class="card toplevel-navigation" onclick="joinRoom(\'{{name}}\')">{{name}}</div>{{/rooms}}';
                $("#roomList").html(Mustache.to_html(tmpl, roomJSON));
            } else if(segments[0] === "IN_ROOM") {
                var memberJSON = {users: []};
                for(var i = 1; i < segments.length; i += 3) {
                    var obj = {name: segments[i], id: segments[i+1]};
                    if(segments[i+2]*1 === 1) {
                        obj.ready = 1;
                    }
                    memberJSON.users.push(obj);
                }
                var tmpl = '{{#users}}<div class="card toplevel-navigation {{#ready}}player-ready{{/ready}}{{^ready}}player-waiting{{/ready}}">{{name}}</div>{{/users}}';
                $("#roomList").html(Mustache.to_html(tmpl, memberJSON));
            } else if(segments[0] === "START") {
                if(segments.length > 1 && segments[1] === "ERROR") {
                    Materialize.toast('Alle Spieler müssen bereit sein', 2000, "red white-text");
                } else {
                    startOnlineGame();
                }
            } else if(segments[0] === "WORD") {
                $("#onlineWord").html(segments[1]);
            }
            
        };
        
    } else {
        
        $("#online").css({visibility: "visible"});
        
    }
    
}

function createRoom() {
    
    var name = $("#raumname").val().trim();
    if(name === "") {
        Materialize.toast('Gib einen Namen ein', 2000, "red white-text");
    } else {
        conn.send("CREATE\n" + name);
    }
    
}

function joinRoom(name) {
    
    $("#title").text(name);
    $("#quit-room").css({display: "block"});
    $("#navigation-back").css({display: "none"});
    if(ownRoom) {
        $("#startOnlineGame").css({display: "block"});
        $("#readyOnlineGame").css({display: "none"});
        $("#action-button-category").css({display: "block"});
    } else {
        $("#readyOnlineGame").css({display: "block"});
        $("#startOnlineGame").css({display: "none"});
    }
    $("#action-button").css({display: "none"});
    currentRoom = name;
    conn.send("JOIN_ROOM\n" + name);
    
}

function quitRoom() {
    
    ownRoom = false;
    $("#title").text("Räume");
    $("#startOnlineGame").css({display: "none"});
    $("#readyOnlineGame").css({display: "none"});
    $("#action-button-category").css({display: "none"});
    $("#action-button").css({display: "block"});
    $("#quit-room").css({display: "none"});
    $("#navigation-back").css({display: "block"});
    conn.send("QUIT_ROOM\n" + currentRoom);
    currentRoom = "";
    conn.send("ROOMS");
    
}

function getRooms() {
    
    conn.send("ROOMS");
    
}

function requestReady() {
    
    conn.send("READY\n" + currentRoom);
    
}

function requestStartGame() {
    conn.send("START\n" + currentRoom);
}

var onlineStartCountdown = 5;
function startOnlineGame() {
    
    if(ownRoom) {
        var send = "CATEGORY\n" + currentRoom;
        var cat = categories.categories[selectedCategory];
        for(var i in cat.words) {
            send += "\n" + cat.words[i].name;
        }
        conn.send(send);
    }
    
    $("#startCountdown").fadeIn();
    onlineStartCountdown = 5;
    var count = function() {
        onlineStartCountdown--;
        $($("#startCountdown").find("div")[1]).text(onlineStartCountdown);
        if(onlineStartCountdown > 0) {
            window.setTimeout(count, 1000);
        } else {
            $("#startCountdown").fadeOut();
            openPage("playOnline", {}, setupPlayOnline, false, exitPlayOnline);
        }
    };
    window.setTimeout(count, 1000);
    
}

function setupPlayOnline() {
    
    if(ownRoom) {
        conn.send("WORD\n" + currentRoom);
    }
    
}

function exitPlayOnline() {
    
    
    
}

function skipOnline() {
    
    conn.send("SKIP\n" + currentRoom);
    
}

function correctOnline() {
    
    conn.send("YES\n" + currentRoom);
    
}