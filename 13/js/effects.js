const CLASS_HIDDEN = 'hidden';

const imagePreviewElement = document.querySelector('.img-upload__preview img');
const effectsListElement = document.querySelector('.effects__list');
const sliderContainerElement = document.querySelector('.img-upload__effect-level');
const sliderElement = sliderContainerElement.querySelector('.effect-level__slider');
const effectValueElement = sliderContainerElement.querySelector('.effect-level__value');

const EffectConfigurations = {
  NONE: {
    id: 'effect-none',
    type: 'none',
    params: { min: 0, max: 1, step: 0.1 },
    format: (value) => value,
    parse: (value) => parseFloat(value),
  },
  CHROME: {
    id: 'effect-chrome',
    type: 'grayscale',
    params: { min: 0, max: 1, step: 0.1 },
    format: (value) => value.toFixed(1),
    parse: (value) => parseFloat(value),
  },
  SEPIA: {
    id: 'effect-sepia',
    type: 'sepia',
    params: { min: 0, max: 1, step: 0.1 },
    format: (value) => value.toFixed(1),
    parse: (value) => parseFloat(value),
  },
  INVERT: {
    id: 'effect-marvin',
    type: 'invert',
    params: { min: 0, max: 100, step: 1 },
    format: (value) => `${value}%`,
    parse: (value) => parseFloat(value),
  },
  BLUR: {
    id: 'effect-phobos',
    type: 'blur',
    params: { min: 0, max: 3, step: 0.1 },
    format: (value) => `${value.toFixed(1)}px`,
    parse: (value) => parseFloat(value),
  },
  BRIGHTNESS: {
    id: 'effect-heat',
    type: 'brightness',
    params: { min: 1, max: 3, step: 0.1 },
    format: (value) => value.toFixed(1),
    parse: (value) => parseFloat(value),
  },
};

let activeEffect = EffectConfigurations.NONE;

const getSliderOptions = ({ params, format, parse }) => ({
  range: {
    min: params.min,
    max: params.max,
  },
  start: params.max,
  step: params.step,
  connect: 'lower',
  format: { to: format, from: parse },
});

const updateEffectParams = (effect) => {
  if (effect.type === 'none') {
    sliderContainerElement.classList.add(CLASS_HIDDEN);
  } else {
    sliderContainerElement.classList.remove(CLASS_HIDDEN);
  }

  activeEffect = effect;
  sliderElement.noUiSlider.updateOptions(getSliderOptions(effect));
};

const handleEffectChange = (evt) => {
  const selectedEffect = Object.values(EffectConfigurations).find((config) => config.id === evt.target.id);
  if (selectedEffect) {
    updateEffectParams(selectedEffect);
  }
};

const initializeEffects = () => {
  activeEffect = EffectConfigurations.NONE;
  effectValueElement.value = activeEffect.params.max;
  noUiSlider.create(sliderElement, getSliderOptions(activeEffect));
  sliderContainerElement.classList.add(CLASS_HIDDEN);
  effectsListElement.addEventListener('change', handleEffectChange);

  sliderElement.noUiSlider.on('update', () => {
    effectValueElement.value = parseFloat(sliderElement.noUiSlider.get());
    imagePreviewElement.style.filter = (activeEffect.type !== 'none') ? `${activeEffect.type}(${sliderElement.noUiSlider.get()})` : '';
  });
};

const clearEffects = () => {
  effectsListElement.removeEventListener('change', handleEffectChange);
  document.getElementById(EffectConfigurations.NONE.id).checked = true;
  imagePreviewElement.style.filter = '';
  sliderElement.noUiSlider.destroy();
};

export { initializeEffects, clearEffects };
