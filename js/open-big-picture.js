import { isKeyEscape } from './util.js';

const CLASS_HIDDEN = 'hidden';
const CLASS_MODAL_OPEN = 'modal-open';
const COMMENTS_LOAD_STEP = 5;

const bigPictureModal = document.querySelector('.big-picture');
const closeBigPictureButton = bigPictureModal.querySelector('.big-picture__cancel');
const bigPictureImage = bigPictureModal.querySelector('.big-picture__img img');
const bigPictureLikesCount = bigPictureModal.querySelector('.likes-count');
const bigPictureDescription = bigPictureModal.querySelector('.social__caption');
const commentsList = bigPictureModal.querySelector('.social__comments');
const commentTemplate = commentsList.querySelector('.social__comment');
const commentsLoaderButton = bigPictureModal.querySelector('.comments-loader');
const commentsCountDisplay = bigPictureModal.querySelector('.social__comment-count');

let currentPictureData;
let currentCommentsIndex = 0;

const clearCommentsList = () => {
  commentsList.innerHTML = '';
};

const createCommentElement = (comment) => {
  const commentElement = commentTemplate.cloneNode(true);
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

  commentsList.appendChild(commentsFragment);
  currentCommentsIndex += commentsToRender.length;

  if (currentCommentsIndex >= currentPictureData.comments.length) {
    commentsLoaderButton.classList.add(CLASS_HIDDEN);
  } else {
    commentsLoaderButton.classList.remove(CLASS_HIDDEN);
  }

  commentsCountDisplay.innerHTML = `${currentCommentsIndex} из <span class="comments-count">${currentPictureData.comments.length}</span> комментариев`;
};

const updateBigPictureDisplay = () => {
  bigPictureImage.src = currentPictureData.url;
  bigPictureLikesCount.textContent = currentPictureData.likes;
  bigPictureDescription.textContent = currentPictureData.description;

  clearCommentsList();
  renderComments();
};

const handleDocumentKeydown = (event) => {
  if (isKeyEscape(event)) {
    event.preventDefault();
    closeBigPictureModal();
  }
};

const handleCloseButtonClick = () => closeBigPictureModal();
const handleCommentsLoaderClick = () => renderComments();

const openBigPictureModal = (pictureData) => {
  currentPictureData = pictureData;
  currentCommentsIndex = 0;
  updateBigPictureDisplay();
  document.addEventListener('keydown', handleDocumentKeydown);
  closeBigPictureButton.addEventListener('click', handleCloseButtonClick);
  commentsLoaderButton.addEventListener('click', handleCommentsLoaderClick);
  document.body.classList.add(CLASS_MODAL_OPEN);
  bigPictureModal.classList.remove(CLASS_HIDDEN);
};

function closeBigPictureModal() {
  bigPictureModal.classList.add(CLASS_HIDDEN);
  document.body.classList.remove(CLASS_MODAL_OPEN);
  commentsLoaderButton.classList.remove(CLASS_HIDDEN);
  document.removeEventListener('keydown', handleDocumentKeydown);
  closeBigPictureButton.removeEventListener('click', handleCloseButtonClick);
  commentsLoaderButton.removeEventListener('click', handleCommentsLoaderClick);
}

export { openBigPictureModal };
