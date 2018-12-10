$(document).ready(function () {  
  var parsed = getAllUrlParams( window.location.href );
  
  var search = parsed.search;
  if ( search ) {
    var column = search.split(','); //simple_0,simple_1,simple_2,simple_3
    for ( i in column ) { 
      var key = column[i].split('_');
      searchApp.search[ key[0] ] [ key[1] ].checked = true;
    }
  }
  
  var listed = [];
  if ( parsed.listed != null && parsed.listed.length > 0 ) {
    var column = parsed.listed.split(','); //1,2,3
    for ( i in column ) {
      listed.push( column[i] * 1 );
    }    
  }
  
  var cart = Cookies.get('cart');
  if ( cart ) {
    listApp.carts = JSON.parse( cart );
  }
    
  if ( listed && listed.length > 0 ) {
    searchApp.listed = listed;
    searchApp.hide = true;
    searchApp.searchDetail();

  } else if ( search ) {
    searchApp.searchDetail();

  } else if ( parsed.cart ) {
    searchApp.listed = listApp.carts;
    listApp.cartmode = true;
    searchApp.hide = true;
    searchApp.searchDetail();
  }
  
  $(window).scroll(function() {
    var docHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    )
    if( $(window).scrollTop() + $(window).height() > docHeight - listApp.scrollsBefore ) {
      loadMore();
    }
  });
});


function setItems( filtered ) {
  listApp.scrolls = [];
  listApp.scrollsCurrent = 0;
  listApp.items = filtered;
  
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


function radio( e ) {
  var ids = $(e).attr('id').split('_');
  var app = ids[0];
  var group = ids[1];
  var id = ids[2];
  // 형제들 비활성화
  clearSiblings( app, group );
  // 자신 활성화
  checkbox( e );
}

function checkbox( e ) {
  var ids = $(e).attr('id').split('_');
  var app = ids[0];
  var group = ids[1];
  var id = ids[2];
  
  if ( app == 'search' ) {
    searchApp[ group ][id] = !searchApp[ group ][id];
  } else if ( app == 'result' ) {
    listApp[ group ][id] = !listApp[ group ][id];
  }
}

function checkedbox( e ) {
  var ids = $(e).attr('id').split('_');
  var app = ids[0];
  var group = ids[1];
  var id = ids[2];
  
  if ( app == 'search' ) {
    searchApp[ group ][id].checked = !searchApp[ group ][id].checked;
  } else if ( app == 'search' ) {
    listApp[ group ][id].checked = !listApp[ group ][id].checked;
  }
}

function clearSiblings( app, group ) {  
  var obj = ( app == 'search' ? searchApp[ group ] : app == 'result' ? listApp[ group ] : '' );
  for (var key in obj ) {
    if (obj.hasOwnProperty(key)) {
      obj[key]=false;
    }
  }
}

function getRadio( obj ) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if ( obj[key] ) {
        return key;
      }
    }
  }
  return null;
}

function getCheckbox( obj ) {
  var list = [];
  for ( var key in obj ) {
    if (obj.hasOwnProperty(key)) {
      if ( obj[key].checked ) {
        list.push( obj[key] );
      }
    }
  }
  return list;
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
    ,sortOption : function( sorttype ) {
      var sorted = items;
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



var searchApp = new Vue({
  el: '#searchApp',
  data: {
    df : 'btn btn-outline-secondary m-2'
    ,sc : 'btn btn-outline-info m-2 active'
    ,hide: false
    ,listed: [
    ]
    ,search: {
      simple : [
        {
          label: '음성 무제한',
          id: 'infinity',
          checked: false,
        },
        {
          label: '1만원 이하',
          id: 'cheap',
          checked: false,
        },        
        {
          label: '프로모션',
          id: 'event',
          checked: false,
        },
        {
          label: '데이터 무제한',
          id: 'data',
          checked: false,
        },
        {
          label: '제휴카드',
          id: 'card',
          checked: false,
        }
      ]
      ,agency : [
        {
          label: 'SKT',
          id: 'skt',
          checked: false,
        },
        {
          label: 'KT',
          id: 'kt',
          checked: false,
        },
        {
          label: 'LG U+',
          id: 'lg',
          checked: false,
        }
      ]
      ,network : [
        {
          label: '3G',
          id: '3g',
          checked: false
        },
        {
          label: 'LTE',
          id: 'lte',
          checked: false
        }
      ]
      ,data : [
        {
          label: '데이터 없음',
          field:'data',
          from: 0,
          to: 0,
          checked: false
        },
        {
          label: '300M이하',
          field:'data',
          from: 1,
          to: 300,
          checked: false
        },
        {
          label: '500M이하',
          field:'data',
          from: 301,
          to: 500,
          checked: false
        },
        {
          label: '750M이하',
          field:'data',
          from: 501,
          to: 750,
          checked: false
        },
        {
          label: '1G이하',
          field:'data',
          from: 751,
          to: 1024,
          checked: false
        },
        {
          label: '1.5G이하',
          field:'data',
          from: 1025,
          to: 1536,
          checked: false
        },
        {
          label: '2G이하',
          field:'data',
          from: 1537,
          to: 2048,
          checked: false
        },
        {
          label: '3G이하',
          field:'data',
          from: 2049,
          to: 3072,
          checked: false
        },
        {
          label: '6G이하',
          field:'data',
          from: 3073,
          to: 6144,
          checked: false
        },
        {
          label: '10G이하',
          field:'data',
          from: 6145,
          to: 10240,
          checked: false
        },
        {
          label: '11G이상',
          field:'data',
          from: 10241,
          to: 1024000,
          checked: false
        }
      ]
      ,datainfinity : [
        {
          label: '매일 1~2G 제공',
          field:'data_daily_offer',
          matching:['1G', '2G'],
          checked: false
        },
        {
          label: '소진 후 2~5Mbps',
          field:'data_infinity',
          matching:['2Mbps', '3Mbps', '5Mbps'],
          checked: false
        },
        {
          label: '소진 후 2~400Kbps',
          field:'data_infinity',
          matching:['200Kbps', '400Kbps'],
          checked: false
        }
      ]
      ,call : [
        {
          label: '통화 없음',
          field:'call',
          from: 0,
          to: 0,
          checked: false
        },
        {
          label: '60분이하',
          field:'call',
          from: 1,
          to: 60,
          checked: false
        },
        {
          label: '100분이하',
          field:'call',
          from: 61,
          to: 100,
          checked: false
        },
        {
          label: '180분이하',
          field:'call',
          from: 101,
          to: 180,
          checked: false
        },
        {
          label: '300분이하',
          field:'call',
          from: 181,
          to: 300,
          checked: false
        },
        {
          label: '330분이상',
          field:'call',
          from: 301,
          to: 10000,
          checked: false
        },
        {
          label: '무제한',
          field:'call',
          from: -1,
          to: -1,
          checked: false
        }
      ]
   }
  }
  ,methods: {
    searchChecked( item ) {
      item.checked = !item.checked;
      this.searchDetail();
    }
    ,searchDetail() {
      var filted = items;
      
      var listed = this.listed;
      if ( listed && listed.length > 0 ) { 
        filted = filted.filter( function( item ) {
          if ( listed.includes( item.id*1 ) ) {
            return true;
          }
        });
        setItems( filted );
        return;
      }
      
      var simples = this.search.simple;
      
      if ( simples[0].id = 'infinity' && simples[0].checked ) {
        filted = filted.filter( function( item ) {
            if ( item.call < 0 ) {
              return true;
            }
        });
      } 
      
      if ( simples[1].id = 'cheap' && simples[1].checked ) {
        filted = filted.filter( function( item ) {
            if ( item.price <= 10000 ) {
              return true;
            }
        });
      }
      
      if ( simples[2].id = 'event' && simples[2].checked ) {
        filted = filted.filter( function( item ) {
            if ( item.promotion ) {
              return true;
            }
        });
      }
      
      if ( simples[3].id = 'data' && simples[3].checked ) {
        filted = filted.filter( function( item ) {
            if ( item.data_daily_offer ) {
              return true;
            } else if ( item.data_infinity ) {
              return true;
            }
        });
      }
      
      if ( simples[4].id = 'card' && simples[4].checked ) {
        filted = filted.filter( function( item ) {
            if ( item.card1 ) {
              return true;
            } else if ( item.data_infinity ) {
              return true;
            }
        });
      }
      
      var agency = getCheckbox( this.search['agency'] );
      var network = getCheckbox( this.search['network'] );
      var data = getCheckbox( this.search['data'] );
      var datainfinity = getCheckbox( this.search['datainfinity'] );
      var call = getCheckbox( this.search['call'] );
      
      /*
      // 이름으로 필터링
      filted = filted.filter( function ( item ) {
        return item.title == '이야기 데이터 11GB';
      });
      */
      
      if ( agency && agency.length > 0 ) { 
        filted = filted.filter( function( item ) {
          for ( var i in agency ) {
            return item.agency.toUpperCase() == agency[i].id.toUpperCase();
          }
        });
      }
      
      if ( network && network.length > 0 ) {
        filted = filted.filter( function( item ) {
          if ( item.network == '3G/LTE' ) {
            return true;
          }
          for ( var i in network ) {
            if ( item.network.toUpperCase() == network[i].id.toUpperCase() ) {
              return true;
            }
          }
        });
      }
      
      if ( data && data.length > 0 ) { 
        filted = filted.filter( function( item ) {
          for (var i in data) {
            if ( item.data_total >= data[i].from && item.data_total <= data[i].to ) {
              return true;
            }
          }
        });
      }
      
      if ( datainfinity != null && datainfinity.length > 0 ) {
        filted = filted.filter( function( item ) {
          for (var i in datainfinity) {
            var matching = datainfinity[i].matching;
            var field = datainfinity[i].field;
            var targetValue = item[ field ];
            if ( matching.includes( targetValue ) ) {
              return true;
            }
          }
        });
      }
      
      if ( call && call.length > 0 ) { 
        filted = filted.filter( function( item ) {
          for (var i in call) {
            if ( item.call >= call[i].from && item.call <= call[i].to ) {
              return true;
            }
          }
        });
      }
            
      setItems( filted );
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
