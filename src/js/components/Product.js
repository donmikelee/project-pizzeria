import {select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import {amountWidget} from './AmountWidget.js';


export class Product{
  constructor(id, data){
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElemenst();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    // console.log('new Product:', thisProduct);
  }
  renderInMenu(){
    const thisProduct = this;

    /* generate HTML based on template */

    const generatedHTML = templates.menuProduct(thisProduct.data);

    /* create element using utils.createElementFromHTML */

    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    /* find menu container */

    const menuContainer = document.querySelector(select.containerOf.menu);

    /* add element to menu */

    menuContainer.appendChild(thisProduct.element);

  }
  getElemenst(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    // console.log(thisProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    // console.log(thisProduct.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    // console.log(thisProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    // console.log(thisProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    // console.log(thisProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    // console.log(thisProduct.amountWidgetElem);
  } 
  initAccordion(){
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */

    const clickedElement = thisProduct.accordionTrigger;

    // console.log(clickedElement);

    /* START: click event listener to trigger */

    clickedElement.addEventListener('click', function(event) {

      /* prevent default action for event */

      event.preventDefault();

      /* toggle active class on element of thisProduct */

      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);

      /* find all active products */

      const activeProducts = document.querySelectorAll('.active');

      /* START LOOP: for each active product */

      // eslint-disable-next-line no-empty
      for(let activeProduct of activeProducts){
          
        /* START: if the active product isn't the element of thisProduct */

        if(activeProduct == clickedElement){

          /* remove class active for the active product */

          activeProduct.classList.remove('active');

          /* END: if the active product isn't the element of thisProduct */
            
        }
        /* END LOOP: for each active product */
      }
      /* END: click event listener to trigger */
    });
  }
  initOrderForm(){
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });
    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }
    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });

    // console.log('initOrderForm()');
  }
  processOrder(){
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);
    // console.log('formData', formData);

    thisProduct.params = {};

    /* set variable price to equal thisProduct.data.price */

    let price = thisProduct.data.price;

    /* START LOOP: for each params */

    for(let paramId in thisProduct.data.params){

      const param = thisProduct.data.params[paramId]; //object

      // console.log('This is param:', paramId);

      /* START another LOOP: for each options of params */

      for (let optionId in param.options){

        // console.log('This is object', param.options);

        const option = param.options[optionId];

        // console.log('This is option:', optionId);

        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

        // console.log(optionSelected);

        /* check if CLICKED option isn't default, price should increase */
        if(optionSelected && !option.default){
          price += option.price;
          // console.log(price);
        }
        /* check if UNCKLICKED option is default, price should decrease */
        else if(!optionSelected && option.default){
          price -= option.price;
          // console.log(price);
        }
        
        /* create const that contains searched elements */

        const images = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);

        // console.log(images);

        /* checked if option is clicked */

        if(optionSelected){

          if(!thisProduct.params[paramId]){
            thisProduct.params[paramId] = {
              label : param.label,
              options: {},
            };
          }

          /* START LOOP: for each searched element*/

          for (let image of images){

            /* add class active to element */

            image.classList.add(classNames.menuProduct.imageVisible);

          }
            
        }

        /* else option is not clicked */

        else{

          /* START LOOP: for each searched element*/
            
          for (let image of images){

            /* remove class active to element */

            image.classList.remove(classNames.menuProduct.imageVisible);

          }
              
        }

        /* END LOOP: for each element */
      }
      /* END OF LOOP: for each keys */
    }
    /* END OF LOOP: for each params */

    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
      
    /* match variable price to element thisProduct.priceElem */

    thisProduct.priceElem.innerHTML = thisProduct.price;

    // console.log(thisProduct.priceElem);
 
    // console.log('processOrder()');

    // console.log('Pracuję teraz na:', this);

    // console.log(thisProduct.params);
  }
  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new amountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }
  addToCart(){
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    // app.cart.add(thisProduct);
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }
}