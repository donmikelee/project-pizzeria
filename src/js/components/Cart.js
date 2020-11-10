import {select, classNames, templates, settings} from '../settings.js';
import {utils} from '../utils.js';
import {CartProduct} from './CartProduct.js';


export class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();
    // console.log('new Cart', thisCart);
  }
  getElements(element){
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    thisCart.dom.form = element.querySelector(select.cart.form);

    thisCart.phone = select.cart.phone;
    thisCart.address = select.cart.address;
    // console.log(thisCart.dom.productList);

    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
  }
  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){

      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);

    });
    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();

      thisCart.sendOrder();
    });
  }
  sendOrder(){
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      address: 'test',
      totalPrice: thisCart.totalPrice,
      phone: thisCart.phone,
      adress: thisCart.adress,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: []
    };

    for(let product of thisCart.products){
      payload.products.push(product.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response) {
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }
  add(menuProduct){
    const thisCart = this;
      
    const generatedHTML = templates.cartProduct(menuProduct);

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    // console.log('thisCart.products', thisCart.products);
      

    // console.log(generatedDOM);

    // console.log('Adding product id:', menuProduct.id);
    // console.log('Adding product name:', menuProduct.name);
    // console.log('Adding product price:', menuProduct.price);
    // console.log('Adding product single price:', menuProduct.priceSingle);
    // console.log('Adding product amount:', menuProduct.amount);
    thisCart.update();
  }
  update(){
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0; 
      
    for(let product of thisCart.products){
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount;
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    // console.log('To jest total number', thisCart.totalNumber);
    // console.log('To jest subtotal price', thisCart.subtotalPrice);
    // console.log('To jest total price', thisCart.totalPrice);
    // console.log('To jest delivery fee', thisCart.deliveryFee);

    for(let key of thisCart.renderTotalsKeys){
      for(let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }
  }
  remove(cartProduct){
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);
      
    thisCart.products.splice(index, 1);

    cartProduct.dom.wrapper.remove(index);
  }
}