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
    
    console.log('getData urls', urls);

    console.log('getDara params', params);

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
  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    console.log(eventsCurrent);

    for(let booked in thisBooking.booked){
      
      booked.thisBooking.makeBooked(eventsCurrent.date, eventsCurrent.hour, eventsCurrent.duration, eventsCurrent.table);

      console.log('Book:', booked);
    }

  }
  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    thisBooking.booked.date = date;
    thisBooking.booked.date.hour = hour;
    thisBooking.booked.date.hour.duration = duration;
    thisBooking.booked.date.hour.duration.table = table;

    date = '2020-11-20';
    hour = '12.5';
    duration = '30';
    table = '1';

    console.log(thisBooking.booked);
    
  }
}
