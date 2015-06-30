<?php

$link = mysqli_connect("localhost", "root", "", "charade");

if(isset($_POST["auth"])) {
    $auth = $_POST["auth"];
    if(mysqli_num_rows(mysqli_query($link, "SELECT * FROM users WHERE auth = '$auth'")) > 0) {
        echo "{\"success\": 1, \"auth\": \"$auth\"}";
    }
}