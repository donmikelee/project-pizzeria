import {baseWidget} from './BaseWidget.js';
import {select,settings} from '../settings.js';
import {utils} from '../utils.js';


export class datePicker extends baseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date));

    const thisWidget = this; 

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.datePicker.input);
    thisWidget.initPlugin();
  }
  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = new Date(utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture));
    // eslint-disable-next-line no-undef
    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      'disable': [
        function(date) {
          return (date.getDay() === 1);
        }
      ],
      'locale': {
        'firstDayOfWeek': 2
      },
      onChange: function(selectedDates, dateStr){

        
        thisWidget.value = dateStr;
        // selectedDates.push(thisWidget.value);

        // console.log('selectedDates', selectedDates);
        // console.log('dateStr', dateStr);
        // console.log('thisWidget.value', thisWidget.value);
        
      }
    });
  }
  parseValue(newValue) {
    return newValue;
  }
  isValid() {
    return true;
  }
  renderValue() {}
}
