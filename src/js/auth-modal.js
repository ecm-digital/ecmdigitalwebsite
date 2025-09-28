// ECM Digital Auth Modal - AWS Cognito Integration with DynamoDB Storage
import { storageManager } from './storage-manager-browser.js';

class AuthModal {
  constructor() {
    this.currentForm = 'login';
    this.user = null;
    this.cognitoConfig = {
      region: 'eu-west-1',
      userPoolId: 'eu-west-1_3IPPu7EwE',
      clientId: '3fnbsgadt9hh5vinsnn0v7lkbt',
      identityPoolId: 'eu-west-1:2cc09d6a-57eb-4934-9609-ae62cdb9268b'
    };

    this.init();
  }

  init() {
    // AWS Cognito setup will be handled by the client dashboard
    this.bindEvents();
    this.checkUserSession();
  }

  bindEvents() {
    // Modal controls
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-auth-modal]')) {
        e.preventDefault();
        this.openModal(e.target.dataset.authModal || 'login');
      }
    });

    // Close modal on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('authModal').style.display !== 'none') {
        this.closeModal();
      }
    });

    // Prevent modal close on content click
    document.getElementById('authModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'authModal') {
        this.closeModal();
      }
    });
  }

  openModal(form = 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) {
      console.error('Auth modal not found');
      return;
    }

    this.currentForm = form;
    this.showForm(form);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Focus first input
    setTimeout(() => {
      const firstInput = modal.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  closeModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }

    // Clear form data
    this.clearForms();
    this.clearErrors();
  }

  showForm(formType) {
    // Hide all forms
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.remove('active');
    });

    // Show selected form
    const targetForm = document.getElementById(formType + 'Form');
    if (targetForm) {
      targetForm.classList.add('active');
      this.currentForm = formType;
    }
  }

  // Global form switching functions
  showLogin() {
    this.showForm('login');
  }

  showRegister() {
    this.showForm('register');
  }

  showConfirmation() {
    this.showForm('confirmation');
  }

  showForgotPassword() {
    this.showForm('forgot');
  }

  // Form handlers
  async handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    this.clearErrors();
    this.setLoading('login', true);

    try {
      // Since we can't directly use AWS SDK in the browser due to CORS,
      // we'll redirect to the client dashboard for authentication
      await this.authenticateWithClientDashboard(email, password, rememberMe);

    } catch (error) {
      console.error('Login error:', error);
      this.showError('login', error.message || 'Błąd logowania. Spróbuj ponownie.');
    } finally {
      this.setLoading('login', false);
    }
  }

  async handleRegister(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const company = document.getElementById('company').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    this.clearErrors();
    this.setLoading('register', true);

    // Validation
    if (password !== confirmPassword) {
      this.showError('register', 'Hasła nie są identyczne');
      this.setLoading('register', false);
      return;
    }

    if (password.length < 8) {
      this.showError('register', 'Hasło musi mieć minimum 8 znaków');
      this.setLoading('register', false);
      return;
    }

    try {
      // Redirect to client dashboard for registration
      await this.registerWithClientDashboard({
        firstName,
        lastName,
        company,
        email,
        password
      });

    } catch (error) {
      console.error('Registration error:', error);
      this.showError('register', error.message || 'Błąd rejestracji. Spróbuj ponownie.');
    } finally {
      this.setLoading('register', false);
    }
  }

  async handleConfirmation(event) {
    event.preventDefault();

    const email = localStorage.getItem('confirmationEmail') || document.getElementById('registerEmail')?.value;
    const code = document.getElementById('confirmationCode').value;

    this.clearErrors();
    this.setLoading('confirm', true);

    try {
      await this.confirmWithClientDashboard(email, code);
    } catch (error) {
      console.error('Confirmation error:', error);
      this.showError('confirmation', error.message || 'Błąd potwierdzania. Spróbuj ponownie.');
    } finally {
      this.setLoading('confirm', false);
    }
  }

  async handleForgotPassword(event) {
    event.preventDefault();

    const email = document.getElementById('forgotEmail').value;

    this.clearErrors();
    this.setLoading('forgot', true);

    try {
      await this.forgotPasswordWithClientDashboard(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      this.showError('forgot', error.message || 'Błąd resetowania hasła. Spróbuj ponownie.');
    } finally {
      this.setLoading('forgot', false);
    }
  }

  async resendConfirmationCode() {
    const email = localStorage.getItem('confirmationEmail') || document.getElementById('registerEmail')?.value;

    if (!email) {
      this.showError('confirmation', 'Brak adresu email. Spróbuj ponownie się zarejestrować.');
      return;
    }

    try {
      await this.resendCodeWithClientDashboard(email);
      this.showSuccess('confirmation', 'Kod weryfikacyjny został wysłany ponownie.');
    } catch (error) {
      console.error('Resend confirmation error:', error);
      this.showError('confirmation', error.message || 'Błąd wysyłania kodu. Spróbuj ponownie.');
    }
  }

  // Client Dashboard Integration Methods
  async authenticateWithClientDashboard(email, password, rememberMe) {
    try {
      const response = await fetch('/client-dashboard/api/auth/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          data: { email, password, rememberMe }
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store user data using storage manager (DynamoDB + localStorage fallback)
        await storageManager.setUser(result.user.id, result.user);
        await storageManager.setItem('ecm_token', result.user.token);

        // Show success message
        this.showSuccess('login', 'Zalogowano pomyślnie!');

        // Close modal and show user status
        setTimeout(() => {
          this.closeModal();
          this.showUserLoggedInMessage(result.user);
        }, 1500);

        // Update UI to show user is logged in
        this.updateUIForLoggedInUser(result.user);

      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  async registerWithClientDashboard(userData) {
    try {
      const response = await fetch('/client-dashboard/api/auth/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          data: userData
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store email for confirmation using storage manager
        await storageManager.setItem('confirmationEmail', userData.email);

        // Show success message and switch to confirmation
        this.showSuccess('register', 'Konto zostało utworzone! Sprawdź email i wpisz kod potwierdzający.');
        setTimeout(() => {
          this.showConfirmation();
        }, 1500);

      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async confirmWithClientDashboard(email, code) {
    try {
      const response = await fetch('/client-dashboard/api/auth/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'confirm',
          data: { email, code }
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Show success message
        this.showSuccess('confirmation', 'Email został potwierdzony! Możesz się teraz zalogować.');

        // Switch back to login form
        setTimeout(() => {
          this.showLogin();
        }, 2000);

        // Clear confirmation email
        localStorage.removeItem('confirmationEmail');

      } else {
        throw new Error(result.error || 'Confirmation failed');
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      throw error;
    }
  }

  async forgotPasswordWithClientDashboard(email) {
    // For now, show a message that this feature is coming soon
    this.showSuccess('forgot', 'Funkcja resetowania hasła będzie dostępna wkrótce. Skontaktuj się z nami.');
  }

  async resendCodeWithClientDashboard(email) {
    try {
      const response = await fetch('/client-dashboard/api/auth/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'resend',
          data: { email }
        }),
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccess('confirmation', 'Kod weryfikacyjny został wysłany ponownie.');
      } else {
        throw new Error(result.error || 'Resend failed');
      }
    } catch (error) {
      console.error('Resend error:', error);
      throw error;
    }
  }

  updateUIForLoggedInUser(user) {
    // Update navbar buttons
    const navButtons = document.querySelectorAll('[data-auth-modal]');
    navButtons.forEach(button => {
      if (button.getAttribute('data-auth-modal') === 'login') {
        button.style.display = 'none';
      }
    });

    // Add user menu to navbar
    const userMenuPlaceholder = document.getElementById('userMenuPlaceholder');
    if (userMenuPlaceholder) {
      userMenuPlaceholder.style.display = 'block';
      userMenuPlaceholder.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-link dropdown-toggle d-flex align-items-center text-white text-decoration-none" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-semibold me-2">
              ${user.name.charAt(0).toUpperCase()}
            </div>
            <span class="d-none d-lg-inline">${user.name}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li><h6 class="dropdown-header">${user.email}</h6></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item" href="/client-dashboard" target="_blank">
              <i class="fas fa-tachometer-alt me-2"></i>
              Otwórz Panel Klienta
            </a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><button class="dropdown-item text-danger" onclick="window.authModal.logout()">
              <i class="fas fa-sign-out-alt me-2"></i>
              Wyloguj się
            </button></li>
          </ul>
        </div>
      `;
    }

    // Add dashboard access button
    this.addDashboardAccessButton(user);
  }

  addDashboardAccessButton(user) {
    // Remove existing dashboard button if it exists
    const existingButton = document.getElementById('dashboardAccessButton');
    if (existingButton) {
      existingButton.remove();
    }

    // Add new dashboard access button to hero section
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons) {
      const dashboardButton = document.createElement('button');
      dashboardButton.id = 'dashboardAccessButton';
      dashboardButton.className = 'btn btn-success btn-lg px-5 py-3';
      dashboardButton.style.cssText = `
        background: linear-gradient(135deg, #30D158 0%, #28A745 100%);
        border: none;
        border-radius: 0.75rem;
        font-weight: 600;
        font-size: 1.1rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        margin-left: 1rem;
      `;

      dashboardButton.innerHTML = `
        <i class="fas fa-tachometer-alt"></i>
        Przejdź do Panelu
      `;

      dashboardButton.onclick = () => {
        window.open('/client-dashboard', '_blank');
      };

      heroButtons.appendChild(dashboardButton);
    }
  }

  async logout() {
    try {
      // Clear storage using storage manager
      await storageManager.removeItem('ecm_user');
      await storageManager.removeItem('ecm_token');
      await storageManager.removeItem('confirmationEmail');

      // Reset UI
      this.resetUI();

      // Show logout message
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-secondary);
        border: 1px solid var(--separator);
        border-radius: 0.75rem;
        padding: 1rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 300px;
      `;

      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <i class="fas fa-check-circle" style="color: #30D158; font-size: 1.2rem;"></i>
          <div>
            <div style="font-weight: 600; color: var(--text-primary);">Wylogowano pomyślnie!</div>
          </div>
        </div>
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);

    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  resetUI() {
    // Show login buttons again
    const navButtons = document.querySelectorAll('[data-auth-modal]');
    navButtons.forEach(button => {
      if (button.getAttribute('data-auth-modal') === 'login') {
        button.style.display = 'inline-flex';
      }
    });

    // Hide user menu
    const userMenuPlaceholder = document.getElementById('userMenuPlaceholder');
    if (userMenuPlaceholder) {
      userMenuPlaceholder.style.display = 'none';
      userMenuPlaceholder.innerHTML = '';
    }

    // Remove dashboard access button
    const dashboardButton = document.getElementById('dashboardAccessButton');
    if (dashboardButton) {
      dashboardButton.remove();
    }
  }

  // Utility methods
  setLoading(formType, loading) {
    const button = document.getElementById(formType + 'Button');
    const buttonText = button?.querySelector('.button-text');
    const buttonLoading = button?.querySelector('.button-loading');

    if (loading) {
      button?.setAttribute('disabled', 'true');
      buttonText.style.display = 'none';
      buttonLoading.style.display = 'inline-flex';
    } else {
      button?.removeAttribute('disabled');
      buttonText.style.display = 'inline-flex';
      buttonLoading.style.display = 'none';
    }
  }

  showError(formType, message) {
    const errorElement = document.querySelector(`#${formType}Form .error-message`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }

    // Also show in console for debugging
    console.error(`Auth error (${formType}):`, message);
  }

  showSuccess(formType, message) {
    const successElement = document.querySelector(`#${formType}Form .success-message`);
    if (successElement) {
      successElement.textContent = message;
      successElement.classList.add('show');
    }

    // Also show in console for debugging
    console.log(`Auth success (${formType}):`, message);
  }

  clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
      el.classList.remove('show');
      el.textContent = '';
    });

    document.querySelectorAll('.form-input').forEach(input => {
      input.classList.remove('error');
    });
  }

  clearForms() {
    document.querySelectorAll('form').forEach(form => {
      form.reset();
    });

    // Clear any success messages
    document.querySelectorAll('.success-message').forEach(el => {
      el.classList.remove('show');
      el.textContent = '';
    });
  }

  async checkUserSession() {
    // Check if user is already logged in from client dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userData = urlParams.get('user');

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        this.user = user;

        // Store user data using storage manager
        await storageManager.setUser(user.id, user);
        await storageManager.setItem('ecm_token', token);

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);

        // Show success message
        this.showUserLoggedInMessage(user);

      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  showUserLoggedInMessage(user) {
    // Show notification that user is logged in
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--bg-secondary);
      border: 1px solid var(--separator);
      border-radius: 0.75rem;
      padding: 1rem;
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      max-width: 300px;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <i class="fas fa-check-circle" style="color: #30D158; font-size: 1.2rem;"></i>
        <div>
          <div style="font-weight: 600; color: var(--text-primary);">Zalogowano pomyślnie!</div>
          <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">
            Witaj ${user.name || user.email}!
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}

// Global functions for HTML onclick handlers
function closeAuthModal() {
  if (window.authModal) {
    window.authModal.closeModal();
  }
}

function showLogin() {
  if (window.authModal) {
    window.authModal.showLogin();
  }
}

function showRegister() {
  if (window.authModal) {
    window.authModal.showRegister();
  }
}

function showForgotPassword() {
  if (window.authModal) {
    window.authModal.showForgotPassword();
  }
}

function handleLogin(event) {
  if (window.authModal) {
    window.authModal.handleLogin(event);
  }
}

function handleRegister(event) {
  if (window.authModal) {
    window.authModal.handleRegister(event);
  }
}

function handleConfirmation(event) {
  if (window.authModal) {
    window.authModal.handleConfirmation(event);
  }
}

function handleForgotPassword(event) {
  if (window.authModal) {
    window.authModal.handleForgotPassword(event);
  }
}

function resendConfirmationCode() {
  if (window.authModal) {
    window.authModal.resendConfirmationCode();
  }
}

// Make logout function globally available
window.logoutUser = function() {
  if (window.authModal) {
    window.authModal.logout();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Include auth modal HTML
  fetch('/src/components/auth-modal.html')
    .then(response => response.text())
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);

      // Initialize auth modal
      window.authModal = new AuthModal();
    })
    .catch(error => {
      console.error('Error loading auth modal:', error);
    });
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthModal };
}
