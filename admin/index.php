<?php
/**
 * Admin Panel - Login, List, Create, Edit, Delete FAQ
 */

require_once __DIR__ . '/../config.php';

session_start();

$db = getDB();
$action = $_GET['action'] ?? 'list';
$message = '';
$msgType = '';

// ---- Handle Login ----
if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = $_POST['username'] ?? '';
    $pass = $_POST['password'] ?? '';
    if ($user === ADMIN_USERNAME && $pass === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        header('Location: index.php');
        exit;
    } else {
        $message = 'Username atau password salah!';
        $msgType = 'error';
    }
}

// ---- Handle Logout ----
if ($action === 'logout') {
    session_destroy();
    header('Location: index.php?action=login');
    exit;
}

// ---- Require Auth for all other actions ----
if ($action !== 'login' && !isLoggedIn()) {
    $action = 'login';
}

// ---- Handle Create ----
if ($action === 'create' && $_SERVER['REQUEST_METHOD'] === 'POST' && isLoggedIn()) {
    $q = trim($_POST['question'] ?? '');
    $a = trim($_POST['answer'] ?? '');
    $cat = trim($_POST['category'] ?? 'Umum');
    $active = isset($_POST['is_active']) ? 1 : 0;

    if ($q && $a) {
        $stmt = $db->prepare("INSERT INTO faqs (question, answer, category, is_active) VALUES (?, ?, ?, ?)");
        $stmt->execute([$q, $a, $cat, $active]);
        header('Location: index.php?msg=created');
        exit;
    } else {
        $message = 'Pertanyaan dan jawaban wajib diisi!';
        $msgType = 'error';
    }
}

// ---- Handle Edit ----
if ($action === 'edit' && $_SERVER['REQUEST_METHOD'] === 'POST' && isLoggedIn()) {
    $id = (int)($_POST['id'] ?? 0);
    $q = trim($_POST['question'] ?? '');
    $a = trim($_POST['answer'] ?? '');
    $cat = trim($_POST['category'] ?? 'Umum');
    $active = isset($_POST['is_active']) ? 1 : 0;

    if ($id && $q && $a) {
        $stmt = $db->prepare("UPDATE faqs SET question=?, answer=?, category=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?");
        $stmt->execute([$q, $a, $cat, $active, $id]);
        header('Location: index.php?msg=updated');
        exit;
    }
}

// ---- Handle Delete ----
if ($action === 'delete' && isLoggedIn()) {
    $id = (int)($_GET['id'] ?? 0);
    if ($id) {
        $db->prepare("DELETE FROM faqs WHERE id = ?")->execute([$id]);
        header('Location: index.php?msg=deleted');
        exit;
    }
}

// ---- Flash Messages ----
if (isset($_GET['msg'])) {
    $msgs = [
        'created' => '✅ FAQ berhasil ditambahkan!',
        'updated' => '✅ FAQ berhasil diperbarui!',
        'deleted' => '✅ FAQ berhasil dihapus!',
    ];
    $message = $msgs[$_GET['msg']] ?? '';
    $msgType = 'success';
}

// ---- Fetch data ----
$faqs = $db->query("SELECT * FROM faqs ORDER BY sort_order ASC, id DESC")->fetchAll();
$editFaq = null;
if ($action === 'edit' && isset($_GET['id'])) {
    $stmt = $db->prepare("SELECT * FROM faqs WHERE id = ?");
    $stmt->execute([(int)$_GET['id']]);
    $editFaq = $stmt->fetch();
}

$totalActive = count(array_filter($faqs, fn($f) => $f['is_active']));
$totalInactive = count($faqs) - $totalActive;
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin FAQ - Litek-D</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>

<!-- Header -->
<header class="header">
    <div class="header-inner">
        <a href="../index.php" class="logo">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            FAQ Litek-D
        </a>
        <nav>
            <a href="../index.php">Beranda</a>
            <?php if (isLoggedIn()): ?>
                <a href="index.php" class="active">Panel Admin</a>
                <a href="index.php?action=logout">Logout</a>
            <?php endif; ?>
        </nav>
    </div>
</header>

<?php if ($action === 'login'): ?>
<!-- ============ LOGIN ============ -->
<div class="login-wrapper">
    <div class="login-card">
        <div class="login-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
        </div>
        <h2>Admin Login</h2>
        <p>Masuk untuk mengelola data FAQ</p>

        <?php if ($message): ?>
            <div class="alert alert-<?= $msgType ?>"><?= e($message) ?></div>
        <?php endif; ?>

        <form method="POST" action="index.php?action=login">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" class="form-control" placeholder="Masukkan username" required autofocus>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" class="form-control" placeholder="Masukkan password" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;">
                Masuk
            </button>
        </form>
    </div>
</div>

<?php else: ?>
<!-- ============ ADMIN DASHBOARD ============ -->
<div class="admin-container">

    <?php if ($message): ?>
        <div class="alert alert-<?= $msgType ?>"><?= e($message) ?></div>
    <?php endif; ?>

    <!-- Stats Row -->
    <?php if ($action === 'list'): ?>
    <div class="stats-bar" style="justify-content:flex-start; margin-bottom:24px;">
        <div class="stat-item">
            <strong><?= count($faqs) ?></strong> Total FAQ
        </div>
        <div class="stat-item">
            <strong><?= $totalActive ?></strong> Aktif
        </div>
        <div class="stat-item">
            <strong><?= $totalInactive ?></strong> Nonaktif
        </div>
    </div>
    <?php endif; ?>

    <!-- Form Card (Create / Edit) -->
    <?php if ($action === 'create' || $action === 'edit'): ?>
    <div class="admin-card" style="margin-bottom: 28px;">
        <div class="admin-card-header">
            <h2><?= $action === 'edit' ? '✏️ Edit FAQ' : '➕ Tambah FAQ Baru' ?></h2>
            <a href="index.php" class="btn btn-outline btn-sm">← Kembali</a>
        </div>
        <form method="POST" action="index.php?action=<?= $action ?>" style="padding: 28px;">
            <?php if ($editFaq): ?>
                <input type="hidden" name="id" value="<?= $editFaq['id'] ?>">
            <?php endif; ?>

            <div class="form-group">
                <label>Pertanyaan <span style="color:var(--danger);">*</span></label>
                <input type="text" name="question" class="form-control" required
                       value="<?= e($editFaq['question'] ?? '') ?>"
                       placeholder="Masukkan pertanyaan FAQ">
            </div>

            <div class="form-group">
                <label>Jawaban <span style="color:var(--danger);">*</span></label>
                <textarea name="answer" class="form-control" required rows="4"
                          placeholder="Masukkan jawaban FAQ"><?= e($editFaq['answer'] ?? '') ?></textarea>
            </div>

            <div class="form-group">
                <label>Kategori</label>
                <input type="text" name="category" class="form-control"
                       value="<?= e($editFaq['category'] ?? 'Umum') ?>"
                       placeholder="Contoh: Umum, Akun, Layanan">
            </div>

            <div class="form-group">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" name="is_active" value="1"
                           <?= ($editFaq['is_active'] ?? 1) ? 'checked' : '' ?>>
                    Aktif (tampilkan di halaman utama)
                </label>
            </div>

            <button type="submit" class="btn btn-primary">
                <?= $action === 'edit' ? 'Simpan Perubahan' : 'Tambah FAQ' ?>
            </button>
        </form>
    </div>
    <?php endif; ?>

    <!-- FAQ Table -->
    <div class="admin-card">
        <div class="admin-card-header">
            <h2>📋 Daftar FAQ</h2>
            <a href="index.php?action=create" class="btn btn-primary btn-sm">+ Tambah Baru</a>
        </div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Pertanyaan</th>
                        <th class="hide-mobile">Kategori</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($faqs)): ?>
                        <tr>
                            <td colspan="5" style="text-align:center;color:var(--text-light);padding:40px 24px;">
                                Belum ada data FAQ. Klik <strong>+ Tambah Baru</strong> untuk memulai.
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($faqs as $i => $faq): ?>
                        <tr>
                            <td style="font-weight:600;color:var(--text-light);"><?= $i + 1 ?></td>
                            <td style="max-width:320px;font-weight:500;color:var(--text-dark);">
                                <?= e($faq['question']) ?>
                            </td>
                            <td class="hide-mobile">
                                <span class="faq-category-badge"><?= e($faq['category']) ?></span>
                            </td>
                            <td>
                                <span class="status-badge <?= $faq['is_active'] ? 'status-active' : 'status-inactive' ?>">
                                    <?= $faq['is_active'] ? 'Aktif' : 'Nonaktif' ?>
                                </span>
                            </td>
                            <td>
                                <div class="actions">
                                    <a href="index.php?action=edit&id=<?= $faq['id'] ?>" class="btn btn-outline btn-sm">Edit</a>
                                    <a href="index.php?action=delete&id=<?= $faq['id'] ?>"
                                       class="btn btn-danger btn-sm"
                                       onclick="return confirm('Yakin ingin menghapus FAQ ini?')">Hapus</a>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
<?php endif; ?>

<!-- Footer -->
<footer class="footer">
    &copy; <?= date('Y') ?> <a href="#">Litek-D</a> &middot; Admin Panel
</footer>

</body>
</html>
