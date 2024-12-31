import { isKeyEscape } from './util.js';

const CLASS_HIDDEN = 'hidden';
const CLASS_MODAL_OPEN = 'modal-open';
const COMMENTS_LOAD_STEP = 5;

const bigPictureModalElement = document.querySelector('.big-picture');
const closeBigPictureButtonElement = bigPictureModalElement.querySelector('.big-picture__cancel');
const bigPictureImageElement = bigPictureModalElement.querySelector('.big-picture__img img');
const bigPictureLikesCountElement = bigPictureModalElement.querySelector('.likes-count');
const bigPictureDescriptionElement = bigPictureModalElement.querySelector('.social__caption');
const commentsListElement = bigPictureModalElement.querySelector('.social__comments');
const commentTemplateElement = commentsListElement.querySelector('.social__comment');
const commentsLoaderButtonElement = bigPictureModalElement.querySelector('.comments-loader');
const commentsCountDisplayElement = bigPictureModalElement.querySelector('.social__comment-count');

let currentPictureData;
let currentCommentsIndex = 0;

const clearCommentsList = () => {
  commentsListElement.innerHTML = '';
};

const createCommentElement = (comment) => {
  const commentElement = commentTemplateElement.cloneNode(true);
  const commentAvatar = commentElement.querySelector('.social__picture');
  commentAvatar.src = comment.avatar;
  commentAvatar.alt = comment.name;
  commentElement.querySelector('.social__text').textContent = comment.message;
  return commentElement;
};

const renderComments = () => {
  const commentsFragment = document.createDocumentFragment();
  const commentsToRender = currentPictureData.comments.slice(currentCommentsIndex, currentCommentsIndex + COMMENTS_LOAD_STEP);

  commentsToRender.forEach((comment) => {
    commentsFragment.appendChild(createCommentElement(comment));
  });

  commentsListElement.appendChild(commentsFragment);
  currentCommentsIndex += commentsToRender.length;

  if (currentCommentsIndex >= currentPictureData.comments.length) {
    commentsLoaderButtonElement.classList.add(CLASS_HIDDEN);
  } else {
    commentsLoaderButtonElement.classList.remove(CLASS_HIDDEN);
  }

  commentsCountDisplayElement.innerHTML = `${currentCommentsIndex} из <span class="comments-count">${currentPictureData.comments.length}</span> комментариев`;
};

const updateBigPictureDisplay = () => {
  bigPictureImageElement.src = currentPictureData.url;
  bigPictureLikesCountElement.textContent = currentPictureData.likes;
  bigPictureDescriptionElement.textContent = currentPictureData.description;

  clearCommentsList();
  renderComments();
};

const documentKeydownHandler = (event) => {
  if (isKeyEscape(event)) {
    event.preventDefault();
    closeBigPictureModal();
  }
};

const closeButtonClickHandler = () => closeBigPictureModal();
const commentsLoaderClickHandler = () => renderComments();

const openBigPictureModal = (pictureData) => {
  currentPictureData = pictureData;
  currentCommentsIndex = 0;
  updateBigPictureDisplay();
  document.addEventListener('keydown', documentKeydownHandler);
  closeBigPictureButtonElement.addEventListener('click', closeButtonClickHandler);
  commentsLoaderButtonElement.addEventListener('click', commentsLoaderClickHandler);
  document.body.classList.add(CLASS_MODAL_OPEN);
  bigPictureModalElement.classList.remove(CLASS_HIDDEN);
};

function closeBigPictureModal() {
  bigPictureModalElement.classList.add(CLASS_HIDDEN);
  document.body.classList.remove(CLASS_MODAL_OPEN);
  commentsLoaderButtonElement.classList.remove(CLASS_HIDDEN);
  document.removeEventListener('keydown', documentKeydownHandler);
  closeBigPictureButtonElement.removeEventListener('click', closeButtonClickHandler);
  commentsLoaderButtonElement.removeEventListener('click', commentsLoaderClickHandler);
}

export { openBigPictureModal };
