/* ========================================
   CONTACT.JS — Golden Motif
   Form validation + success state
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      showSuccess(form);
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
