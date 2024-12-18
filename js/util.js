const ALERT_TIME = 5000;

const generateRandomInteger = (min, max) => {
  const lowerBound = Math.ceil(Math.min(min, max));
  const upperBound = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (upperBound - lowerBound + 1) + lowerBound);
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const checkRepeats = (arr) => {
  const uniqueElements = new Set(arr);
  return uniqueElements.size < arr.length;
};
const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;
  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_TIME);
};

const generateArrayRandomSample = (array, sampleSize) => {
  if (array.length <= sampleSize) {
    return array.slice();
  }

  const temporaryArray = array.slice();
  const sample = [];
  while (sample.length < sampleSize) {
    const randomIndex = generateRandomInteger(0, temporaryArray.length - 1);
    sample.push(temporaryArray[randomIndex]);
    temporaryArray.splice(randomIndex, 1);
  }
  return sample;
};

const debounceFunction = (func, delay = 500) => {
  let timerId;
  return (...params) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => func(...params), delay);
  };
};

export {checkRepeats, isEscapeKey, showAlert, generateArrayRandomSample, debounceFunction };
