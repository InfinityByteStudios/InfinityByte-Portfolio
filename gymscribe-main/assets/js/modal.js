import { updateMember, deleteMember, renewMember } from './handler.js';
import { fetchMembers as loadMembers } from './members.js';

function deleteModal() {
  const existedModal = document.querySelector('.modal-backdrop');
  if (existedModal) {
    existedModal.remove();
  }
}

function createModal(modalType, ...options) {
  const existedModal = document.querySelector('.modal-backdrop');
  if (existedModal) {
    existedModal.remove();
  }
  
  const backdrop = document.createElement('div');
  backdrop.classList.add('modal-backdrop');
  document.body.append(backdrop);
  
  const modal = document.createElement('div');
  modal.classList.add('modal');
  backdrop.append(modal);
  
  const title = document.createElement('h1');
  title.classList.add('modal-title');
  modal.append(title);
  
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');
  modal.append(modalContainer);
  
  const modalButtons = document.createElement('div');
  modalButtons.classList.add('modal-buttons');
  modal.append(modalButtons);
  
  const actionButton = document.createElement('button');
  actionButton.classList.add('cyan-button');
  actionButton.textContent = 'Save';
  modalButtons.append(actionButton);
    
  const closeButton = document.createElement('button');
  closeButton.classList.add('red-button');
  closeButton.textContent = 'Close';
  modalButtons.append(closeButton);
  
  
  if (modalType === "memberView") {
    const nameTitle = document.createElement('h3');
    const nameContent = document.createElement('p');
    
    const emailTitle = document.createElement('h3');
    const emailContent = document.createElement('p');
    
    const phoneTitle = document.createElement('h3');
    const phoneContent = document.createElement('p');
    
    const birthdayTitle = document.createElement('h3');
    const birthdayContent = document.createElement('p');
    
    const noteTitle = document.createElement('h3');
    const noteContent = document.createElement('p');
    
    title.textContent = "Details";
    nameTitle.textContent = 'Name:';
    emailTitle.textContent = 'Email:';
    phoneTitle.textContent = 'Phone:';
    birthdayTitle.textContent = 'Birthday:';
    noteTitle.textContent = 'Note:';
    
    const [name, email, phone, birthday, note] = options;
    
    title.textContent = `Details`;
    nameContent.textContent = name;
    emailContent.textContent = email;
    phoneContent.textContent = phone;
    birthdayContent.textContent = birthday;
    noteContent.textContent = note;
    
    actionButton.remove();
    
    modalContainer.append(nameTitle, nameContent, emailTitle, emailContent, phoneTitle, phoneContent, birthdayTitle, birthdayContent, noteTitle, noteContent);
    
    backdrop.style.display = "flex";
  } else if (modalType === "memberEdit") {
    title.textContent = 'Edit Member';
    actionButton.textContent = 'Save';
    
    const [id, name, email, phone, birthday, note] = options;
    
    const form = document.getElementById('memberForm');
    const clonedForm = form.cloneNode(true);
    clonedForm.id = "memberEditForm";
    clonedForm.classList.add('edit-member-form');
    
    const clonedWithId = clonedForm.querySelectorAll('[id]');
    
    clonedWithId.forEach(element => {
      const oldId = element.id;
      let newId = oldId.replace(/^member/, '');
      newId = `editMember${newId}`;
      
      element.id = newId;
      
      if (element.tagName === 'LABEL' && element.hasAttribute('for')) {
        const oldFor = element.getAttribute('for');
        let newFor = oldFor.replace(/^member/, '');
        newFor = `editMember${newFor}`;
        element.setAttribute('for', newFor);
      }
    });
    
    const selectElement = clonedForm.querySelectorAll('.plans-select');
    selectElement.forEach(element => {
      element.remove();
    });
    
    const clonedSubmit = clonedForm.querySelector('#editMembersubmit');
    if (clonedSubmit) {
      clonedSubmit.remove();
    }
      
    actionButton.addEventListener('click', (e) => {
      e.preventDefault();
      clonedForm.requestSubmit();
    });
    
    modalContainer.append(clonedForm);
    
    const nameInput = clonedForm.querySelector('#editMemberNameInput');
    const emailInput = clonedForm.querySelector('#editMemberEmailInput');
    const phoneInput = clonedForm.querySelector('#editMemberPhoneInput');
    const birthdayInput = clonedForm.querySelector('#editMemberBirthdayInput');
    const noteInput = clonedForm.querySelector('#editMemberNoteInput');
    
    if (nameInput) nameInput.value = name || '';
    if (emailInput) emailInput.value = email || '';
    if (phoneInput) phoneInput.value = phone || '';
    if (birthdayInput) birthdayInput.value = birthday || '';
    if (noteInput) noteInput.value = note || '';
    
    clonedForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      actionButton.disabled = true;
      actionButton.textContent = 'Updating...';
      
      try {
        const updatedData = {
          fullname:  nameInput.value,
          email: emailInput.value,
          phone: phoneInput.value,
          birthday: birthdayInput.value,
          note: noteInput.value
        };
      
        const result = await updateMember(id, updatedData);
      
        if (result?.error) throw new Error(result.error);
        
        await loadMembers();
      } catch (error) {
        console.error(error.message);
      } finally {
        setTimeout(() => {
          actionButton.textContent = 'Save';
          actionButton.disabled = false;
          backdrop.remove();
        }, 2000);
      }
    });
  } else if (modalType === "memberRenew") {
    const [id] = options;
    actionButton.textContent = 'Confirm';
    title.textContent = 'Renew';
    
    const plansOptions = [
      {value: 'monthly', text:'Monthly (30d)'},
      {value: 'yearly', text: 'Yearly (365d)'},
      {value: 'lifetime', text: 'Lifetime (inf)'}
    ];
    
    const renewForm = document.createElement('form');
    renewForm.classList.add('renew-member-form');
    
    modalContainer.append(renewForm);
    
    const renewSelect = document.createElement('select');
    renewSelect.id = 'renew-select';
    
    const renewSelectLabel = document.createElement('label');
    renewSelectLabel.setAttribute('for', 'renew-select');
    renewSelectLabel.textContent = 'Select Plan:';
    
    renewForm.append(renewSelectLabel);
    renewForm.append(renewSelect);
    
    plansOptions.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      renewSelect.append(optionElement);
    });
    
    actionButton.addEventListener('click', (e) => {
      e.preventDefault();
      renewForm.requestSubmit();
    });
    
    renewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      actionButton.disabled = true;
      actionButton.textContent = 'Updating...';
      
      try {
        const selectedPlan = renewSelect.value;
        
        const result = await renewMember(id, selectedPlan);
        
        if (result?.error) throw new Error(result.error);
        
        await loadMembers();
      } catch (error) {
        console.error(error.message);
      } finally {
        setTimeout(() => {
          actionButton.textContent = 'Renew';
          actionButton.disabled = false;
          backdrop.remove();
        }, 2000);
      }
    })
  } else if (modalType === 'memberRemove') {
    const [id, name] = options;
    actionButton.textContent = 'Remove';
    title.textContent = 'Remove';
    
    const removeWarning = document.createElement('h3');
    removeWarning.textContent = `Are you sure want to remove ${name}?`;
    
    modalContainer.append(removeWarning);
    
    actionButton.addEventListener('click', async (e) => {
      e.preventDefault();
      
      actionButton.disabled = true;
      actionButton.textContent = 'Removing...';
      
      try {
        const result = await deleteMember(id);
        
        if (result?.error) throw new Error(result.error);
        
        await loadMembers();
      } catch (error) {
        console.error(error.message);
      } finally {
        setTimeout(() => {
          actionButton.textContent = 'Remove';
          actionButton.disabled = false;
          backdrop.remove();
        }, 2000);
      }
    })
  } else {
    throw new Error('No type found: ' + Error);
  }
  
  closeButton.addEventListener('click', (e) => {
    backdrop.remove();
  });
}

export { createModal, deleteModal };