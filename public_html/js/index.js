
var deviceOrientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";

window.onorientationchange = function() {
  switch(window.orientation) {
    case 0:
      deviceOrientation = "portrait";
      break;
    case 90:
      deviceOrientation = "landscape";
      break;
    case -90:
      deviceOrientation = "reverse landscape";
      break;
    case 180:
      deviceOrientation = "portrait";
      break;
  }
}

window.addEventListener("deviceorientation", function(event) {
    
    //$("#alpha").html("alpha: " + event.alpha);
    //$("#beta").html("beta: " + event.beta);
    //$("#gamma").html("gamma: " + event.gamma);
    
    
}, true);


var categories;
if(localStorage.getItem("categories")) {
    categories = JSON.parse(localStorage.getItem("categories"));
    console.log("loaded from storage");
} else {
    $.getJSON("json/words.json", function(data) {
        categories = data;
        localStorage.setItem("categories", JSON.stringify(data));
        console.log("loaded from json");
    });
}

window.applicationCache.addEventListener("error", function(e) {
  alert("Error fetching manifest: a good chance we are offline");
});

$(document).ready(function() {

    if(localStorage.getItem("auth")) {
        var auth = localStorage.getItem("auth");
        $.post("backend/login.php", "auth=" + auth, function(data) {
            console.log("data: ", data);
            if(JSON.parse(data).success == 1) {
                pages = [
                    {
                        page: "main",
                        json: {},
                        callback: setupServer
                    }
                ];
                $.get("views/main.html", function(data) {
                    $("#container").html(data);
                    setupServer();
                });
            } else {
                pages = [
                    {
                        page: "main",
                        json: {},
                        callback: setupServer
                    }
                ];
                $.get("views/register.html", function(data) {
                    $("#container").html(data);
                });
            }
        }).fail(function() {
            $.get("views/main.html", function(data) {
                $("#container").html(data);
                setupServer();
            });
        });
    } else {
    
        $.get("views/register.html", function(data) {
            $("#container").html(data);
        });
        
    }
});


var pages = [
    {
        page: "register",
        json: {},
        callback: undefined,
        exit: undefined
    }
];
var pageData = categories;
function openPage(page, json, callback, back, exit) {
    
    if(pages[pages.length-1].exit) {
        pages[pages.length-1].exit();
    }
    
    if(!back) {
        pages.push({
            page: page,
            json: json,
            callback: callback,
            exit: exit
        });
    }
    
    if((pages.length > 2 && back) || (pages.length > 1 && !back)) {
        $("#navigation-back").fadeIn();
    } else {
        $("#navigation-back").fadeOut();
    }
    
    $.get("views/" + page + ".html", function(data) {
        
        var html = Mustache.to_html(data, json);
        $("#container").html(html);
        
        pageData = json;
        
        if(callback) {
            callback();
        }
        
    });
    
}

function back() {
    var data = pages[pages.length-2];
    openPage(data.page, data.json, data.callback, true, data.exit);
    pages.pop();
}

function register() {
    var username = $("#username").val().trim();
    var email = $("#email").val().trim();
    var pwd = $("#password").val();
    
    if(email !== "" && pwd !== "" && username !== "") {
        $.post("backend/register.php", "email=" + email + "&password=" + pwd + "&username=" + username, function(data) {
            var parsed = JSON.parse(data);
            if(parsed.success == 1) {
                localStorage.setItem("auth", parsed.auth);
                localStorage.setItem("email", parsed.email);
                pages = [
                    {
                        page: "main",
                        json: {},
                        callback: setupServer
                    }
                ];
                $.get("views/main.html", function(data) {
                    $("#container").html(data);
                    setupServer();
                });
            } else {
                Materialize.toast('Falsches Passwort / Email schon vergeben', 4000, "red white-text");
            }
        });
    } else {
        Materialize.toast('Geben Sie Benutzername, E-Mail und Passwort ein', 4000, "red white-text");
    }
}

