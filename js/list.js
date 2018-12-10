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
  
  scrollCheck( loadMore );
});


function getCookie( callback ) {
  var cart = Cookies.get('cart');
  if ( cart ) {
    cart = JSON.parse( cart );
    callback( cart );
  }
}


function scrollCheck( callback ) {
  $(window).scroll(function() {
    var docHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    )
    if( $(window).scrollTop() + $(window).height() > docHeight - listApp.scrollsBefore ) {
      callback();
    }
  });
}


function getAllUrlParams( url ) {
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  var obj = {};
  if (queryString) {
    queryString = queryString.split('#')[0];
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      var a = arr[i].split('=');
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
      if (paramName.match(/\[(\d+)?\]$/)) {
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];
        if (paramName.match(/\[\d+\]$/)) {
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          obj[key].push(paramValue);
        }
      } else {
        if (!obj[paramName]) {
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}


function setItems( filtered ) {
  listApp.scrolls = [];
  listApp.scrollsCurrent = 0;
  listApp.items = filtered;
  
  /*
  // url 변경
  var url = "";
  if ( filtered.length > 0 ) {
    url += "?listed=";
    for ( i in filtered ) {
      url += filtered[i].id + ',';
    }
    url = url.substring(0, url.length - 1);
  }  
  history.pushState(null, null, url);
  */
  loadMore();
}

function loadMore() {
  var current = listApp.scrollsCurrent;
  for ( var i=current; i < current + listApp.scrollsSize; i++ ) {
    var item = listApp.items[i];
    if ( item != null ) {
      listApp.scrolls.push( item );
      listApp.scrollsCurrent++;
    }
  }
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
