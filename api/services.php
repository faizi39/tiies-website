<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../db.php';

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
