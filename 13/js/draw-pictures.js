import { openBigPictureModal } from './open-big-picture.js';

const picturesContainerElement = document.querySelector('.pictures');
const pictureTemplateElement = document.getElementById('picture').content.querySelector('.picture');

let displayedPictures = [];

const renderPictures = (pictures) => {
  displayedPictures = pictures;
  const picturesFragment = document.createDocumentFragment();

  pictures.forEach(({ url, description, likes, comments }) => {
    const pictureElement = pictureTemplateElement.cloneNode(true);
    const pictureImageElement = pictureElement.querySelector('.picture__img');
    pictureImageElement.src = url;
    pictureImageElement.alt = description;
    pictureElement.querySelector('.picture__likes').textContent = likes;
    pictureElement.querySelector('.picture__comments').textContent = comments.length;
    picturesFragment.appendChild(pictureElement);
  });

  picturesContainerElement.querySelectorAll('.picture').forEach((picture) => picture.remove());
  picturesContainerElement.appendChild(picturesFragment);
};

picturesContainerElement.addEventListener('click', (evt) => {
  const clickedPictureElement = evt.target.closest('.picture');
  if (clickedPictureElement) {
    const picture = displayedPictures.find((pic) => pic.url === clickedPictureElement.querySelector('.picture__img').getAttribute('src'));
    openBigPictureModal(picture);
  }
});

export { renderPictures };
