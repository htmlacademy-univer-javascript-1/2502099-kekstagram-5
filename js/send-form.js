import {isKeyEscape} from './util.js';
import {sendData} from './server-data.js';
import {closeEditingForm, documentKeydownHandler} from './form.js';

const CLASS_SUCCESS_MODAL = 'success__inner';
const CLASS_ERROR_MODAL = 'error__inner';
const TEXT_LOADING_SUBMIT = 'Публикация...';
const TEXT_DEFAULT_SUBMIT = 'Опубликовать';

const uploadFormElement = document.getElementById('upload-select-image');
const imageEditingFormElement = uploadFormElement.querySelector('.img-upload__overlay');
const submitButtonElement = imageEditingFormElement.querySelector('.img-upload__submit');
const successModalTemplateElement = document.getElementById('success').content.querySelector('.success');
const successCloseButtonElement = successModalTemplateElement.querySelector('.success__button');
const errorModalTemplateElement = document.getElementById('error').content.querySelector('.error');
const errorCloseButtonElement = errorModalTemplateElement.querySelector('.error__button');

const disableSubmitButton = () => {
  submitButtonElement.disabled = true;
  submitButtonElement.textContent = TEXT_LOADING_SUBMIT;
};

const enableSubmitButton = () => {
  submitButtonElement.disabled = false;
  submitButtonElement.textContent = TEXT_DEFAULT_SUBMIT;
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
  successCloseButtonElement.removeEventListener('click', handleSuccessCloseClick);
  document.body.removeChild(successModalTemplateElement);
}

function hideErrorModal() {
  errorCloseButtonElement.removeEventListener('click', handleErrorCloseClick);
  document.removeEventListener('click', handleOutsideErrorClick);
  document.removeEventListener('keydown', handleErrorModalKeydown);
  document.body.removeChild(errorModalTemplateElement);
  document.addEventListener('keydown', documentKeydownHandler);
  imageEditingFormElement.classList.remove('hidden');
}

const showSuccessModal = () => {
  successCloseButtonElement.addEventListener('click', handleSuccessCloseClick);
  document.addEventListener('click', handleOutsideSuccessClick);
  document.addEventListener('keydown', handleSuccessModalKeydown);
  document.body.appendChild(successModalTemplateElement);
};

const showErrorModal = () => {
  document.removeEventListener('keydown', documentKeydownHandler);
  imageEditingFormElement.classList.add('hidden');
  errorCloseButtonElement.addEventListener('click', handleErrorCloseClick);
  document.addEventListener('click', handleOutsideErrorClick);
  document.addEventListener('keydown', handleErrorModalKeydown);
  document.body.appendChild(errorModalTemplateElement);
};

uploadFormElement.addEventListener('submit', (event) => {
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
