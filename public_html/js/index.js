

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

function openPage(page, json) {
    
    $.get("views/" + page + ".html", function(data) {
        
        var html = Mustache.to_html(data, json);
        $("#container").html(html);
        
    });
    
}