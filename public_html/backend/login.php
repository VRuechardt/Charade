<?php

include("db.php");

if(isset($_POST["auth"])) {
    $auth = $_POST["auth"];
    $res = mysqli_query($link, "SELECT * FROM users WHERE auth = '$auth'");
    if(mysqli_num_rows($res) > 0) {
        $row = mysqli_fetch_object($res);
        echo "{\"success\": 1, \"auth\": \"$auth\", \"email\": \"$row->email\"}";
    } else {
        echo "{\"error\": 1}";
    }
}