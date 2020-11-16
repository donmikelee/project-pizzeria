import { templates } from '../settings.js';
import { select } from '../settings.js';
import {amountWidget} from './AmountWidget.js';

export class Booking{
  constructor(bookingWidgetContainer){
    const thisBooking = this;

    thisBooking.render(bookingWidgetContainer);
    thisBooking.initWidgets();
  }
  render(element){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = element;

    thisBooking.dom.wrapper.innerHTML  = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.querySelector(select.booking.hoursAmount);

  }
  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new amountWidget(thisBooking.dom);
    thisBooking.hoursAmount = new amountWidget(thisBooking.dom);
  }
}
