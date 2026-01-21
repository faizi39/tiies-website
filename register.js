(function(){
  const modalId = 'registerModal';
  let currentServiceKey = null;

  function createModal(){
    if (document.getElementById(modalId)) return;
    const overlay = document.createElement('div');
    overlay.className = 'register-modal';
    overlay.id = modalId;
    overlay.innerHTML = `
      <div class="register-content" role="dialog" aria-modal="true">
        <span class="close" id="registerClose">×</span>
        <h3>Registration</h3>
        <form id="registerForm" novalidate>
          <div class="form-grid">
            <div class="form-field">
              <label for="regName">Full Name</label>
              <input type="text" id="regName" name="name" required placeholder="e.g., Ali Khan">
            </div>
            <div class="form-field">
              <label for="regEmail">Email</label>
              <input type="email" id="regEmail" name="email" required placeholder="you@example.com">
            </div>
            <div class="form-field">
              <label for="regPhone">Phone (optional)</label>
              <input type="tel" id="regPhone" name="phone" placeholder="0301-1234567">
            </div>
            <div class="form-field form-message">
              <label for="regMessage">Message (optional)</label>
              <textarea id="regMessage" name="message" rows="3" placeholder="Tell us your goals"></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Send Registration</button>
            <span id="registerStatus" class="form-status" aria-live="polite"></span>
          </div>
        </form>
      </div>`;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', closeModal);
    overlay.querySelector('.register-content').addEventListener('click', function(e){ e.stopPropagation(); });
    document.getElementById('registerClose').addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeModal(); });

    const form = document.getElementById('registerForm');
    form.addEventListener('submit', submitForm);
  }

  function openModal(serviceKey){
    currentServiceKey = serviceKey;
    createModal();
    const modal = document.getElementById(modalId);
    const status = document.getElementById('registerStatus');
    if (status) status.textContent = '';
    modal.style.display = 'flex';
  }

  function closeModal(){
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
  }

  async function submitForm(e){
    e.preventDefault();
    const status = document.getElementById('registerStatus');
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const message = document.getElementById('regMessage').value.trim();

    if (!currentServiceKey) { status.textContent = 'Missing service.'; return; }
    if (!name || !email) { status.textContent = 'Name and email are required.'; return; }

    status.textContent = 'Sending...';
    try {
      const res = await fetch('api/services.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ service_key: currentServiceKey, name, email, phone, message })
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.success) {
        status.textContent = payload.error || 'Something went wrong.';
        return;
      }
      status.textContent = "Registration sent! We'll contact you soon.";
      e.target.reset();
    } catch (err) {
      status.textContent = 'Network error. Please try again.';
    }
  }

  function attach(){
    document.querySelectorAll('[data-open-register="true"]').forEach(function(el){
      el.addEventListener('click', function(ev){
        ev.preventDefault();
        const key = el.getAttribute('data-service-key');
        openModal(key);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', attach);
})();
