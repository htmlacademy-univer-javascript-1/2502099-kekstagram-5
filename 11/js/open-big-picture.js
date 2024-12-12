import {isEscapeKey} from './util.js';

const bigPictureElement = document.querySelector('.big-picture');
const bigPictureClose = bigPictureElement.querySelector('.big-picture__cancel');
const bigPictureImage = bigPictureElement.querySelector('.big-picture__img').querySelector('img');
const bigPictureLikesCount = bigPictureElement.querySelector('.likes-count');
const bigPictureDescription = bigPictureElement.querySelector('.social__caption');
const bigPictureCommentsList = bigPictureElement.querySelector('.social__comments');
const bigPictureCommentTemplate = bigPictureCommentsList.querySelector('.social__comment');
const bigPictureCommentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const bigPictureCommentsCountElement = bigPictureElement.querySelector('.social__comment-count');

const COMMENT_LIST_STEP = 5;

let currentPicture;
let currentCommentsCount = 0;

const clearCommentsList = () => {
  bigPictureCommentsList.textContent = '';
};
const getFormatedComment = (comment) => {
  const formatedComment = bigPictureCommentTemplate.cloneNode(true);
  const commentAutorImage = formatedComment.querySelector('.social__picture');
  commentAutorImage.src = comment.avatar;
  commentAutorImage.alt = comment.name;
  formatedComment.querySelector('.social__text').textContent = comment.message;
  return formatedComment;
};

const showComments = () => {
  let commentIndex = 0;
  for (let i = currentCommentsCount; i < currentCommentsCount + COMMENT_LIST_STEP ; i++) {
    commentIndex = i;
    bigPictureCommentsList.appendChild(getFormatedComment(currentPicture.comments[i]));
    if (commentIndex === currentPicture.comments.length - 1) {
      bigPictureCommentsLoaderElement.classList.add('hidden');
      break;
    }
  }
  currentCommentsCount = commentIndex + 1;
  bigPictureCommentsCountElement.textContent = `${currentCommentsCount} из ${currentPicture.comments.length} комментариев`;
};

const changeBigPicture = () => {
  bigPictureImage.src = currentPicture.url;
  bigPictureLikesCount.textContent = currentPicture.likes;
  bigPictureDescription.textContent = currentPicture.description;

  clearCommentsList();
  showComments(currentPicture);
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    // eslint-disable-next-line no-use-before-define
    closeBigPicture();
  }
};
// eslint-disable-next-line no-use-before-define
const onCloseElementClick = () => closeBigPicture();
const onCommentsLoaderElementClick = () => showComments();

const openBigPicture = (picture) => {
  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  bigPictureCommentsLoaderElement.classList.remove('hidden');
  bigPictureClose.addEventListener('click', onCloseElementClick);
  bigPictureCommentsLoaderElement.addEventListener('click', onCommentsLoaderElementClick);
  currentPicture = picture;
  changeBigPicture();
};

bigPictureCommentsLoaderElement.addEventListener('click', () => {
  showComments();
});


const closeBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  bigPictureCommentsLoaderElement.classList.add('hidden');
  bigPictureClose.removeEventListener('click', onCloseElementClick);
  bigPictureCommentsLoaderElement.removeEventListener('click', onCommentsLoaderElementClick);
  currentCommentsCount = 0;
};

bigPictureClose.addEventListener('click', () => {
  closeBigPicture();
});


export {openBigPicture};
