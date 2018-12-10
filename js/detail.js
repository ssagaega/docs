var items;

$(document).ready(function () {
  var parsed = getAllUrlParams( window.location.href );
  
  var cart = Cookies.get('cart');
  if ( cart ) {
    detailApp.carts = JSON.parse( cart );
  }
  
  if ( parsed.item ) {
    getCSV(function () {
      var filted = items.filter( function( item ) {
        if ( parsed.item*1 == item.id*1 ) {
          return true;
        }
      });
      detailApp.item = filted[0];
    });  
  }
});

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

function getCSV( callback ) {
  var url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWze7qOfMnYJC-KZBlSmLpmut8hARDX4zS_rAbRraECdgQ7GDVu5wOvqIu7uUrksyZoEzwH3Lt5K2K/pub?gid=562347642&single=true&output=csv"
  $.get( url, function( data, status ) {
    var json = $.csv.toObjects( data );    
    items = json;
    callback();
  });
}

  
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

function telegram() {
  var url = "https://api.telegram.org/bot572309405:AAFIvvAIGOciZcnkzQHPqUaRoWPNebvULmg/sendMessage?chat_id=59644837&text=" + encodeURI( "[" + detailApp.id + "] [" + detailApp.title + "] \n" + detailApp.errorReportMessage );
  $.get( url, function( data, status ) {
    showalert( '정보 개선에 참여해 주셔서 감사합니다.', 'alert-success')
  });
}

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
        var filted = this.items.filter( function( item ) {
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

function createAlert(title, summary, details, severity, dismissible, autoDismiss, appendToId) {
  var iconMap = {
    info: "fa fa-info-circle",
    success: "fa fa-thumbs-up",
    warning: "fa fa-exclamation-triangle",
    danger: "fa ffa fa-exclamation-circle"
  };

  var iconAdded = false;

  var alertClasses = ["alert", "animated", "flipInX"];
  alertClasses.push("alert-" + severity.toLowerCase());

  if (dismissible) {
    alertClasses.push("alert-dismissible");
  }

  var msgIcon = $("<i />", {
    "class": iconMap[severity] // you need to quote "class" since it's a reserved keyword
  });

  var msg = $("<div />", {
    "class": alertClasses.join(" ") // you need to quote "class" since it's a reserved keyword
  });

  if (title) {
    var msgTitle = $("<h4 />", {
      html: title
    }).appendTo(msg);
    
    if(!iconAdded){
      msgTitle.prepend(msgIcon);
      iconAdded = true;
    }
  }

  if (summary) {
    var msgSummary = $("<strong />", {
      html: summary
    }).appendTo(msg);
    
    if(!iconAdded){
      msgSummary.prepend(msgIcon);
      iconAdded = true;
    }
  }

  if (details) {
    var msgDetails = $("<p />", {
      html: details
    }).appendTo(msg);
    
    if(!iconAdded){
      msgDetails.prepend(msgIcon);
      iconAdded = true;
    }
  }
  

  if (dismissible) {
    var msgClose = $("<span />", {
      "class": "close", // you need to quote "class" since it's a reserved keyword
      "data-dismiss": "alert",
      html: "<i class='fa fa-times-circle'></i>"
    }).appendTo(msg);
  }
  
  $('#' + appendToId).prepend(msg);
  
  if(autoDismiss){
    setTimeout(function() {
      msg.addClass("flipOutX");
      setTimeout(function(){
        msg.remove();
      },500);
    }, 500);
  }
}
