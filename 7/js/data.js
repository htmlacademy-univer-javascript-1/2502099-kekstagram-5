import {getRandomInteger, getRandomIdFromRange, getRandomArrayElement} from './util.js';

const MESSAGES = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
const NAMES = ['Андрей','Павел','Кирилл','Валерия','Карина','Ульяна','Екатерина'];

const photosCount = 20;
const generateId = getRandomIdFromRange(1, photosCount);

const createComment = () => ({
  id: getRandomIdFromRange(1, 100),
  avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES),
});

const createPhotoObject = () => {
  const photoID = generateId();
  return {
    id: photoID,
    url: `photos/${photoID}.jpg`,
    description: `Описание фото номер ${photoID}`,
    likes: getRandomInteger(15, 200),
    comments: Array.from({length: getRandomInteger(0, 30)}, createComment),
  };
};

const createPhotos = () => Array.from({length: photosCount}, createPhotoObject);

export {createPhotos};
