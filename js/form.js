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

const uploadFormElement = document.querySelector('upload-select-image');
const imagePreviewElement = uploadFormElement.querySelector('.img-upload__preview img');
const effectsPreviewsElement = uploadFormElement.querySelectorAll('.effects__preview');
const imageInputElement = uploadFormElement.querySelector('.img-upload__input');
const editingFormElement = uploadFormElement.querySelector('.img-upload__overlay');
const closeFormButtonElement = editingFormElement.querySelector('.img-upload__cancel');
const submitButtonElement = editingFormElement.querySelector('.img-upload__submit');
const hashtagsInputElement = uploadFormElement.querySelector('.text__hashtags');
const descriptionInputElement = uploadFormElement.querySelector('.text__description');

const pristine = new Pristine(uploadFormElement, {
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

const formInputHandler = () => {
  submitButtonElement.disabled = !pristine.validate();
};

const isDescriptionValid = (descriptionString) => descriptionString.length <= MAX_COMMENT_LENGTH;

const getHashtagErrorMessage = () => hashtagErrorMessage;

pristine.addValidator(hashtagsInputElement, isHashtagValid, getHashtagErrorMessage);
pristine.addValidator(descriptionInputElement, isDescriptionValid, `Длина комментария не может составлять больше ${MAX_COMMENT_LENGTH} символов!`);

const documentKeydownHandler = (evt) => {
  if (isKeyEscape(evt) && evt.target !== hashtagsInputElement && evt.target !== descriptionInputElement) {
    closeEditingForm();
  }
};

const closeFormButtonClickHandler = () => closeEditingForm();

function closeEditingForm() {
  editingFormElement.classList.add(CLASS_HIDDEN);
  document.body.classList.remove(CLASS_MODAL_OPEN);

  submitButtonElement.disabled = false;
  imageInputElement.value = '';
  imagePreviewElement.src = DEFAULT_IMAGE_PATH;
  effectsPreviewsElement.forEach((preview) => {
    preview.style.removeProperty(STYLE_BACKGROUND_IMAGE);
  });

  clearEffects();
  resetPreviewImageZoom();
  removeZoomEventListeners();

  closeFormButtonElement.removeEventListener('click', closeFormButtonClickHandler);
  document.removeEventListener('keydown', documentKeydownHandler);
  hashtagsInputElement.removeEventListener('input', formInputHandler);
  descriptionInputElement.removeEventListener('input', formInputHandler);

  uploadFormElement.reset();
  pristine.reset();
}

const openEditingForm = () => {
  const imageFile = imageInputElement.files[0];

  if (ALLOWED_FILE_FORMATS.some((format) => imageFile.name.toLowerCase().endsWith(format))) {
    const imageURL = URL.createObjectURL(imageFile);
    imagePreviewElement.src = imageURL;
    effectsPreviewsElement.forEach((preview) => {
      preview.style.backgroundImage = `url('${imageURL}')`;
    });
  }

  initializeEffects();
  addZoomEventListeners();

  closeFormButtonElement.addEventListener('click', closeFormButtonClickHandler);
  document.addEventListener('keydown', documentKeydownHandler);
  hashtagsInputElement.addEventListener('input', formInputHandler);
  descriptionInputElement.addEventListener('input', formInputHandler);

  document.body.classList.add(CLASS_MODAL_OPEN);
  editingFormElement.classList.remove(CLASS_HIDDEN);
};

const imageInputChangeHandler = () => openEditingForm();

imageInputElement.addEventListener('change', imageInputChangeHandler);

export { closeEditingForm, documentKeydownHandler };
