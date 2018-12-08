var searchApp = new Vue({
  el: '#searchApp',
  data: {
    df : 'btn btn-outline-secondary m-2'
    ,sc : 'btn btn-outline-info m-2 active'
    ,display: ''
    ,baseurl: 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query='
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
    searchSimple() {
      this.clearAll( 'agency' );
      this.clearAll( 'network' );
      this.clearAll( 'data' );
      this.clearAll( 'datainfinity' );
      this.clearAll( 'call' );
      window.location.href = 'https://ssagaessagae.ga/result?' + this.makeParams();
    }
    ,searchDetail() {
      this.clearAll( 'simple' );
      window.location.href = 'https://ssagaessagae.ga/result?' + this.makeParams();
    }
    ,clearAll( key ) {
      var list = this.search[key];
      for ( i in list ) {
        list[i].checked = false;
      }
    }
    ,makeParams() {
      var params = "search=";      
      for (var search in this.search ) {
        var key = this.search[search];
        for ( i in key ) {
          if ( key[i].checked ) {
            params += search + '_' + i + ',';
          }
        }
      }
      params = params.substring(0, params.length - 1);
      return params;
    }
  }
});
