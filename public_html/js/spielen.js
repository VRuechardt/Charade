
var defaultGameTime = 20;

var tmpWords = [];
var answered = [];
var currentWord;
var gameTimeLeft = defaultGameTime;

var colorLocked = false;
function setupSpielen() {
    
    tmpWords = pageData.words.slice(0);
    answered = [];
    gameTimeLeft = defaultGameTime;
    currentWord = randomWord(tmpWords);
    $("#wordSpielen").html(currentWord.name);
    $("#header").css({backgroundColor: "rgba(0, 0, 0, 0)"});
    $("#container").css({height: "100vh", marginTop: "-90px", pointerEvents: "none"});
    window.setTimeout(countdown, 1000);
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    
    window.addEventListener("deviceorientation", function(event) {

        if(90 - Math.abs(event.gamma) < 20) {
            colorLocked = false;
        }

        if(!colorLocked) {

            var percent = (90 - Math.abs(event.gamma)) / 90;
            if(deviceOrientation === "landscape") {
                if(event.gamma > 0) {
                    $("#spielenContainer").css({backgroundColor: "rgba(255, 0, 0, " + percent + ")"});
                    if(event.gamma < 10) {
                        nextWord(false);
                    }
                } else {
                    $("#spielenContainer").css({backgroundColor: "rgba(0, 255, 0, " + percent + ")"});
                    if(event.gamma > -10) {
                        nextWord(true);
                    }
                }
            } else if(deviceOrientation === "reverse landscape") {
                if(event.gamma > 0) {
                    $("#spielenContainer").css({backgroundColor: "rgba(0, 255, 0, " + percent + ")"});
                    if(event.gamma < 10) {
                        nextWord(true);
                    }
                } else {
                    $("#spielenContainer").css({backgroundColor: "rgba(255, 0, 0, " + percent + ")"});
                    if(event.gamma > -10) {
                        nextWord(false);
                    }
                }
            }
            
        }

    }, true);
    
}

function exitSpielen() {
    
    $("#header").animate({backgroundColor: "#555"}, function() {
        $("#container").css({height: "calc(100vh - 90px)", marginTop: "0", pointerEvents: ""});
    });
    
}

function nextWord(correct) {
    
    if(correct) {
        navigator.vibrate([1000]);
    } else {
        navigator.vibrate([100, 100, 100, 100, 100]);
    }
    
    colorLocked = true;
    $("#spielenContainer").css({backgroundColor: "rgba(0, 0, 0, 0)"});
    
    currentWord.wasCorrect = correct;
    answered.push(currentWord);
    
    currentWord = randomWord(tmpWords);
    $("#wordSpielen").html(currentWord.name);
    
}

function randomWord(arr) {
    var n = Math.floor(Math.random() * arr.length);
    arr.splice(n, 1);
    return arr.splice(n, 1)[0];
}

function countdown() {
    
    if(deviceOrientation !== "portrait") {
        gameTimeLeft--;
        $("#countdown").html(gameTimeLeft);
        if(gameTimeLeft <= 0) {
            openPage("review", {"answered": answered, "allWords": pageData});
        } else {
            window.setTimeout(countdown, 1000);
        }
    } else {
        window.setTimeout(countdown, 1000);
    }
    
}