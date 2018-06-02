<template>
  <div class="google-maps-container" :style="mapStyle">
    <div class="map" id="map" style="position:absolute; top:0px; left: 0px; right:0px; bottom:0px">
      <GoogleMapMarker v-if="map != undefined" v-for="marker in markers" :map="map" :key="marker.id" :options="marker" ></GoogleMapMarker>
    </div>
  </div>
</template>

<script>
//http://jsfiddle.net/q2cnne7y/17/
// https://developers.google.com/maps/documentation/javascript/reference?hl=ru
import Vue from 'vue';

import GoogleMapMarker from './GoogleMapMarker.vue';

import { mapState } from "vuex";
import { mapActions } from "vuex";
import { mapGetters } from "vuex";

export default {
  components: { GoogleMapMarker },
  props: {
    'mapStyle': {
      type: Object,
      default: function () { return { position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', width: '100%', height: '100%' } }
    },
    'center': { type: Object, default: function () { return { lat: 29.9797489, lng: 31.1338486 } } },
    'zoom': { type: Number, default: 3 },
    'mapTypeId': { type: String, default: 'terrain' },
    'paths': {
      type: Array,
      default: function () { return [] }
    },
    'markers': {
      type: [Array,Object],
      default: function () { return [] }
    }
  },
  data() {
    return {
      map: undefined,
      hmap:undefined,
      trucks: [],
      timer:undefined
    }
  },
  created() {
    let gvue = this;

    let fastZoom = function(point) {
      console.log('FAST ZOOM:',point);
      let latlng = {lat:point.lat,lng:point.lng};
      let currentZoom = gvue.map.getZoom();
      let zoom = (point.zoom === undefined) ? currentZoom : point.zoom;
      gvue.map.setZoom(zoom);
      gvue.map.panTo(latlng);
    };

    let fonPanToPoint = function (pointOrObject) {
      let point   = pointOrObject;
      let current = gvue.map.getZoom();
      let target  = current;
      if (typeof(pointOrObject) === "object" ) {
        current = pointOrObject.zoom;
        point   = pointOrObject.point;
      };
      gvue.stopTimer();
      gvue.zoomTo(current,current-1,'out',point);
    };
     window.onEvent('ON_PAN_TO_POINT',fastZoom);
  },
  mounted() {

    let vueMap = this;
    var myLatLng = new google.maps.LatLng(this.center.lat, this.center.lng);
    let mapType = google.maps.MapTypeId.SATELLITE;
    if (this.mapTypeId === 'terrain') {
      mapType = google.maps.MapTypeId.TERRAIN
    };
    var mapOptions = {
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      zoom: this.zoom,
      maxZoom: 18,
      minZoom:2,
      center: myLatLng,
      fullscreenControl: false,
      mapTypeId: mapType
    };
    var gmap = new google.maps.Map(document.getElementById('map'), mapOptions);

    this.map = gmap;
     let onMapZoom = function() {
       let zoom = vueMap.map.getZoom();
       if (zoom < 2 ) {
         setTimeout(function() {
           vueMap.map.setZoom(2);
           vueMap.map.setCenter({lat:20,lng:0});
         },100)
       }
       else {

         vueMap.mapZoomChanged(zoom);
       }
     }
    google.maps.event.addListener(gmap, 'idle',onMapZoom,this);

  },
  updated() {

  },
  methods: {
    ...mapActions(['mapZoomChanged']),
    stopTimer() {
      if (this.timer !== undefined) {
        clearTimeout(this.timer)
      };
      this.timer = undefined;
    },
    slowZoom(target,value,direction,position) {
      let vgmap = this;
      this.timer = setTimeout(function() {
        // vgmap.map.panTo(position);
        vgmap.map.setZoom(value);
        if (direction === 'in') {
          // vgmap.map.setCenter(position);
          vgmap.map.panTo(position);
        };
        vgmap.zoomTo(target,value,direction,position)
      },300);
    },
    zoomTo(target,current,direction,position) {
      // console.log('target:'+target+' current:'+current+' direction:'+direction+' position:'+position);
      if (target !== current) {
        if (direction === 'out') {
          if (current <= 3 ) {
            this.map.panTo(position);
            this.map.setCenter(position);
            this.slowZoom(target,current+1,'in',position);
          }
          else {
            this.slowZoom(target,current-1,'out',position);
          }
        }
        else
        {
          // this.map.setCenter(position);
          this.map.panTo(position);
          this.map.setCenter(position);
          this.slowZoom(target,current+1,'in',position);

        }
      }
    }
  },
  computed: {
    ...mapGetters(['heatmap']),
    ...mapState(['loading']),
    zoomLevel() {
      // return (this.map === undefined) ? 0 : this.map.getZoom();
      return 100;
    }
      }
    }
    </script>
    <style>
    div.google-maps-container {
      position: relative;
    }


    div.zoom-value{
      position: fixed;
      bottom:100px;
      top:100px;
      left:20px;
      z-index: 10300;
      width: 100px;
      height: 100px;
      background: red;
    }


    div.custom-html {
        position: absolute;
        top: 50px;
        left: 50px;
        width: 200px;
        height: 100px;
        background: red;
        z-index: 20000;

    }
</style>
