<?php

$link;

if($_SERVER["HTTP_HOST"] == "s582310763.online.de" || strpos($_SERVER["HTTP_HOST"], "harades.de") > 0) {
    
    $host_name  = "db582319613.db.1and1.com";
    $database   = "db582319613";
    $user_name  = "dbo582319613";
    $password   = "schokolade";

    $link = mysqli_connect($host_name, $user_name, $password, $database);
    
} else {
    
    $link = mysqli_connect("localhost", "root", "", "charade");
    
}