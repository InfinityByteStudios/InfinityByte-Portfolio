import { openDashboard, isAuthenticated, register, login } from './handler.js';

let method = 'login';
let altchaPayload = '';

const message = document.getElementById('form-info');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const submitButton = document.getElementById('form-submit');
const errorMessage = document.getElementById('error-message');
const confirmPassword = document.querySelectorAll('.confirm-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const altchaWidget = document.querySelector('altcha-widget');

function errorMessageToggle(type) {
  if (type === "block") {
    errorMessage.style.display = 'block';
  } else {
    errorMessage.style.display = 'none';
  }
}

function toggleMethod(type) {
  if (type === "register") {
    confirmPassword.forEach((element) => {
      element.style.display = 'block';
    });
    
    registerBtn.disabled = true;
    loginBtn.disabled = false;
    registerBtn.classList.add('active-btn');
    if (loginBtn.classList.contains('active-btn')) {
      loginBtn.classList.remove('active-btn');
    }
    message.textContent = "Hello!";
    submitButton.textContent = "Register";
    method = "register";
  } else {
    confirmPassword.forEach((element) => {
      element.style.display = 'none';
    });
    
    loginBtn.disabled = true;
    registerBtn.disabled = false;
    loginBtn.classList.add('active-btn');
    if (registerBtn.classList.contains('active-btn')) {
      registerBtn.classList.remove('active-btn');
    }
    message.textContent = "Welcome Back!";
    submitButton.textContent = "Login";
    method = "login";
  }
}

loginBtn.addEventListener("click", (event) => {
  event.preventDefault();
  toggleMethod("login");
});

registerBtn.addEventListener("click", (event) => {
  event.preventDefault();
  toggleMethod("register");
});

submitButton.addEventListener("click", async (event) => {
  event.preventDefault();
  
  const emailInput = document.getElementById('email-input').value;
  const passwordInput = document.getElementById('password-input').value;
  
  if (!emailInput.trim() || !passwordInput.trim()) {
    errorMessageToggle('block');
    errorMessage.textContent = 'Please enter valid credentials!';
    return;
  }
  
  if (emailInput.length > 100 || passwordInput.length > 100) {
    errorMessageToggle('block');
    errorMessage.textContent = 'Max 100 characters!';
    return;
  }
  
  if (method === 'register' && confirmPasswordInput.style.display === 'block') {
    if (confirmPasswordInput.value.trim() !== passwordInput.trim()){
      errorMessageToggle('block');
      errorMessage.textContent = 'Confirm password is different';
      return;
    }
  }
  
  if (passwordInput.length < 6) {
    errorMessageToggle('block');
    errorMessage.textContent = 'Password need to be 6 characters or more!';
    return;
  }
  
  submitButton.disabled = true;
  loginBtn.disabled = true;
  registerBtn.disabled = true;
  errorMessageToggle('none');
  
  submitButton.textContent = method === 'register' ? 'Registering...' : 'Logging In...';
  
  try {
    if (!altchaPayload) {
      errorMessageToggle('block');
      errorMessage.textContent = 'Please complete captcha';
      
      return;
    }
    
    if (method === 'register') {
      const result = await register(emailInput, passwordInput, altchaPayload.payload);
      altchaPayload = null;
      altchaWidget.reset();
      
      if (result.error) {
        errorMessageToggle('block');
        errorMessage.textContent = result.error;
        return;
      }
      
      document.getElementById('password-input').value = '';
      confirmPasswordInput.value = '';
      
      console.log(result.user);
      openDashboard();
    } else if (method === 'login') {
      const result = await login(emailInput, passwordInput, altchaPayload.payload);
      altchaPayload = null;
      altchaWidget.reset();
      
      if (result.error) {
        errorMessageToggle('block');
        errorMessage.textContent = result.error;
        return;
      }
      
      document.getElementById('password-input').value = '';
      confirmPasswordInput.value = '';
      
      console.log(result.user);
      openDashboard();
    } else {
      throw new Error('Invalid Method');
    }
  } catch (error) {
    errorMessageToggle('block');
    errorMessage.textContent = `Error: ${error.message}`;
    if (altchaWidget) altchaWidget.reset();
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = method === 'register' ? 'Register' : 'Login';
    toggleMethod(method);
  }
});

altchaWidget.addEventListener('verified', (event) => {
  altchaPayload = event.detail;
  errorMessageToggle('none');
});

if (isAuthenticated()) openDashboard();

toggleMethod("login");
errorMessageToggle("none");

confirmPassword.forEach((element) => {
  element.style.display = 'none';
});