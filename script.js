// ── Registered users store (persisted in localStorage) ────────
function getUsers() {
    try { return JSON.parse(localStorage.getItem('sc_users') || '[]'); }
    catch { return []; }
}
function saveUsers(users) {
    localStorage.setItem('sc_users', JSON.stringify(users));
}

// ── View switching ─────────────────────────────────────────────
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
        const form = target.querySelector('form');
        if (form) form.reset();
        target.querySelectorAll('.inline-error').forEach(e => e.remove());
    }
}

// ── Form submissions ───────────────────────────────────────────
function handleFormSubmit(event, successMessage, redirectUrl = null) {
    event.preventDefault();
    const form = event.target;

    // ── Business Registration ──────────────────────────────────
    if (form.closest('#view-business-register')) {
        const email    = document.getElementById('reg-email').value.trim().toLowerCase();
        const password = document.getElementById('reg-password').value;
        const bizName  = document.getElementById('reg-biz-name').value.trim();
        const owner    = document.getElementById('reg-owner-name').value.trim();

        const users = getUsers();
        if (users.find(u => u.email === email)) {
            showInlineError(form, 'An account with this email already exists. Please login instead.');
            return;
        }

        users.push({ email, password, bizName, owner, registeredAt: new Date().toISOString() });
        saveUsers(users);
        showToast(successMessage);
        setTimeout(() => { window.location.href = redirectUrl || 'dashboard.html'; }, 2000);
        return;
    }

    // ── Business Login ─────────────────────────────────────────
    if (form.closest('#view-business-login')) {
        const email    = document.getElementById('biz-login-email').value.trim().toLowerCase();
        const password = document.getElementById('biz-login-password').value;

        const users = getUsers();
        const match = users.find(u => u.email === email && u.password === password);

        if (!match) {
            showInlineError(form, 'Invalid email or password. Please check your credentials.');
            return;
        }

        showToast('Welcome back, ' + (match.owner || match.bizName) + '!');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
        return;
    }

    // ── Admin Login ────────────────────────────────────────────
    if (form.closest('#view-admin-login')) {
        showToast(successMessage);
        setTimeout(() => { window.location.href = redirectUrl || 'index.html'; }, 2000);
        return;
    }

    // ── Fallback ───────────────────────────────────────────────
    showToast(successMessage);
    setTimeout(() => {
        if (redirectUrl) window.location.href = redirectUrl;
        else showView('view-role-selection');
    }, 2000);
}

// ── Inline error helper ────────────────────────────────────────
function showInlineError(form, msg) {
    const existing = form.querySelector('.inline-error');
    if (existing) existing.remove();

    const err = document.createElement('p');
    err.className = 'inline-error';
    err.textContent = msg;
    err.style.cssText = 'color:#DC2626;background:#FEE2E2;border:1px solid #FCA5A5;border-radius:6px;padding:0.6rem 0.9rem;font-size:0.85rem;margin-bottom:0.75rem;text-align:center;';

    const submitBtn = form.querySelector('button[type="submit"]');
    form.insertBefore(err, submitBtn);

    const card = form.closest('.container');
    if (card) {
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'shake 0.4s ease';
    }
}

// ── Toast notification ─────────────────────────────────────────
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
