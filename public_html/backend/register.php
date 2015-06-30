<?php

$link = mysqli_connect("localhost", "root", "", "charade");

if(isset($_POST["password"]) && isset($_POST["email"]) && isset($_POST["username"])) {
    
    $username = $_POST["username"];
    $pwd = hash("sha256", $_POST["password"]);
    $email = $_POST["email"];
    $auth = bin2hex(openssl_random_pseudo_bytes(16));
    
    $res = mysqli_query($link, "SELECT * FROM users WHERE email = '$email'");
    if(mysqli_num_rows($res) > 0) {
        $res = mysqli_query($link, "SELECT * FROM users WHERE email = '$email' AND password = '$pwd'");
        if(mysqli_num_rows($res) == 1) {
            mysqli_query($link, "UPDATE users SET auth = '$auth' WHERE email = '$email' AND password = '$pwd'");
            echo "{\"success\": 1, \"auth\": \"$auth\"}";
        } else {
            echo "{\"success\": 0}";
        }
    } else {
        mysqli_query($link, "INSERT INTO users (email, password, auth, name) VALUES ('$email', '$pwd', '$auth', '$username');");
        echo "{\"success\": 1, \"auth\": \"$auth\"}";
    }
    
} else {
    echo "{\"success\": 0}";
}