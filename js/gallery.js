import { renderPictures } from './draw-pictures.js';
import { getData } from './server-data.js';
import { displayAlert, getRandomSampleFromArray, debounceFunction } from './util.js';

const DEBOUNCE_DELAY = 500;
const RANDOM_PICTURE_LIMIT = 10;
const ACTIVE_FILTER_CLASS = 'img-filters__button--active';
const DEFAULT_FILTER_ID = 'filter-default';
const RANDOM_FILTER_ID = 'filter-random';
const DISCUSSED_FILTER_ID = 'filter-discussed';
const filtersContainer = document.querySelector('.img-filters');

let currentFilterId = DEFAULT_FILTER_ID;
let currentFilterButton = document.getElementById(DEFAULT_FILTER_ID);

const applyFilterToPictures = (pictures) => {
  switch (currentFilterId) {
    case DEFAULT_FILTER_ID:
      return pictures;
    case DISCUSSED_FILTER_ID:
      return pictures.slice().sort((a, b) => b.comments.length - a.comments.length);
    case RANDOM_FILTER_ID:
      return getRandomSampleFromArray(pictures, RANDOM_PICTURE_LIMIT);
    default:
      return pictures;
  }
};

getData()
  .then((pictures) => {
    renderPictures(pictures);
    const handleFilterButtonClick = debounceFunction((event) => {
      if (event.target.classList.contains('img-filters__button')) {
        currentFilterButton.classList.remove(ACTIVE_FILTER_CLASS);
        currentFilterId = event.target.id;
        currentFilterButton = event.target;
        currentFilterButton.classList.add(ACTIVE_FILTER_CLASS);
        renderPictures(applyFilterToPictures(pictures));
      }
    }, DEBOUNCE_DELAY);
    filtersContainer.addEventListener('click', handleFilterButtonClick);
    filtersContainer.classList.remove('img-filters--inactive');
  })
  .catch((error) => displayAlert(error.message));
