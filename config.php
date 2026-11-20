<?php
/**
 * Konfigurasi Database - SQLite
 */

define('DB_PATH', __DIR__ . '/database/faq.db');
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin123'); // Ganti password ini di production

function getDB(): PDO {
    $dir = dirname(DB_PATH);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $isNew = !file_exists(DB_PATH);
    $pdo = new PDO('sqlite:' . DB_PATH);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    if ($isNew) {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS faqs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                category TEXT DEFAULT 'Umum',
                is_active INTEGER DEFAULT 1,
                sort_order INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");

        // Seed data contoh
        $seed = [
            ['Apa itu Litek-D?', 'Litek-D adalah platform digital yang menyediakan layanan informasi dan solusi teknologi untuk kebutuhan Anda.', 'Umum'],
            ['Bagaimana cara mendaftar?', 'Anda dapat mendaftar melalui halaman registrasi dengan mengisi formulir pendaftaran yang tersedia. Pastikan data yang Anda masukkan valid.', 'Akun'],
            ['Apakah layanan ini gratis?', 'Ya, layanan dasar kami tersedia secara gratis. Untuk fitur premium, silakan lihat halaman harga kami.', 'Layanan'],
            ['Bagaimana cara menghubungi support?', 'Anda dapat menghubungi tim support kami melalui email di support@litek-d.com atau melalui live chat yang tersedia di website.', 'Dukungan'],
            ['Apakah data saya aman?', 'Keamanan data pengguna adalah prioritas utama kami. Kami menggunakan enkripsi dan standar keamanan terkini untuk melindungi data Anda.', 'Keamanan'],
            ['Bagaimana cara reset password?', 'Klik tombol "Lupa Password" di halaman login, masukkan email terdaftar, dan ikuti instruksi yang dikirim ke email Anda.', 'Akun'],
        ];

        $stmt = $pdo->prepare("INSERT INTO faqs (question, answer, category, sort_order) VALUES (?, ?, ?, ?)");
        foreach ($seed as $i => $row) {
            $stmt->execute([$row[0], $row[1], $row[2], $i]);
        }
    }

    return $pdo;
}

function e(string $str): string {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

function isLoggedIn(): bool {
    if (session_status() === PHP_SESSION_NONE) session_start();
    return !empty($_SESSION['admin_logged_in']);
}
