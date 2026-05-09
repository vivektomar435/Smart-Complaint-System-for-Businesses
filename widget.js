(function () {
  'use strict';

  // Read config from the <script> tag attributes
  const scriptTag = document.currentScript ||
    document.querySelector('script[data-api-key]');

  const CONFIG = {
    apiKey:   scriptTag ? scriptTag.getAttribute('data-api-key')  : '',
    label:    scriptTag ? scriptTag.getAttribute('data-label')    || 'Report an Issue' : 'Report an Issue',
    color:    scriptTag ? scriptTag.getAttribute('data-color')    || '#1E3A8A' : '#1E3A8A',
    position: scriptTag ? scriptTag.getAttribute('data-position') || 'bottom-right' : 'bottom-right',
    lang:     scriptTag ? scriptTag.getAttribute('data-lang')     || 'en' : 'en',
    endpoint: 'https://api.smartcomplain.io/v1/complaints', // real API endpoint
  };

  const I18N = {
    en: { title:'Submit a Complaint', name:'Your Name', email:'Email Address', category:'Category', desc:'Describe your issue', send:'Submit', cancel:'Cancel', success:'Your complaint has been submitted. We\'ll be in touch soon.', required:'Please fill in all required fields.', cats:['Payment','Delivery','Technical','Refund','Product Quality','Account Issues','Other'] },
    ar: { title:'تقديم شكوى', name:'اسمك', email:'البريد الإلكتروني', category:'الفئة', desc:'اشرح مشكلتك', send:'إرسال', cancel:'إلغاء', success:'تم إرسال شكواك. سنتواصل معك قريباً.', required:'يرجى ملء جميع الحقول المطلوبة.', cats:['الدفع','التوصيل','تقني','استرداد','جودة المنتج','مشاكل الحساب','أخرى'] },
    fr: { title:'Soumettre une plainte', name:'Votre nom', email:'Adresse e-mail', category:'Catégorie', desc:'Décrivez votre problème', send:'Envoyer', cancel:'Annuler', success:'Votre plainte a été soumise. Nous vous contacterons bientôt.', required:'Veuillez remplir tous les champs obligatoires.', cats:['Paiement','Livraison','Technique','Remboursement','Qualité produit','Problèmes de compte','Autre'] },
    es: { title:'Enviar una queja', name:'Tu nombre', email:'Correo electrónico', category:'Categoría', desc:'Describe tu problema', send:'Enviar', cancel:'Cancelar', success:'Tu queja ha sido enviada. Nos pondremos en contacto pronto.', required:'Por favor, rellena todos los campos obligatorios.', cats:['Pago','Entrega','Técnico','Reembolso','Calidad del producto','Problemas de cuenta','Otro'] },
  };

  const t = I18N[CONFIG.lang] || I18N.en;
  const isRTL = CONFIG.lang === 'ar';
  const posRight = CONFIG.position === 'bottom-right';

  // ── Inject styles ──────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #sc-launcher {
      position: fixed;
      ${posRight ? 'right:24px' : 'left:24px'};
      bottom: 24px;
      z-index: 99998;
      background: ${CONFIG.color};
      color: #fff;
      border: none;
      border-radius: 50px;
      padding: 0 22px;
      height: 48px;
      font-size: 14px;
      font-weight: 600;
      font-family: Inter, system-ui, sans-serif;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #sc-launcher:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
    #sc-launcher svg { width:18px; height:18px; flex-shrink:0; }

    #sc-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 99999;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow-y: auto;
      box-sizing: border-box;
    }
    #sc-overlay.sc-open { display: flex; animation: scFadeIn 0.2s ease; }
    @keyframes scFadeIn { from { opacity:0; } to { opacity:1; } }

    #sc-panel {
      background: #fff;
      border-radius: 16px;
      width: 100%;
      max-width: 400px;
      max-height: calc(100vh - 32px);
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.25);
      overflow: hidden;
      direction: ${isRTL ? 'rtl' : 'ltr'};
      animation: scSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1);
      margin: auto;
    }
    @keyframes scSlideUp { from { transform: translateY(20px); opacity:0; } to { transform: translateY(0); opacity:1; } }

    #sc-header {
      background: ${CONFIG.color};
      color: #fff;
      padding: 18px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #sc-header h3 { margin:0; font-size:15px; font-weight:600; font-family:Inter,system-ui,sans-serif; }
    #sc-close {
      background: rgba(255,255,255,0.2);
      border: none;
      color: #fff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    #sc-close:hover { background: rgba(255,255,255,0.35); }

    #sc-body { padding: 20px; overflow-y: auto; flex: 1; }

    .sc-field { margin-bottom: 14px; }
    .sc-field label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 5px;
      font-family: Inter, system-ui, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .sc-field input,
    .sc-field select,
    .sc-field textarea {
      width: 100%;
      padding: 9px 12px;
      border: 1.5px solid #D1D5DB;
      border-radius: 8px;
      font-size: 14px;
      font-family: Inter, system-ui, sans-serif;
      color: #111827;
      background: #fff;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .sc-field input:focus,
    .sc-field select:focus,
    .sc-field textarea:focus { border-color: ${CONFIG.color}; }
    .sc-field textarea { resize: vertical; min-height: 80px; }

    #sc-error {
      display: none;
      background: #FEE2E2;
      color: #991B1B;
      font-size: 13px;
      padding: 8px 12px;
      border-radius: 6px;
      margin-bottom: 12px;
      font-family: Inter, system-ui, sans-serif;
    }

    #sc-footer { display: flex; gap: 10px; }
    #sc-submit {
      flex: 1;
      background: ${CONFIG.color};
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 11px;
      font-size: 14px;
      font-weight: 600;
      font-family: Inter, system-ui, sans-serif;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    #sc-submit:hover { opacity: 0.88; }
    #sc-submit:disabled { opacity: 0.55; cursor: not-allowed; }
    #sc-cancel {
      background: #F3F4F6;
      color: #374151;
      border: none;
      border-radius: 8px;
      padding: 11px 16px;
      font-size: 14px;
      font-weight: 500;
      font-family: Inter, system-ui, sans-serif;
      cursor: pointer;
      transition: background 0.2s;
    }
    #sc-cancel:hover { background: #E5E7EB; }

    #sc-success {
      display: none;
      padding: 32px 20px;
      text-align: center;
    }
    #sc-success .sc-check {
      width: 56px; height: 56px;
      background: #D1FAE5;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
      font-size: 28px;
    }
    #sc-success p {
      font-size: 14px;
      color: #374151;
      line-height: 1.6;
      font-family: Inter, system-ui, sans-serif;
    }
    #sc-poweredby {
      text-align: center;
      font-size: 11px;
      color: #9CA3AF;
      padding: 10px 0 16px;
      font-family: Inter, system-ui, sans-serif;
    }
    #sc-poweredby a { color: #6B7280; text-decoration: none; }
    #sc-poweredby a:hover { text-decoration: underline; }
  `;
  document.head.appendChild(style);

  // ── Build DOM ──────────────────────────────────────────────
  const launcher = document.createElement('button');
  launcher.id = 'sc-launcher';
  launcher.setAttribute('aria-label', CONFIG.label);
  launcher.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    ${CONFIG.label}
  `;

  const catOptions = t.cats.map((c, i) => {
    const vals = ['payment','delivery','technical','refund','quality','account','other'];
    return `<option value="${vals[i]}">${c}</option>`;
  }).join('');

  const overlay = document.createElement('div');
  overlay.id = 'sc-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', t.title);
  overlay.innerHTML = `
    <div id="sc-panel">
      <div id="sc-header">
        <h3>${t.title}</h3>
        <button id="sc-close" aria-label="${t.cancel}">✕</button>
      </div>
      <div id="sc-body">
        <div id="sc-error"></div>
        <div class="sc-field">
          <label>${t.name} *</label>
          <input type="text" id="sc-name" placeholder="Jane Doe" autocomplete="name">
        </div>
        <div class="sc-field">
          <label>${t.email} *</label>
          <input type="email" id="sc-email" placeholder="jane@example.com" autocomplete="email">
        </div>
        <div class="sc-field">
          <label>${t.category} *</label>
          <select id="sc-category">
            <option value="" disabled selected>— select —</option>
            ${catOptions}
          </select>
        </div>
        <div class="sc-field">
          <label>${t.desc} *</label>
          <textarea id="sc-desc" placeholder="${t.desc}…"></textarea>
        </div>
        <div id="sc-error-msg" style="display:none;background:#FEE2E2;color:#991B1B;font-size:13px;padding:8px 12px;border-radius:6px;margin-bottom:12px;font-family:Inter,system-ui,sans-serif;"></div>
        <div id="sc-footer">
          <button id="sc-cancel">${t.cancel}</button>
          <button id="sc-submit">${t.send}</button>
        </div>
      </div>
      <div id="sc-success">
        <div class="sc-check">✓</div>
        <p>${t.success}</p>
      </div>
      <div id="sc-poweredby">Powered by <a href="https://smartcomplain.io" target="_blank" rel="noopener">Smart Complain</a></div>
    </div>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(overlay);

  // ── Helpers ────────────────────────────────────────────────
  function openWidget() {
    overlay.classList.add('sc-open');
    document.getElementById('sc-name').focus();
  }

  function closeWidget() {
    overlay.classList.remove('sc-open');
    // Reset form
    setTimeout(() => {
      document.getElementById('sc-body').style.display = 'block';
      document.getElementById('sc-success').style.display = 'none';
      document.getElementById('sc-name').value = '';
      document.getElementById('sc-email').value = '';
      document.getElementById('sc-category').value = '';
      document.getElementById('sc-desc').value = '';
      document.getElementById('sc-error-msg').style.display = 'none';
      document.getElementById('sc-submit').disabled = false;
    }, 300);
  }

  function showError(msg) {
    const el = document.getElementById('sc-error-msg');
    el.textContent = msg;
    el.style.display = 'block';
  }

  async function submitComplaint() {
    const name     = document.getElementById('sc-name').value.trim();
    const email    = document.getElementById('sc-email').value.trim();
    const category = document.getElementById('sc-category').value;
    const desc     = document.getElementById('sc-desc').value.trim();
    const errEl    = document.getElementById('sc-error-msg');
    errEl.style.display = 'none';

    if (!name || !email || !category || !desc) {
      showError(t.required); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address.'); return;
    }

    const submitBtn = document.getElementById('sc-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = '…';

    const payload = {
      api_key: CONFIG.apiKey,
      title: desc.split('\n')[0].slice(0, 80) || 'Customer complaint',
      customer_name: name,
      customer_email: email,
      category,
      description: desc,
      source: 'widget',
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // Post to Smart Complain API
    // (In this demo we simulate the call; in production remove the try/catch mock)
    try {
      /*
      const res = await fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': CONFIG.apiKey },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Server error');
      */

      // DEMO: broadcast to parent dashboard if embedded in iframe
      window.parent.postMessage({ type: 'sc_new_complaint', payload }, '*');

      // Simulate network delay
      await new Promise(r => setTimeout(r, 800));

      // Show success
      document.getElementById('sc-body').style.display = 'none';
      document.getElementById('sc-success').style.display = 'block';
      setTimeout(closeWidget, 3500);

    } catch (err) {
      showError('Something went wrong. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = t.send;
    }
  }

  // ── Events ─────────────────────────────────────────────────
  launcher.addEventListener('click', openWidget);
  document.getElementById('sc-close').addEventListener('click', closeWidget);
  document.getElementById('sc-cancel').addEventListener('click', closeWidget);
  document.getElementById('sc-submit').addEventListener('click', submitComplaint);

  // Close on backdrop click
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeWidget(); });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('sc-open')) closeWidget();
  });

})();
