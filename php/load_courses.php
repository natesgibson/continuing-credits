<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header("Content-type: application/json");

    try {
        $db = get_PDO();
        $mysql = "SELECT * FROM courses WHERE is_live = 1;";
        $courses = $db->query($mysql)->fetchAll();
        echo json_encode($courses);
    } catch(PDOException $ex) {
        throw_error("Error: database query failed.", $ex);
    }

    function get_PDO() {
        $host =  "";
        $port = "";
        $username = "";
        $password = "";
        $dbname = "";

        $ds = "mysql:host={$host}:{$port};dbname={$dbname};charset=utf8";
        try {
            $db = new PDO($ds, $username, $password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $db;
        } catch (PDOException $ex) {
            throw_error("Error: database connection failed.", $ex);
        }
    }

    function throw_error($msg, $ex=NULL) {
        header("HTTP/1.1 400 Invalid Request");
        header("Content-type: text/plain");
        print ("{$msg}\n");
        if ($ex) {
            print ("Error details: $ex \n");
        }
    }
?>
