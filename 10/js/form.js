import { isEscapeKey, checkRepeats } from './util.js';
import { addEventListenerToScaleElements, removeEventListenerFromScaleElements, addFilter, removeFilter } from './effects.js';

const MAX_LENGTH_COMMENT = 140;
const MAX_HASHTAGS_COUNT = 5;
const re = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;
const errorClass = 'upload-form__error-text';
let messageHashtagError = '';

const uploadForm = document.querySelector('.img-upload__form');
const loadImgElement = uploadForm.querySelector('.img-upload__input');
const editingWindowElement = uploadForm.querySelector('.img-upload__overlay');
const cancelElement = editingWindowElement.querySelector('.img-upload__cancel');
const submitElement = uploadForm.querySelector('.img-upload__submit');
const hashtagsInputElement = uploadForm.querySelector('.text__hashtags');
const descriptionInputElement = uploadForm.querySelector('.text__description');
const scaleImageValueElement = uploadForm.querySelector('.scale__control--value');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: errorClass
}, true);

const validateHashtag = (hashtagString) => {
  messageHashtagError = '';
  hashtagString = hashtagString.trim().toLowerCase();
  const hashtags = hashtagString.split(/\s+/);

  if(!hashtagString) {
    return true;
  }

  for (const hashtag of hashtags) {
    if (!re.test(hashtag)) {
      messageHashtagError = 'Введён невалидный хэш-тег!';
      return false;
    }
  }
  if (hashtags.length > MAX_HASHTAGS_COUNT) {
    messageHashtagError = `Превышено допустимое количество хэш-тегов: ${MAX_HASHTAGS_COUNT}!`;
    return false;
  }
  if (checkRepeats(hashtags)) {
    messageHashtagError = 'Хэш-теги не должны повторяться!';
    return false;
  }
  return true;
};

const toggleSubmitButton = () => {
  submitElement.disabled = !pristine.validate();
};

const validateDescription = (value) => value.length <= MAX_LENGTH_COMMENT;

const getMessageHashtagError = () => messageHashtagError;

pristine.addValidator(hashtagsInputElement, validateHashtag, getMessageHashtagError);
pristine.addValidator(descriptionInputElement, validateDescription, `Длина комментария не может составлять больше ${MAX_LENGTH_COMMENT} символов`);

const resetForm = () => {
  hashtagsInputElement.value = '';
  descriptionInputElement.value = '';
  loadImgElement.value = '';
  document.querySelectorAll(`.${errorClass}`).forEach((errorContainer) => {
    errorContainer.style.display = 'none';
  });
};

const openEditingWindow = () => {
  editingWindowElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  addEventListenerToScaleElements();
  addFilter();
};

const stopPropagation = (event) => event.stopPropagation();

const closeEditingWindow = () => {
  editingWindowElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetForm();
  // eslint-disable-next-line no-use-before-define
  addEventListeners(false);
  removeEventListenerFromScaleElements();
  removeFilter();
  scaleImageValueElement.value = '100%';
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeEditingWindow();
  }
};
const addEventListeners = (isOpen) => {
  const action = isOpen ? 'addEventListener' : 'removeEventListener';
  cancelElement[action]('click', closeEditingWindow);
  document[action]('keydown', onDocumentKeydown);
  hashtagsInputElement[action]('keydown', stopPropagation);
  descriptionInputElement[action]('keydown', stopPropagation);
  hashtagsInputElement[action]('input', toggleSubmitButton);
  descriptionInputElement[action]('input', toggleSubmitButton);
};

loadImgElement.addEventListener('change', () => {
  addEventListeners(true);
  openEditingWindow();
});

