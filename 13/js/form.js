import { hasDuplicates, isKeyEscape } from './util.js';
import { initializeEffects, clearEffects } from './effects.js';
import { addZoomEventListeners, removeZoomEventListeners, resetPreviewImageZoom } from './scale.js';
import './send-form.js';

const CLASS_HIDDEN = 'hidden';
const CLASS_MODAL_OPEN = 'modal-open';
const STYLE_BACKGROUND_IMAGE = 'background-image';
const DEFAULT_IMAGE_PATH = 'img/upload-default-image.jpg';
const ALLOWED_FILE_FORMATS = ['jpg', 'jpeg', 'png'];
const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAGS = 5;
const HASHTAG_PATTERN = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;
const PRISTINE_ERROR_CLASS = 'upload-form__error-text';

const uploadForm = document.getElementById('upload-select-image');
const imagePreview = uploadForm.querySelector('.img-upload__preview img');
const effectsPreviews = uploadForm.querySelectorAll('.effects__preview');
const imageInput = uploadForm.querySelector('.img-upload__input');
const editingForm = uploadForm.querySelector('.img-upload__overlay');
const closeFormButton = editingForm.querySelector('.img-upload__cancel');
const submitButton = editingForm.querySelector('.img-upload__submit');
const hashtagsInput = uploadForm.querySelector('.text__hashtags');
const descriptionInput = uploadForm.querySelector('.text__description');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: PRISTINE_ERROR_CLASS
}, true);

let hashtagErrorMessage = '';

const isHashtagValid = (hashtagString) => {
  hashtagErrorMessage = '';
  hashtagString = hashtagString.trim().toLowerCase();

  if (!hashtagString) {
    return true;
  }

  const hashtags = hashtagString.split(/\s+/);

  if (hashtags.length > MAX_HASHTAGS) {
    hashtagErrorMessage = `Превышено допустимое количество хэш-тегов: ${MAX_HASHTAGS}!`;
    return false;
  }

  if (hashtags.some((hashtag) => !HASHTAG_PATTERN.test(hashtag))) {
    hashtagErrorMessage = 'Введён невалидный хэш-тег!';
    return false;
  }

  if (hasDuplicates(hashtags)) {
    hashtagErrorMessage = 'Хэш-теги не должны повторяться!';
    return false;
  }

  return true;
};

const handleFormInput = () => {
  submitButton.disabled = !pristine.validate();
};

const isDescriptionValid = (descriptionString) => descriptionString.length <= MAX_COMMENT_LENGTH;

const getHashtagErrorMessage = () => hashtagErrorMessage;

pristine.addValidator(hashtagsInput, isHashtagValid, getHashtagErrorMessage);
pristine.addValidator(descriptionInput, isDescriptionValid, `Длина комментария не может составлять больше ${MAX_COMMENT_LENGTH} символов!`);

const handleDocumentKeydown = (evt) => {
  if (isKeyEscape(evt) && evt.target !== hashtagsInput && evt.target !== descriptionInput) {
    closeEditingForm();
  }
};

const handleCloseFormButtonClick = () => closeEditingForm();

function closeEditingForm() {
  editingForm.classList.add(CLASS_HIDDEN);
  document.body.classList.remove(CLASS_MODAL_OPEN);

  submitButton.disabled = false;
  imageInput.value = '';
  imagePreview.src = DEFAULT_IMAGE_PATH;
  effectsPreviews.forEach((preview) => {
    preview.style.removeProperty(STYLE_BACKGROUND_IMAGE);
  });

  clearEffects();
  resetPreviewImageZoom();
  removeZoomEventListeners();

  closeFormButton.removeEventListener('click', handleCloseFormButtonClick);
  document.removeEventListener('keydown', handleDocumentKeydown);
  hashtagsInput.removeEventListener('input', handleFormInput);
  descriptionInput.removeEventListener('input', handleFormInput);

  uploadForm.reset();
  pristine.reset();
}

const openEditingForm = () => {
  const imageFile = imageInput.files[0];

  if (ALLOWED_FILE_FORMATS.some((format) => imageFile.name.toLowerCase().endsWith(format))) {
    const imageURL = URL.createObjectURL(imageFile);
    imagePreview.src = imageURL;
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url('${imageURL}')`;
    });
  }

  initializeEffects();
  addZoomEventListeners();

  closeFormButton.addEventListener('click', handleCloseFormButtonClick);
  document.addEventListener('keydown', handleDocumentKeydown);
  hashtagsInput.addEventListener('input', handleFormInput);
  descriptionInput.addEventListener('input', handleFormInput);

  document.body.classList.add(CLASS_MODAL_OPEN);
  editingForm.classList.remove(CLASS_HIDDEN);
};

const handleImageInputChange = () => openEditingForm();

imageInput.addEventListener('change', handleImageInputChange);

export { closeEditingForm, handleDocumentKeydown };
