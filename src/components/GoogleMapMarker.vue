<template>
  <div  v-show="markerVisible">
    <div v-show="markerVisible" :ref="options.id"  :class="markerClass()" :style="markerStyle" @click="markerClicked">
      <div  class="google-map-marker-content">
     <component :is="options.component" :options="options" :calculating="options.calculating === true"></component>
      </div>
    </div>
  </div>
</template>

<script>

import {mapState,mapMutations} from 'vuex';

export default {
  props: ['options', 'map'],
  data() {
    return {
      isInViewPort:true,
      overlay: undefined,
      marker: undefined,
      position:undefined,
      htmlMarker:undefined,
      focussed:false,
      lng:0,
      lat:0,
      visible:{zoom:true,layer:true,timeline:true},
      latlng:undefined,
      events:{},
      subscribed:{}
    }
  },
  created() {
    if (this.options.defaults !== undefined ) {
    //   if (this.options.defaults.continent !== undefined ) {this.events.continent     = this.onContinentEvent };
      if (this.options.defaults.layer     !== undefined ) {this.events.layer         = this.onLayerEvent     };
      if (this.options.defaults.zoom      !== undefined ) {this.events.zoom          = this.onZoomEvent      };
      if (this.options.defaults.timeline  !== undefined ) {this.events.timeline      = this.onTimelineEvent  };
    }

    // console.log('this.options',this.options);


    // this.events.timeline      = this.onTimelineEvent;
    this.subscribeToAllEvents();
  },
  beforeDestroy() {
    console.log('Google Map Marker On Before Destroy:',this.options);
    this.unsubscribeFromAllEvents();
    if (this.htmlMarker !== undefined)  {
      this.htmlMarker.setMap(null);
      this.htmlMarker.onRemove();
    }

  },
  methods: {
    ...mapMutations(['setActiveMarker']),
    markerClass() {
      let focussedStyle = this.focussed ? ' focussed-marker ' : ' normal-marker ';
      return 'google-map-marker ' + focussedStyle;
    },
    unsubscribeFromOtherEvents(evtName) {
      // for (var e in this.events) {
      //   if (e !== evtName) {
      //     let evt = this.events[e];
      //     this.unsubscribeFromEvent(e,evt);
      //   }
      // }
    },
    unsubscribeFromAllEvents() {
      for (var e in this.events) {
        let evt = this.events[e];
        this.unsubscribeFromEvent(e,evt);
      }
    },
    subscribeToFirstInvisibleEvent() {
      // let allIsVisible = true;
      // for (var e in this.events) {
      //   let defFunction = this.options.defaults[e];
      //   let def = defFunction();
      //   this.visible[e] = def;
      //   if (def === false) {
      //     let evt = this.events[e];
      //     this.subscribeToEvent(e,evt);
      //     allIsVisible = false;
      //     break;
      //   }
      // };
      // if (allIsVisible) {
      // //  this.visible = true;
      //   this.subscribeToAllEvents()
      // }
    },
    subscribeToAllEvents() {
      for (var e in this.events) {
        let evt = this.events[e];
        this.subscribeToEvent(e,evt);
      }
    },
    onContinentEvent(visible) {
      // console.log('CONTINENT:'+this.options.continent+': '+visible);
      return visible;
    },
    onZoomEvent(zoom) {
      // console.log('ZOOM:'+this.options.zoomVisibility[zoom]+': '+zoom);
      return this.options.zoomVisibility[zoom];
    },
    onLayerEvent(visible) {
      // console.log('GOT CALLBACK LAYER EVENT:'+this.options.layer+': '+visible);
      return visible;
    },
    onTimelineEvent(timeline) {
      let result = (this.options.event === undefined) ? true : (this.options.event.start_date >= timeline.start && this.options.event.start_date <= timeline.end);
      if (this.options.event.name === 'PROSPECT DINNER') {
        // console.log('TIMELINE:'+this.options.timeline+': EVENT:'+this.options.event.name,{start:this.options.event.start_date,end:this.options.event.end_date},timeline,result);
      }
      return result;
    },
    eventCallback(field,callback) {
      let eventHandler = this;
      let cbk = function(value)  {
        eventHandler.onEvent(field,value,callback);
      };
      return cbk;
    },
    onEvent(field,value,callback) {
      // console.log('EVT:',field,'VAL:',value);
      let visible = callback(value);
      this.visible[field] = visible;
      if (visible === true) {
        // this.subscribeToFirstInvisibleEvent(field);
      }
      else
      {
        // this.visible = false;
        // this.unsubscribeFromOtherEvents(field)
      }
    },
    unsubscribeFromEvent(field,callback) {
        if (this.subscribed[field] !== false) {
          let eventID = this.eventID(field);
          // console.log('UNSUBSCRIBING FROM EVENT:',eventID);
          let cbk     = this.eventCallback(field,callback);
          window.offEvent(eventID,cbk);
          this.subscribed[field] = false;
        }
    },
    subscribeToEvent(field,callback) {
      if (this.subscribed[field] !== true) {
        let eventID = this.eventID(field);
        // console.log('SUBSCRIBING TO:',eventID);
        let cbk     = this.eventCallback(field,callback);
        window.onEvent(eventID,cbk);
        this.subscribed[field] = true;
      }
    },
    eventID(field) {
      return 'ON_'+field+'_'+this.options[field];
    },
    markerClicked() {

    },
    addMarker() {

    }
  },
  mounted() {
    let mrk = this;
    let gmap = this.map;
    let EVENT_ID = this.options.map_broadcast_event;
    function HTMLMarker(lat, lng) {
      this.lat = lat;
      this.lng = lng;
      this.pos = new google.maps.LatLng(lat, lng);
    }

    this.marker = HTMLMarker;
    HTMLMarker.prototype = new google.maps.OverlayView();
    HTMLMarker.prototype.onRemove = function (removeArgs) {
      console.log('PLEASE REMOVE THIS MARKER HERE:',removeArgs)
      if (this.div !== undefined && this.div !== null) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }

    //init your html element here
    // HTMLMarker.prototype.onAdd = this.addMarker;
    HTMLMarker.prototype.onAdd = function () {
      // let whatever = mrk.$el.cloneNode(true);

      // let whatever = mrk.$el;
      // this.div = mrk.$el;
      // var panes = this.getPanes();
      // let mrker = '<div>'+mrk.options.id+'</div>';

      // this.div = document.createElement('DIV');
      // this.div.className = "google-map-marker";
      // this.div.innerHTML = '<div style="position:absolute">'+mrk.$el.innerHTML+'</div>';

      this.div = mrk.$refs[mrk.options.id];
      var panes = this.getPanes();
      panes.overlayImage.appendChild(this.div);


      // panes.overlayImage.appendChild(mrker);
    }

    HTMLMarker.prototype.draw = function () {
      console.log('THIS MARKER WANTS TO REDRAW!',mrk);
      var overlayProjection = this.getProjection();
      var position = overlayProjection.fromLatLngToDivPixel(this.pos);
      mrk.lat = this.pos.lat();
      mrk.lng = this.pos.lng();
      mrk.latlng = new google.maps.LatLng(mrk.lat,mrk.lng);

      var panes = this.getPanes();
      // this.div.innerHTML = '<div style="position:absolute">'+mrk.$el.innerHTML+'</div>';
      this.div.style.left = position.x + 'px';
      this.div.style.top = position.y + 'px';
    }

    //to use it
    // var htmlMarker = [];
    this.htmlMarker = new HTMLMarker(this.options.marker_position.lat, this.options.marker_position.lng);
    // htmlMarker[1] = new HTMLMarker(63, -151);
    // htmlMarker[0].setMap(gmap);
    this.htmlMarker.setMap(gmap);

    if (this.options.map_broadcast_event !== undefined) {

      google.maps.event.addListener(gmap, 'idle', function() {
        if (mrk.latlng !== undefined) {
          let currentViewPort = this.isInViewPort;
          let isInViewPort = gmap.getBounds().contains(mrk.latlng);
          if (currentViewPort !== isInViewPort) {
            mrk.isInViewPort = isInViewPort;
            // console.log(EVENT_ID,isInViewPort);
            sendEvent(EVENT_ID,isInViewPort);
          }
        }
      });
    }

    // this.visible.continent     = this.options.defaults.continent === undefined ? true  : this.options.defaults.continent();
    this.visible.layer         = this.options.defaults.layer     === undefined ? true  : this.options.defaults.layer();
    this.visible.zoom          = this.options.defaults.zoom      === undefined ? true  : this.options.defaults.zoom();
    this.visible.timeline      = this.options.defaults.timeline  === undefined ? true  : this.options.defaults.timeline();


    let focusMarker = function(data) {
      console.log('FOCUS MARKER: ',mrk.options.id+'_FOCUS');
      mrk.focussed = true;
      mrk.setActiveMarker({marker_id:mrk.options.id,layer:mrk.options.layer});
      setTimeout(function() {
        mrk.focussed = false;
      },1000)
    };
    console.log('REGISTER EVENT:',mrk.options.id+'_FOCUS');

    onEvent(this.options.id+'_FOCUS',focusMarker);
    // this.calculating           = this.options.calculating        === undefined ? false : this.options.calculating();
  },
  computed: {
    ...mapState(['active_marker_layer','active_marker']),
    enabled() {
      // console.log('this.options:',this.options);
      return (this.options.disabled !== true);
    },
    markerStyle() {
      let addedIndex = this.active_marker == this.options.id ? 100 : 0;
      return this.active_marker_layer == this.options.layer ? {'z-index':2000 + addedIndex} : {'z-index':10}
    },

    zoomVisible() {
      // return (this.options.zoomVisibility === undefined) ? true : this.options.zoomVisibility[this.map_level];
      return true;
    },
    markerVisible() {
      let isVisible =  this.enabled && this.isInViewPort && this.visible.zoom && this.visible.layer && this.visible.timeline;
      // if (isVisible !== true) {
      //   if (this.htmlMarker !== undefined)  {
      //   this.htmlMarker.setMap(null);
      //   this.htmlMarker.onRemove();
      //   }
      // }
      return isVisible;
      // console.log('this.visibleFields',this.options.visibleFields);
      // console.log('this.zoomVisibility',this.options.zoomVisibility);
      // let vis = true;
      // let len = (this.options.visibleFields === undefined ? 0 : this.options.visibleFields.length);
      // if (this.isInViewPort && this.zoomVisible) {
      //   for (var v = 0; v < len ; v++ ) {
      //     if (this.visible[v] === false) {
      //       vis = false;
      //       break;
      //     }
      //   }
      //   return vis;
      // }
      // else
      // {
      //   return false
      // }
      return true;
    },
    className() {
      return 'marker';
    }
  }
}
</script>


<style>
div.google-map-marker {
  position: absolute;
  display: flex;
  min-width: 60px;
  max-width: 60px;
  min-height: 60px;
  max-height: 60px;
  margin-left: -30px;
  margin-top:-60px;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  pointer-events: none;
  /* border: 1px solid red; */
  transform-origin: 50% 100%;
}

.focussed-marker{
  /* border: 2px solid red; */
  animation: shake;
  animation-duration: 200ms;
  animation-iteration-count: 5;
  z-index: 3000;
}

.normal-marker{

}


@keyframes shake {
  0% {
    transform: rotateZ(0deg);
  }
  25%{
    transform: rotateZ(-10deg);
  }
  50%{
    transform: rotateZ(0deg);
  }
  75%{
    transform: rotateZ(10deg);

  }
  100% {
    transform: rotateZ(0deg);
  }
}

div.google-map-marker-content{
  flex:1;
}
div.htmlMarker div {

}
</style>
