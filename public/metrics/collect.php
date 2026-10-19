<?php
// Configuration and application code live outside the document root.
ini_set('display_errors', '0');
$collector = dirname(__DIR__, 2).'/private/analytics/collect.php';
if (!is_file($collector)) {
    header('Cache-Control: no-store');
    http_response_code(503);
    exit;
}
require $collector;
