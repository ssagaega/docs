$(document).ready(function () {
  var parsed = getAllUrlParams( window.location.href );
  
  var cart = Cookies.get('cart');
  if ( cart ) {
    detailApp.carts = JSON.parse( cart );
  }
  
  if ( parsed.item ) {
    var filted = items.filter( function( item ) {
      if ( parsed.item*1 == item.id*1 ) {
        return true;
      }
    });
    detailApp.item = filted[0];
  }
});


  
function filterById( selected ) {
  if ( items != null && items.length > 0 ) {
    var filted = items.filter( function( item ) {
      for (var i in selected) {
        if ( item.id == selected[i] ) {
          return true;
        }
      }
    });
  }
};



var detailApp = new Vue({
  el: '#detailApp',
  data: {
    carts:[]
    ,item: {
    }
    ,errorReporter: ''
    ,errorReportMessage : ''
  }
  ,methods: {
    checkCart( id ) {      
      var cookie = Cookies.get('cart');
      if ( cookie != null ) {
        var cart = JSON.parse( cookie );
        return cart.includes ( id*1 );
      }
      
      return false;
    }
    ,carting( id ) {
      var cookie = Cookies.get('cart');
      var cart = [];
      if ( cookie == null ) {
        cart = [];
      } else {
        cart = JSON.parse( cookie );
      }
      
      if ( this.checkCart( id ) ) {
        cart.splice( cart.indexOf( id*1 ), 1 );
      } else {
        cart.push (id*1);
      }
      
      this.carts = cart;
      Cookies.set( 'cart', cart, { expires: 7 } );
      
      if ( this.cartmode ) {
        var filted = items.filter( function( item ) {
          if ( cart.includes( item.id*1 ) ) {
            return true;
          }
        });
        setItems( filted );
      }
      
      createAlert('장바구니','','장바구니는 7일간 유효합니다','info',false,true,'pageMessages');
    }
  }
});
