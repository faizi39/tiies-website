<?php
require_once __DIR__ . '/config.php';

function get_pdo(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    return $pdo;
}

function ensure_schema(): void {
    $pdo = get_pdo();
    $pdo->exec("\n        CREATE TABLE IF NOT EXISTS services (\n            id INT AUTO_INCREMENT PRIMARY KEY,\n            `key` VARCHAR(64) NOT NULL UNIQUE,\n            title VARCHAR(255) NOT NULL,\n            `text` TEXT NOT NULL,\n            link VARCHAR(255) NOT NULL,\n            is_active TINYINT(1) NOT NULL DEFAULT 1,\n            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n    ");

    $pdo->exec("\n        CREATE TABLE IF NOT EXISTS service_requests (\n            id INT AUTO_INCREMENT PRIMARY KEY,\n            service_key VARCHAR(64) NOT NULL,\n            name VARCHAR(120) NOT NULL,\n            email VARCHAR(160) NOT NULL,\n            phone VARCHAR(30) NULL,\n            message TEXT NULL,\n            status VARCHAR(20) NOT NULL DEFAULT 'new',\n            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n            CONSTRAINT fk_service_requests_service\n                FOREIGN KEY (service_key) REFERENCES services(`key`)\n                ON UPDATE CASCADE ON DELETE RESTRICT,\n            INDEX idx_service_key (service_key)\n        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n    ");
}
