<?php
/**
 * Halaman Utama FAQ - Pencarian & Daftar FAQ
 */

require_once __DIR__ . '/config.php';

$db = getDB();
$faqs = $db->query("SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order ASC, id DESC")->fetchAll();

// Ambil kategori unik
$categories = array_unique(array_column($faqs, 'category'));
sort($categories);
$totalFaqs = count($faqs);
$totalCategories = count($categories);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAQ - Litek-D</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<!-- Header -->
<header class="header">
    <div class="header-inner">
        <a href="index.php" class="logo">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            FAQ Litek-D
        </a>
        <nav>
            <a href="index.php" class="active">Beranda</a>
            <a href="admin/">Panel Admin</a>
        </nav>
    </div>
</header>

<!-- Hero + Search -->
<section class="hero">
    <h1>Pusat Bantuan</h1>
    <p>Temukan jawaban dari pertanyaan yang sering diajukan</p>
    <div class="search-box">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" id="searchInput" placeholder="Cari pertanyaan, contoh: cara mendaftar..." autocomplete="off" autofocus>
    </div>
</section>

<!-- Content -->
<main class="container">

    <!-- Stats -->
    <div class="stats-bar">
        <div class="stat-item">
            <strong><?= $totalFaqs ?></strong> Pertanyaan
        </div>
        <div class="stat-item">
            <strong><?= $totalCategories ?></strong> Kategori
        </div>
    </div>

    <!-- Category Tabs -->
    <?php if ($totalCategories > 1): ?>
    <div class="category-tabs">
        <button class="category-tab active" data-category="all">
            Semua
        </button>
        <?php foreach ($categories as $cat): ?>
            <button class="category-tab" data-category="<?= e($cat) ?>"><?= e($cat) ?></button>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <!-- FAQ Card Wrapper -->
    <div class="faq-card-wrapper">
        <div class="faq-list">
            <?php foreach ($faqs as $i => $faq): ?>
            <div class="faq-item"
                 data-question="<?= e($faq['question']) ?>"
                 data-answer="<?= e($faq['answer']) ?>"
                 data-category="<?= e($faq['category']) ?>">
                <button class="faq-question">
                    <span class="q-icon">Q</span>
                    <span class="q-text"><?= e($faq['question']) ?></span>
                    <span class="chevron-wrap">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </span>
                </button>
                <div class="faq-answer">
                    <div class="faq-answer-inner">
                        <span class="faq-category-badge"><?= e($faq['category']) ?></span>
                        <p><?= nl2br(e($faq['answer'])) ?></p>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- No Results -->
    <div class="no-results" id="noResults" style="display:none;">
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3>Tidak ada hasil ditemukan</h3>
        <p>Coba gunakan kata kunci yang berbeda</p>
    </div>

</main>

<!-- Footer -->
<footer class="footer">
    &copy; <?= date('Y') ?> <a href="#">Litek-D</a> &middot; Pusat Bantuan FAQ
</footer>

<script src="assets/js/app.js"></script>
</body>
</html>
