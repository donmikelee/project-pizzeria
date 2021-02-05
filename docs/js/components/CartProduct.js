import {select} from '../settings.js';
import {amountWidget} from './AmountWidget.js';

export class CartProduct{
  constructor(menuProduct, element){
    const thisCartProduct = this;

    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
    thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));

    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
  }
  getElements(element){
    const thisCartProduct = this;
      
    thisCartProduct.dom = {};

    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget = element.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = element.querySelector(select.cartProduct.remove);
   
   
    // console.log(thisCartProduct);
  }
  initAmountWidget(){
    const thisCartProduct = this;

    thisCartProduct.amountWidget = new amountWidget(thisCartProduct.dom.amountWidget);
    thisCartProduct.dom.amountWidget.addEventListener('updated', function(){

      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      // console.log('To jest value: ', thisCartProduct.amount);
      thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;

      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
    });
  }
  remove(){
    const thisCartProduct = this;

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });
    

    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }
  initActions(){
    const thisCartProduct = this;

    thisCartProduct.dom.edit.addEventListener('click', function(){
        
    });
    thisCartProduct.dom.remove.addEventListener('click', function(){
      thisCartProduct.remove();
      // console.log('Nie będzie pizzy łakomczuszku:', thisCartProduct.remove());
    });
  }
  getData(){
    const thisCartProduct = this;

    const product = {
      id: thisCartProduct.id,
      name: thisCartProduct.name,
      priceSingle: thisCartProduct.priceSingle,
      amount: thisCartProduct.amount,
      price: thisCartProduct.price,
      params: thisCartProduct.params 
    };

    return product;
  }
}