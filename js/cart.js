
$(document).ready(function () {
  var parsed = getAllUrlParams( window.location.href );
  
  var cart = Cookies.get('cart');
  if ( cart ) {
    cart = JSON.parse( cart );
  }
  
  if ( cart != null ) {
    listApp.carts = cart;
    var filted = items.filter( function( item ) {
      if ( cart.includes( item.id*1 ) ) {
        return true;
      }
    });
    setItems( filted );
  }
  
  infinityScroll( listApp );
});

function copyLink() {
  var copyText = document.getElementById("linkinput");
  copyText.select();
  document.execCommand("copy");  
  //alert('링크가 복사되었습니다. 공유해보세요!');
  createAlert('링크복사','','링크가 복사되었습니다. 공유해보세요!','info',false,true,'pageMessages');
}


function setItems( filtered ) {
  listApp.scrolls = [];
  listApp.scrollsCurrent = 0;
  listApp.items = filtered;
  
  var url = "";
  if ( filtered.length > 0 ) {
    url += "?listed=";
    for ( i in filtered ) {
      url += filtered[i].id + ',';
    }
    url = url.substring(0, url.length - 1);
  }
  
  history.pushState(null, null, url);
  loadMore( listApp );
}


var listApp = new Vue({
  el: '#listApp',
  data: {
    items: []
    ,carts: []
    ,cartmode: false
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
      
      var filted = this.items.filter( function( item ) {
        if ( cart.includes( item.id*1 ) ) {
          return true;
        }
      });
      setItems( filted );
      createAlert('장바구니','','장바구니는 7일만 유효합니다!','info',false,true,'pageMessages');
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
