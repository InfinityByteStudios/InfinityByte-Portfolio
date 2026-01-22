import { init, updateGymInfo, journalsSave, journalsLoad, journalsClear, journalsReset, attendanceSave, attendanceLoad, attendanceClear, attendanceReset, changePassword } from './handler.js';
import { initGymInfo } from './getGymInfo.js';

const form = document.getElementById('gymSettingForm');
const nameInput = document.getElementById('nameInput');
const ownerInput = document.getElementById('ownerInput');
const addressInput = document.getElementById('addressInput');
const descInput = document.getElementById('descInput');
const submitBtn = document.getElementById('form-submit');

const journalsSaveBtn = document.getElementById('journals-save');
const journalsLoadBtn = document.getElementById('journals-load');
const journalsClearBtn = document.getElementById('journals-clear');
const journalsResetBtn = document.getElementById('journals-reset');

const attendanceSaveBtn = document.getElementById('attendance-save');
const attendanceLoadBtn = document.getElementById('attendance-load');
const attendanceClearBtn = document.getElementById('attendance-clear');
const attendanceResetBtn = document.getElementById('attendance-reset');

const changePasswordForm = document.getElementById('changePasswordForm');
const oldPasswordInput = document.getElementById('oldPasswordInput');
const newPasswordInput = document.getElementById('newPasswordInput');
const confirmPasswordInput = document.getElementById('confirmPasswordInput');
const passwordSubmit = document.getElementById('password-submit');

let allowClick = true;

document.addEventListener('DOMContentLoaded', async (e) => {
  await init();
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';
    
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const gymData = {
        name: nameInput.value.trim(),
        owner: ownerInput.value.trim(),
        description: descInput.value.trim(),
        address: addressInput.value.trim(),
        timezone: userTimezone
      };
      
      const result = await updateGymInfo(gymData);
      if (result?.error) throw new Error(result.error);
    } catch (error) {
      console.error(error.message);
    } finally {
      await initGymInfo();
      nameInput.value = '';
      ownerInput.value = '';
      descInput.value = '';
      addressInput.value = '';
        
      setTimeout(() => {
        submitBtn.textContent = 'Update';
        submitBtn.disabled = false;
      }, 2000);
    }
  });
  
  journalsSaveBtn.addEventListener('click', async () => {
    if (!allowClick) return;
    
    allowClick = false;
    journalsSaveBtn.disabled = true;
    journalsSaveBtn.textContent = 'Loading...';
    
    try {
      await journalsSave();
    } catch (error) {
      console.error(error.message);
    } finally {
      setTimeout(() => {
        journalsSaveBtn.textContent = 'Save data to server';
        journalsSaveBtn.disabled = false;
        allowClick = true;
      }, 2000);
    }
  });
  
  journalsLoadBtn.addEventListener('click', async () => {
    if (!allowClick) return;
    
    allowClick = false;
    journalsLoadBtn.disabled = true;
    journalsLoadBtn.textContent = 'Loading...';
    
    try {
      await journalsLoad();
    } catch (error) {
      console.error(error.message);
    } finally {
      setTimeout(() => {
        journalsLoadBtn.textContent = 'Load data from server';
        journalsLoadBtn.disabled = false;
        allowClick = true;
      }, 2000);
    }
  });
  
  journalsClearBtn.addEventListener('click', () => {
    if (!allowClick) return;
    
    allowClick = false;
    journalsClearBtn.disabled = true;
    journalsClearBtn.textContent = 'Loading...';
    
    try {
      journalsClear();
    } catch (error) {
      console.error(error.message);
    } finally {
      setTimeout(() => {
        journalsClearBtn.textContent = 'Clear local data';
        journalsClearBtn.disabled = false;
        allowClick = true;
      }, 2000);
    }
  });
  
  journalsResetBtn.addEventListener('click', async () => {
    if (!allowClick) return;
    
    allowClick = false;
    journalsResetBtn.disabled = true;
    journalsResetBtn.textContent = 'Loading...';
    
    try {
      await journalsReset();
    } catch (error) {
      console.error(error.message);
    } finally {
      setTimeout(() => {
        journalsResetBtn.textContent = 'Clear local and server data';
        journalsResetBtn.disabled = false;
        allowClick = true;
      }, 2000);
    }
  });
  
  attendanceSaveBtn.addEventListener('click', async () => {
    if (!allowClick) return;
    
    allowClick = false;
    attendanceSaveBtn.disabled = true;
    attendanceSaveBtn.textContent = 'Loading...';
    
    try {
      await attendanceSave();
    } catch (error) {
      console.error(error.message);
    } finally {
      setTimeout(() => {
        attendanceSaveBtn.textContent = 'Save data to server';
        attendanceSaveBtn.disabled = false;
        allowClick = true;
      }, 2000);
    }
  });
  
  attendanceClearBtn.addEventListener('click', () => {
    if (!allowClick) return;
    
    allowClick = false;
    attendanceClearBtn.disabled = true;
    attendanceClearBtn.textContent = 'Loading...';
    
    try {
      attendanceClear();
    } catch (error) {
      console.error(error.message);
    } finally {
      setTimeout(() => {
        attendanceClearBtn.textContent = 'Clear local data';
        attendanceClearBtn.disabled = false;
        allowClick = true;
      }, 2000);
    }
  });
  
  attendanceResetBtn.addEventListener('click', async () => {
    if (!allowClick) return;
    
    allowClick = false;
    attendanceResetBtn.disabled = true;
    attendanceResetBtn.textContent = 'Loading...';
    
    try {
      await attendanceReset();
    } catch (error) {
      console.error(error.message);
    } finally {
      setTimeout(() => {
        attendanceResetBtn.textContent = 'Clear local and server data';
        attendanceResetBtn.disabled = false;
        allowClick = true;
      }, 2000);
    }
  });
  
  changePasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    passwordSubmit.disabled = true;
    passwordSubmit.textContent = 'Loading...';
    
    const oldPass = (oldPasswordInput.value || '').trim();
    const newPass = (newPasswordInput.value || '').trim();
    const confirmPass = (confirmPasswordInput.value || '').trim();
    
    console.log(`Debug: ${oldPass}, ${newPass}, ${confirmPass}`);
    
    try {
      if (!oldPass) throw new Error('Old password is required');
      if (!newPass) throw new Error('New password is required');
      if (!confirmPass) throw new Error('Confirm password is required');
      
      if (newPass !== confirmPass) {
        passwordSubmit.textContent = 'Confirm password not match';
        throw new Error('Confirm password not match');
      }
      
      const changePass = await changePassword(oldPass,newPass);
      
      if (changePass.error) {
        passwordSubmit.textContent = changePass.error;
        throw new Error('Failed to change password');
      }
    } catch (error) {
      console.error(error.message);
      passwordSubmit.textContent = error.message;
    } finally {
      setTimeout(() => {
        passwordSubmit.textContent = 'Change Password';
        passwordSubmit.disabled = false;
      }, 2000);
    }
  });
});