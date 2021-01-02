import {Product} from './components/Product.js';
import {Cart} from './components/Cart.js';
import {Booking} from './components/Booking.js';
import {select, settings, classNames} from './settings.js';


const app = {
  initMenu: function(){
    const thisApp = this; 
    // console.log('thisApp.data:', thisApp.data);
    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function() {
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        // console.log('parsedResponse', parsedResponse);

        /* save parsedResponse as thisApp.data.products */

        thisApp.data.products = parsedResponse;

        /* execute initMenu method */

        thisApp.initMenu();
      });


    // console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  initPages: function(){
    const thisApp = this;

    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));


    let pagesMatchingHash = [];


    if(window.location.hash.length > 2){
      const idFromHash = window.location.hash.replace('#/', '');

      pagesMatchingHash = thisApp.pages.filter(function(page){
        return page.id == idFromHash;
      });
    }

    thisApp.activatePage(pagesMatchingHash.length ? pagesMatchingHash[0].id : thisApp.pages[0].id);

    for (let link of thisApp.navLinks){

      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* TODO: get page id from href */

        const pageId = clickedElement.getAttribute('href').replace('#','');

        /* TODO: activate page */

        thisApp.activatePage(pageId);

      });
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    for (let link of thisApp.navLinks){
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);

      const activeLink = link.classList.contains('active');

      console.log(activeLink);
      
    }

    for (let page of thisApp.pages){
      page.classList.toggle(classNames.nav.active, page.id == pageId);
    }

    window.location.hash = '#/' + pageId;

    // if(pageId === 'homepage'){
    //   const mainNav = document.querySelector('.main-nav');

    //   mainNav.classList.add('unactive');
    // }
    // if(pageId === 'order' & pageId === 'booking'){
    //   const mainNav = document.querySelector('.main-nav');

    //   mainNav.classList.remove('unactive');
    // }

  },

  initBooking: function(){
    const thisApp = this;

    thisApp.widgetContainer = document.querySelector(select.containerOf.booking);

    // console.log(thisApp.widgetContainer);

    thisApp.booking = new Booking(thisApp.widgetContainer);

  },
 
  init: function(){
    const thisApp = this;
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
  }
};
  

app.init();

