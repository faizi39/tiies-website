-- Create database and services table, then seed initial data
CREATE DATABASE IF NOT EXISTS tiies_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tiies_db;

CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    `text` TEXT NOT NULL,
    link VARCHAR(255) NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS service_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_key VARCHAR(64) NOT NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    phone VARCHAR(30) NULL,
    message TEXT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_service_requests_service FOREIGN KEY (service_key) REFERENCES services(`key`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_service_key (service_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO services (`key`, title, `text`, link, is_active) VALUES
('basic-computer', 'Basic Computer Courses', 'Master digital basics: typing, file management, internet safety, email, MS Word, Excel, and PowerPoint. Ideal for students, job seekers, and beginners.', 'basic-computer.html', 1),
('skills-programme', 'Skills Development Programme', 'Choose focused tracks like Graphic Design, Web Development, Digital Marketing, Video Editing, and Office Productivity with real projects.', 'skills-development.html', 1),
('earn-online', 'Earn Money Online with Digital Skills', 'Learn practical strategies to monetize your skills via freelancing platforms, e-commerce, affiliate marketing, and content creation.', 'earn-online.html', 1),
('freelancing', 'Freelancing Courses', 'Build a professional profile, write winning proposals, price your services, manage clients, and deliver with confidence.', 'freelancing.html', 1),
('start-business', 'Start Your Business', 'Validate an idea, register your venture, build a brand, set up digital presence, and plan sustainable growth with mentorship.', 'start-business.html', 1)
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    `text` = VALUES(`text`),
    link = VALUES(link),
    is_active = VALUES(is_active);
