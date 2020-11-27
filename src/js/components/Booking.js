import { settings, templates } from '../settings.js';
import { select } from '../settings.js';
import { utils } from '../utils.js';
import {amountWidget} from './AmountWidget.js';
import { datePicker } from './DatePicker.js';
import { hourPicker } from './HourPicker.js';

export class Booking{
  constructor(bookingWidgetContainer){
    const thisBooking = this;

    thisBooking.render(bookingWidgetContainer);
    thisBooking.initWidgets();
    thisBooking.getData();
  }
  render(element){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    // console.log(thisBooking.dom);

    thisBooking.dom.wrapper = element;

    // console.log(thisBooking.dom);

    thisBooking.dom.wrapper.innerHTML  = generatedHTML;

    // console.log(generatedHTML);

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.datePicker.wrapper);
    // console.log(thisBooking.dom.datePicker);
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    // console.log(thisBooking.dom.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    // console.log(thisBooking.dom.hoursAmount);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.hourPicker.wrapper);



  }
  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new amountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new amountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new datePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new hourPicker(thisBooking.dom.hourPicker);
  }
  getData(){
    const thisBooking = this;

    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(thisBooking.datePicker.minDate);
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(thisBooking.datePicker.maxDate);

    const endDate = {};
    endDate[settings.db.dateEndParamKey] = startEndDates[settings.db.dateEndParamKey];

    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent: settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate),
    };

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,
    };
    
    // console.log('getData urls', urls);

    // console.log('getDara params', params);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function([bookingsResponse, eventsCurrentResponse, eventsRepeatResponse]){
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }
  // eslint-disable-next-line no-unused-vars
  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

  
    for(let event of eventsCurrent){
      console.log('event', event);
      
      thisBooking.makeBooked(
        event.date, 
        event.hour, 
        event.duration, 
        event.table);
    }
    for(let booking of bookings){
      console.log('Booking', booking);
    
      thisBooking.makeBooked(
        booking.date, 
        booking.hour, 
        booking.duration, 
        booking.table);
    }
    for (let repEvent of eventsRepeat) {
      console.log('repeating event', repEvent);
      if (repEvent.repeat == 'daily') {
        const eventDateParse = new Date(repEvent.date); 
        const maxDate = utils.addDays(repEvent.date, 14);  
        for (
          let loopDate = eventDateParse;
          loopDate <= maxDate;
          loopDate = utils.addDays(loopDate, 1)
        ) {
          thisBooking.makeBooked(
            utils.dateToStr(loopDate),
            repEvent.hour,
            repEvent.duration,
            repEvent.table
          );
        }
      }
    }

  }
  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }

    
    console.log('thisBooking.booked', thisBooking.booked);
    
  }
}
