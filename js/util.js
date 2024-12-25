const ALERT_DISPLAY_DURATION = 5000;

const generateRandomInteger = (minValue, maxValue) => {
  const minBound = Math.ceil(Math.min(minValue, maxValue));
  const maxBound = Math.floor(Math.max(minValue, maxValue));
  return Math.floor(Math.random() * (maxBound - minBound + 1) + minBound);
};

const hasDuplicates = (array) => new Set(array).size !== array.length;

const isKeyEscape = (event) => event.key === 'Escape';

const displayAlert = (alertMessage) => {
  const alertBox = document.createElement('div');
  alertBox.style.zIndex = '100';
  alertBox.style.position = 'absolute';
  alertBox.style.left = '0';
  alertBox.style.top = '0';
  alertBox.style.right = '0';
  alertBox.style.padding = '10px 3px';
  alertBox.style.fontSize = '30px';
  alertBox.style.textAlign = 'center';
  alertBox.style.backgroundColor = 'red';

  alertBox.textContent = alertMessage;

  document.body.append(alertBox);

  setTimeout(() => {
    alertBox.remove();
  }, ALERT_DISPLAY_DURATION);
};

const getRandomSampleFromArray = (sourceArray, sampleCount) => {
  if (sourceArray.length <= sampleCount) {
    return sourceArray.slice();
  }

  const shuffledArray = sourceArray.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const randomIndex = generateRandomInteger(0, i);
    [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
  }
  return shuffledArray.slice(0, sampleCount);
};

const debounceFunction = (callback, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => callback.apply(this, args), delay);
  };
};

export { hasDuplicates, isKeyEscape, displayAlert, getRandomSampleFromArray, debounceFunction };
