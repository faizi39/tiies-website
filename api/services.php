<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Allow simple CORS for local testing
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$fallback = [
    ['key' => 'basic-computer', 'title' => 'Basic Computer Courses', 'text' => 'Master digital basics: typing, file management, internet safety, email, MS Word, Excel, and PowerPoint. Ideal for students, job seekers, and beginners.', 'link' => 'basic-computer.html'],
    ['key' => 'skills-programme', 'title' => 'Skills Development Programme', 'text' => 'Choose focused tracks like Graphic Design, Web Development, Digital Marketing, Video Editing, and Office Productivity with real projects.', 'link' => 'skills-development.html'],
    ['key' => 'earn-online', 'title' => 'Earn Money Online with Digital Skills', 'text' => 'Learn practical strategies to monetize your skills via freelancing platforms, e-commerce, affiliate marketing, and content creation.', 'link' => 'earn-online.html'],
    ['key' => 'freelancing', 'title' => 'Freelancing Courses', 'text' => 'Build a professional profile, write winning proposals, price your services, manage clients, and deliver with confidence.', 'link' => 'freelancing.html'],
    ['key' => 'start-business', 'title' => 'Start Your Business', 'text' => 'Validate an idea, register your venture, build a brand, set up digital presence, and plan sustainable growth with mentorship.', 'link' => 'start-business.html'],
];

try {
    ensure_schema();
    $pdo = get_pdo();

    if ($method === 'POST') {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        $data = [];
        if (stripos($contentType, 'application/json') !== false) {
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true) ?? [];
        } else {
            $data = $_POST;
        }

        $service_key = trim($data['service_key'] ?? '');
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $message = trim($data['message'] ?? '');

        if ($service_key === '' || $name === '' || $email === '') {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            exit;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Invalid email']);
            exit;
        }

        // Verify service exists (optional but helpful)
        $chk = $pdo->prepare('SELECT `key` FROM services WHERE `key` = ? AND is_active = 1');
        $chk->execute([$service_key]);
        if (!$chk->fetch()) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Service not found']);
            exit;
        }

        $stmt = $pdo->prepare('INSERT INTO service_requests (service_key, name, email, phone, message) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$service_key, $name, $email, $phone ?: null, $message ?: null]);

        echo json_encode(['success' => true, 'id' => (int) $pdo->lastInsertId()]);
        exit;
    }

    // Default GET: list services
    $stmt = $pdo->prepare('SELECT `key`, title, `text`, link FROM services WHERE is_active = 1 ORDER BY id ASC');
    $stmt->execute();
    $rows = $stmt->fetchAll();

    if (!$rows || count($rows) === 0) {
        echo json_encode(['services' => $fallback, 'source' => 'fallback']);
        exit;
    }

    echo json_encode(['services' => $rows, 'source' => 'database']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error', 'message' => $e->getMessage()]);
}
