import {renderPicturesList} from './draw-pictures.js';
import {getData} from './server_data.js';
import { showAlert, generateArrayRandomSample, debounceFunction} from './util.js';

const TIMEOUT_DELAY = 500;
const RANDOM_COUNT = 10;
const FILTER_ACTIVE_BUTTON = 'img-filters__button--active';
const DEFAULT_FILTER_ID = 'filter-default';
const RANDOM_FILTER_ID = 'filter-random';
const DISCUSSED_FILTER_ID = 'filter-discussed';

const filterButtons = document.querySelectorAll('.img-filters__button');
let currentFilterId = DEFAULT_FILTER_ID;
let currentFilterButton = document.getElementById(DEFAULT_FILTER_ID);

const applyFilter = (pictures) => {
  switch (currentFilterId) {
    case DEFAULT_FILTER_ID:
      return pictures;
    case DISCUSSED_FILTER_ID:
      return pictures.slice().sort((a, b) => b.comments.length - a.comments.length);
    case RANDOM_FILTER_ID:
      return generateArrayRandomSample(pictures, RANDOM_COUNT);
  }
};

const updatePictures = (pictures) => {
  const filteredPictures = applyFilter(pictures);
  document.querySelectorAll('.picture').forEach((picture) => picture.remove());
  renderPicturesList(filteredPictures);
};

const createFilterClickHandler = (callback) => (event) => {
  currentFilterId = event.target.id;
  currentFilterButton.classList.remove(FILTER_ACTIVE_BUTTON);
  currentFilterButton = event.target;
  currentFilterButton.classList.add(FILTER_ACTIVE_BUTTON);
  callback();
};

getData()
  .then((pictures) => {
    renderPicturesList(pictures);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
    const onFilterClick = createFilterClickHandler(debounceFunction(() => updatePictures(pictures), TIMEOUT_DELAY));
    filterButtons.forEach((button) => button.addEventListener('click', onFilterClick));
  })
  .catch((error) => showAlert(error.message));
