/* ========================================
   CONTACT.JS — Golden Motif
   Form validation + email submission
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      await submitForm(form);
    }
  });

  // Clear errors on input
  form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('error');
    });
  });
}

/**
 * Validate form fields
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function validateForm(form) {
  let isValid = true;

  // Name
  const name = form.querySelector('#contact-name');
  if (name && !name.value.trim()) {
    setError(name, 'Please enter your name');
    isValid = false;
  }

  // Email
  const email = form.querySelector('#contact-email');
  if (email) {
    const emailVal = email.value.trim();
    if (!emailVal) {
      setError(email, 'Please enter your email address');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError(email, 'Please enter a valid email address');
      isValid = false;
    }
  }

  // Message
  const message = form.querySelector('#contact-message');
  if (message && !message.value.trim()) {
    setError(message, 'Please enter a message');
    isValid = false;
  }

  return isValid;
}

/**
 * Set error state on a form group
 */
function setError(input, message) {
  const group = input.closest('.form-group');
  if (!group) return;
  group.classList.add('error');
  const errorEl = group.querySelector('.form-error');
  if (errorEl) errorEl.textContent = message;
}

/**
 * Submit form data to serverless API
 */
async function submitForm(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn ? submitBtn.textContent : '';

  // Show loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.style.opacity = '0.7';
  }

  // Gather form data
  const data = {
    name: form.querySelector('#contact-name')?.value.trim() || '',
    email: form.querySelector('#contact-email')?.value.trim() || '',
    company: form.querySelector('#contact-company')?.value.trim() || '',
    interest: form.querySelector('#contact-interest')?.value || '',
    message: form.querySelector('#contact-message')?.value.trim() || ''
  };

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showSuccess(form);
    } else {
      showFormError(form, submitBtn, originalText, result.error || 'Something went wrong. Please try again.');
    }
  } catch (err) {
    console.error('Form submission error:', err);
    showFormError(form, submitBtn, originalText, 'Network error. Please check your connection and try again.');
  }
}

/**
 * Show success state
 */
function showSuccess(form) {
  const formFields = form.querySelector('.contact-form__fields');
  const successMsg = form.querySelector('.contact-form__success');

  if (formFields) formFields.style.display = 'none';
  if (successMsg) successMsg.classList.add('show');

  // Scroll into view
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Show error and restore button
 */
function showFormError(form, submitBtn, originalText, message) {
  // Restore button
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    submitBtn.style.opacity = '1';
  }

  // Show error banner (create if not exist)
  let errorBanner = form.querySelector('.contact-form__error-banner');
  if (!errorBanner) {
    errorBanner = document.createElement('div');
    errorBanner.className = 'contact-form__error-banner';
    errorBanner.style.cssText = `
      background: #fef2f2;
      border: 1px solid #fca5a5;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 20px;
      color: #991b1b;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: fadeIn 0.3s ease;
    `;
    const fieldsContainer = form.querySelector('.contact-form__fields');
    if (fieldsContainer) {
      fieldsContainer.insertBefore(errorBanner, fieldsContainer.firstChild);
    }
  }

  errorBanner.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="flex-shrink: 0;">
      <circle cx="10" cy="10" r="10" fill="#fca5a5"/>
      <path d="M10 6v5M10 13.5v.5" stroke="#991b1b" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <span>${message}</span>
  `;
  errorBanner.style.display = 'flex';

  // Auto-hide after 8 seconds
  setTimeout(() => {
    if (errorBanner) {
      errorBanner.style.display = 'none';
    }
  }, 8000);
}
