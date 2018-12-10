$(document).ready(function () {
  var parsed = getAllUrlParams( window.location.href );  
  
  getCookie( function ( cart ) {
    listApp.carts = cart;
  });
  
  if ( parsed.listed ) {
    var listed = parsed.listed.split(',');
    var filted = items.filter( function( item ) {
      if ( listed.includes( ''+item.id ) )
        return true;        
    });
    setItems( filted );
  }
  
  infinityScroll( listApp );
});


function getCookie( callback ) {
  var cart = Cookies.get('cart');
  if ( cart ) {
    cart = JSON.parse( cart );
    callback( cart );
  }
}



function setItems( filtered ) {
  listApp.scrolls = [];
  listApp.scrollsCurrent = 0;
  listApp.items = filtered;
  loadMore( listApp );
}



var listApp = new Vue({
  el: '#listApp',
  data: {
    items: []
    ,carts: []
    ,scrolls: []
    ,scrollsCurrent: 0
    ,scrollsSize: 10
    ,scrollsBefore: 10
    ,df : 'btn btn-outline-secondary m-2 d-inline-block'
    ,sc : 'btn btn-outline-info m-2 d-inline-block active'
    ,sorttype : {
      price : false
      ,data : false
      ,promotion : false
    }
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
      if ( cookie ) {
        cart = JSON.parse( cookie );
      }
      
      if ( this.checkCart( id ) ) {
        cart.splice( cart.indexOf( id*1 ), 1 );
      } else {
        cart.push (id*1);
      }
      
      this.carts = cart;
      Cookies.set( 'cart', cart, { expires: 7 } );
    }
    ,sortOption : function( sorttype ) {
      var sorted = this.items;
      if ( sorttype == null ) {
        sorttype = getRadio( this['sorttype'] );
      }
      
      // 정렬 필드
      if ( sorttype == 'price' ) {
        sorted.sort(function(a, b) {
            return a[sorttype] - b[sorttype];
        });
      } else if ( sorttype == 'data' ) {
        sorted.sort(function(a, b) {
            return b['data_total'] - a['data_total'];
        });
      } else if ( sorttype == 'promotion' ) {
        sorted.sort(function(a, b) {
            return a['promotion_discount'] - b['promotion_discount'];
        });
      }
      
      setItems( sorted );
    }
  }
});
