import { templates } from '../settings.js';
import { select } from '../settings.js';
import { utils } from '../utils.js';
import {amountWidget} from './AmountWidget.js';

export class Booking{
  constructor(){
    const thisBooking = this;

    thisBooking.render(thisBooking.container);
    thisBooking.initWidgets();
  }
  render(element){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = element;

    console.log(thisBooking.dom);

    thisBooking.element = utils.createDOMfromHTML(generatedHTML);

    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
    console.log(thisBooking.dom.peopleAmount);
    thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);

  }
  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new amountWidget(thisBooking.dom);
    thisBooking.hoursAmount = new amountWidget(thisBooking.dom);
  }
}
