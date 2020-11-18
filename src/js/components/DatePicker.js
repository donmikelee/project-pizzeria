import {baseWidget} from './BaseWidget.js';
import {select,settings, utils} from '../settings.js';


export class datePicker extends baseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date));

    const thisWidget = this; 

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }
  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = new Date(utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture));
    // eslint-disable-next-line no-undef
    flatpickr(thisWidget.dom.input, options);
  }
}