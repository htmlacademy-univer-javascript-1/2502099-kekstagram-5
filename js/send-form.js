import {isKeyEscape} from './util.js';
import {sendData} from './server-data.js';
import {closeEditingForm, handleDocumentKeydown} from './form.js';

const CLASS_SUCCESS_MODAL = 'success__inner';
const CLASS_ERROR_MODAL = 'error__inner';
const TEXT_LOADING_SUBMIT = 'Публикация...';
const TEXT_DEFAULT_SUBMIT = 'Опубликовать';

const uploadForm = document.getElementById('upload-select-image');
const imageEditingForm = uploadForm.querySelector('.img-upload__overlay');
const submitButton = imageEditingForm.querySelector('.img-upload__submit');
const successModalTemplate = document.getElementById('success').content.querySelector('.success');
const successCloseButton = successModalTemplate.querySelector('.success__button');
const errorModalTemplate = document.getElementById('error').content.querySelector('.error');
const errorCloseButton = errorModalTemplate.querySelector('.error__button');

const disableSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = TEXT_LOADING_SUBMIT;
};

const enableSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = TEXT_DEFAULT_SUBMIT;
};

const createOutsideClickHandler = (className, callback) => (event) => {
  if (!event.target.closest(`.${className}`)) {
    callback();
  }
};

const createEscapeKeydownHandler = (callback) => (event) => {
  if (isKeyEscape(event)) {
    event.preventDefault();
    callback();
  }
};

const handleOutsideSuccessClick = createOutsideClickHandler(CLASS_SUCCESS_MODAL, hideSuccessModal);
const handleOutsideErrorClick = createOutsideClickHandler(CLASS_ERROR_MODAL, hideErrorModal);
const handleErrorCloseClick = () => hideErrorModal();
const handleSuccessCloseClick = () => hideSuccessModal();
const handleSuccessModalKeydown = createEscapeKeydownHandler(hideSuccessModal);
const handleErrorModalKeydown = createEscapeKeydownHandler(hideErrorModal);

function hideSuccessModal() {
  document.removeEventListener('click', handleOutsideSuccessClick);
  document.removeEventListener('keydown', handleSuccessModalKeydown);
  successCloseButton.removeEventListener('click', handleSuccessCloseClick);
  document.body.removeChild(successModalTemplate);
}

function hideErrorModal() {
  errorCloseButton.removeEventListener('click', handleErrorCloseClick);
  document.removeEventListener('click', handleOutsideErrorClick);
  document.removeEventListener('keydown', handleErrorModalKeydown);
  document.body.removeChild(errorModalTemplate);
  document.addEventListener('keydown', handleDocumentKeydown);
  imageEditingForm.classList.remove('hidden');
}

const showSuccessModal = () => {
  successCloseButton.addEventListener('click', handleSuccessCloseClick);
  document.addEventListener('click', handleOutsideSuccessClick);
  document.addEventListener('keydown', handleSuccessModalKeydown);
  document.body.appendChild(successModalTemplate);
};

const showErrorModal = () => {
  document.removeEventListener('keydown', handleDocumentKeydown);
  imageEditingForm.classList.add('hidden');
  errorCloseButton.addEventListener('click', handleErrorCloseClick);
  document.addEventListener('click', handleOutsideErrorClick);
  document.addEventListener('keydown', handleErrorModalKeydown);
  document.body.appendChild(errorModalTemplate);
};

uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  disableSubmitButton();

  sendData(new FormData(event.target))
    .then(() => {
      closeEditingForm();
      showSuccessModal();
    })
    .catch(showErrorModal)
    .finally(enableSubmitButton);
});
