<?php

class EventsApi {

    public static $event_server = 'https://hvirfill.reykjavik.is';
    protected $api_key;

    public $error;
    protected $max_size = 8388608;
    protected $max_size_mb = '8';
    protected $valid_mime = array(
        'image/jpeg',
        'image/png',
        'image/gif',
    );

    function __construct($api_key) {
        $this->api_key = $api_key;
    }

    protected function add_api_key($payload) {
        $payload->api_key = $this->api_key;
        return $payload;
    }

    function rest_request($path, $payload) {
        $payload = $this->add_api_key($payload);
        $json_payload = json_encode($payload);
        $headers = array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Content-Length: ' . strlen($json_payload)
        );

        $ch = curl_init(self::$event_server.'/'.$path);

        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_payload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);
        return json_decode($result);
    }

    function set_error_header() {
        header('HTTP/1.0 400 Bad Request');
    }

    function test($payload) {
        return $this->rest_request('test', $payload);
    }

    function insert($payload) {
        return $this->rest_request('insert', $payload);
    }

    function set_error($error) {
        $this->error = new stdClass();
        $this->error->error = $error;
    }

    function is_valid_image() {
        $mime = $_SERVER['CONTENT_TYPE'];
        $size = $_SERVER['CONTENT_LENGTH'];

        if (!$mime || !$size) {
            $this->set_error('invalid image');
            return false;
        }

        if (!in_array($mime, $this->valid_mime)) {
            $this->set_error('invalid image');
            return false;
        }

        if ($size > $this->max_size) {
            $this->set_error('max file size is '.$api->max_size_mb.'mb');
            return false;
        }

        return true;
    }

    function upload() {
        $ch = curl_init(self::$event_server.'/upload');

        $headers = array(
            'Accept: application/json',
            'Content-Type: image/jpeg',
            'Content-Length: ' . (string) $_SERVER['CONTENT_LENGTH'],
            'x-api-key: ' . $this->api_key
        );

        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents("php://input"));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);
        return json_decode($result);
    }

    function fetch($payload) {
        return $this->rest_request('fetch', $payload);
    }

    function set_domain($domain) {
        $this->domain = $domain;
    }

    function fetch_upload() {
        $ext = '.'.substr($_SERVER['CONTENT_TYPE'], 6);
        $filename = "tmp_" . time() . rand(0, 99) . $ext;
        $filepath = 'tmp/' . $filename;
        file_put_contents($filepath, file_get_contents("php://input"));

        $url = $this->domain . '/' . $filepath;
        $payload = (object) array('url' => $url);
        $result = $this->rest_request('fetch', $payload);

        unlink($filepath);
        return $result;
    }
}

?>
