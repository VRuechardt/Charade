
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


$.get("views/main.html", function(data) {
    $("#container").html(data);
});

var pageData = categories;
function openPage(page, json, callback) {
    
    $.get("views/" + page + ".html", function(data) {
        
        var html = Mustache.to_html(data, json);
        $("#container").html(html);
        
        pageData = json;
        
        if(callback) {
            callback();
        }
        
    });
    
}