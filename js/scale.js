const MIN_ZOOM = 25;
const MAX_ZOOM = 100;
const ZOOM_STEP = 25;
const DEFAULT_ZOOM = 100;

const decreaseZoomButton = document.querySelector('.scale__control--smaller');
const increaseZoomButton = document.querySelector('.scale__control--bigger');
const zoomValueDisplay = document.querySelector('.scale__control--value');
const previewImage = document.querySelector('.img-upload__preview img');

const adjustZoom = (direction) => {
  let currentZoom = parseInt(zoomValueDisplay.value, 10) || DEFAULT_ZOOM;
  const updatedZoom = currentZoom + direction * ZOOM_STEP;

  if (updatedZoom >= MIN_ZOOM && updatedZoom <= MAX_ZOOM) {
    currentZoom = updatedZoom;
    zoomValueDisplay.value = `${currentZoom}%`;
    previewImage.style.transform = `scale(${currentZoom / 100})`;
  }
};

const onDecreaseZoomButtonClick = () => adjustZoom(-1);
const onIncreaseZoomButtonClick = () => adjustZoom(1);

const addZoomEventListeners = () => {
  decreaseZoomButton.addEventListener('click', onDecreaseZoomButtonClick);
  increaseZoomButton.addEventListener('click', onIncreaseZoomButtonClick);
};

const removeZoomEventListeners = () => {
  decreaseZoomButton.removeEventListener('click', onDecreaseZoomButtonClick);
  increaseZoomButton.removeEventListener('click', onIncreaseZoomButtonClick);
};

const resetPreviewImageZoom = () => {
  previewImage.style.transform = `scale(${DEFAULT_ZOOM / 100})`;
  zoomValueDisplay.value = `${DEFAULT_ZOOM}%`;
};

export { addZoomEventListeners, removeZoomEventListeners, resetPreviewImageZoom };
