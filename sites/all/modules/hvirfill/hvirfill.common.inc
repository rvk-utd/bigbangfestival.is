<?php

    // ajax error output
 
    function hvirfill_json_error_output($error) {
        drupal_add_http_header('Status', '400 Bad Request');
        drupal_json_output(array('error' => $error));
    }

    // test id

    function hvirill_valid_id($hvirfill_id) {
        return (bool) preg_match('/^[a-f0-9]{24}$/', $hvirfill_id);
    }

    // token

    function hvirfill_set_token() {
        $token = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 10);
        $_SESSION['hvirfill_token'] = $token;
        return $token;
    }

    function hvirfill_get_token() {
        if (isset($_SESSION['hvirfill_token']))
            return $_SESSION['hvirfill_token'];
        return '';
    }

    function hvirfill_test_token() {
        if (!isset($_POST['token']))
            return false;
        if ($_POST['token'] != $_SESSION['hvirfill_token'])
            return false;
        return true;
    }

?>