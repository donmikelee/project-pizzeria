import {baseWidget} from './BaseWidget.js';
import {select,settings} from '../settings.js';
import {utils} from '../utils.js';

export class hourPicker extends baseWidget {
  constructor(wrapper){
    super(wrapper, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.hourPicker.output);

    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input;
  }
  parseValue(newValue){
    return utils.numberToHour(newValue);
  }
  isValid(newValue){
    return !isNaN(newValue);
  }
  renderValue(){
    const thisWidget = this;

    thisWidget.dom.output.innerHTML = thisWidget.value;

    console.log(thisWidget.value);
  }
  initPlugin(){
    const thisWidget = this;

    // eslint-disable-next-line no-undef
    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function() {
      thisWidget.value = thisWidget.dom.input;
    });
  }
}