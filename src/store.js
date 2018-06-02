import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router';
import VueResource from 'vue-resource';
import VueFirestore from 'vue-firestore';

import { firestore } from 'firebase';

require('@/utils/firestore-utils.js');

Vue.use(VueFirestore);
Vue.use(VueResource);
Vue.use(Vuex);
Vue.use(Router);

const FREE_PATHS = [
  {
    db: '/htj_poi',
    state: 'pois'
  },
  {
    db: '/htj_hotel/*/htj_hotel_offer/*',
    state: 'hotels/*/offers/*'
  },
  {
    db: '/stats',
    state: '/stats'
  },
  {
    db: '/local_travel',
    state: '/travel'
  }


];

window.event_count = 0;

window.events = new Vue({});
function onEvent(eventName, callback) {
  window.events.$on(eventName, callback);
}

//----------------------------------------------------------------------------------------------------------------------

function offEvent(eventName, callback) {
  window.events.$off(eventName, callback);
}

//----------------------------------------------------------------------------------------------------------------------

function sendEvent(eventName, payload) {
  window.event_count = window.event_count + 1;
  window.events.$emit(eventName, payload);
}

//----------------------------------------------------------------------------------------------------------------------

window.sendEvent = sendEvent;
window.onEvent = onEvent;
window.offEvent = offEvent;

//----------------------------------------------------------------------------------------------------------------------

function jsonToQueryString(json) {
  let params = Object.keys(json).map(function (key) {
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key]);
  }).join('&');
  if (params === '') {
    return ''
  }
  else {
    return '?' + params;
  }
}


//----------------------------------------------------------------------------------------------------------------------


function requestJSON(context, commitField, url, object) {
  let completeURL = url + jsonToQueryString(object);
  Vue.http.get(completeURL, { credentials: false })

    .then(function (response) {

      return response.json();
    }).then(function (json) {

      return json;
    })
}


//----------------------------------------------------------------------------------------------------------------------

  function zoomToMidPoint(state) {
    let lat = (state.stats.poi_stats === undefined) ? 0 : state.stats.poi_stats.lat_mid_weighted;
    let lon = (state.stats.poi_stats === undefined) ? 0 : state.stats.poi_stats.lon_mid_weighted;
    window.sendEvent('ON_PAN_TO_POINT',{lat,lng:lon,zoom:12});
  }


const actions = {
  'addPOI': (context, poi) => {
    window.createFirestoreRecord(['/htj_poi'], poi.id, poi);
  },
  'zoomToMidPoint':(context) => {
    zoomToMidPoint(context.state);
  },
  'pageLoaded': (context) => {
    for (var p = 0; p < FREE_PATHS.length; p++) {
      let path = FREE_PATHS[p];
      window.bindRecursive(context.state, path);
    }
  },
  'mapZoomChanged': (context, zoom) => {
    // console.log('MAP ZOOM CHANGED!');
  },

  'toggleSidebar': (context) => {
    context.commit('toggleSidebar')
	},

  'toggleSettings': (context, setting) => {
		// console.log('setting:', setting);

    context.commit('toggleSettings', setting)
  }
}


//----------------------------------------------------------------------------------------------------------------------


const mutations = {
  setActiveOrigin(state, originID) {
    state.active_origin = originID;
  },

  toggleSidebar(state) {
    state.sidebarExpanded = !state.sidebarExpanded
	},

  toggleSettings(state, settings) {
    state.settingsPane = settings
	},

	setLoadingHotels(state, isLoading) {
		state.loadingHotels = isLoading
	}
}

//----------------------------------------------------------------------------------------------------------------------

function buildHotel(hotel)  {
    let marker = {
    id: hotel.id,
    clickable: true,
    layer:'hotels',
    icon: 'hotel',
    photo: '',
    vendor: 'fa',
    angle: 0,
    map_broadcast_event:'ON_MARKER_IN_VIEW_'+hotel.id,
    filterFunction: function () { return true },
    eventName: 'ON_POI_CHANGED',
    label: hotel.name,
    draggable: false,
    color: '#98BF0D',
    markerVisible: true,
    defaults: {
      continent: function () { return true },
      layer: function () { return true },
      timeline: function () { return true },
      zoom: function () { return true }
    },
    // category_zoom_visibility:{},
    component: 'map-marker',
    marker_position: { lat: hotel.lat, lng: hotel.lon }
  };
  return marker;
}

function buildMarker(poi) {
  let marker = {
    id: poi.id,
    clickable: true,
    layer:'poi',
    icon: poi.type,
    photo: poi.picutres,
    vendor: 'fa',
    angle: 0,
    map_broadcast_event:'ON_MARKER_IN_VIEW_'+poi.id,
    filterFunction: function () { return true },
    eventName: 'ON_POI_CHANGED',
    label: poi.name,
    draggable: false,
    color: '#0085BF',
    markerVisible: true,
    defaults: {
      continent: function () { return true },
      layer: function () { return true },
      timeline: function () { return true },
      zoom: function () { return true }
    },
    // category_zoom_visibility:{},
    component: 'map-marker',
    marker_position: { lat: poi.lat, lng: poi.lon }
  };
  return marker;
}

function buildMidPointMarkers(state) {
  let markers = {};
  // console.log('state.stats', state.stats);
  if (state.stats.poi_stats !== undefined) {
    let midpoint = {
      id: 'midpoint',
      map_broadcast_event:'ON_MARKER_IN_VIEW_'+'midpoint',
      clickable: true,
      layer:'mid',
      icon: 'bullseye',
      photo: 'https://cdn.iconscout.com/public/images/icon/free/png-512/strategy-target-aim-dart-illusion-bullseye-382bc1f133012bf6-512x512.png',
      vendor: 'fa',
      angle: 0,
      filterFunction: function () { return true },
      eventName: 'ON_POI_CHANGED',
      label: 'MIDPOINT',
      draggable: false,
      color: '#C16828',
      markerVisible: true,
      defaults: {
        continent: function () { return true },
        layer: function () { return true },
        timeline: function () { return true },
        zoom: function () { return true }
      },
      // category_zoom_visibility:{},
      component: 'map-marker',
      marker_position: { lat: state.stats.poi_stats.lat_mid, lng: state.stats.poi_stats.lon_mid }
    };

    let weight_point = {
      id: 'weight_point',
      clickable: true,
      icon: 'bullseye',
      layer:'mid',
      map_broadcast_event:'ON_MARKER_IN_VIEW_'+'weight_point',

      photo: 'https://cdn.iconscout.com/public/images/icon/free/png-512/strategy-target-aim-dart-illusion-bullseye-382bc1f133012bf6-512x512.png',
      vendor: 'fa',
      angle: 0,
      filterFunction: function () { return true },
      eventName: 'ON_POI_CHANGED',
      label: 'WEIGHTED POINT',
      draggable: false,
      color: '#C16828',
      markerVisible: true,
      defaults: {
        continent: function () { return true },
        layer: function () { return true },
        timeline: function () { return true },
        zoom: function () { return true }
      },
      // category_zoom_visibility:{},
      component: 'radar',
      marker_position: { lat: state.stats.poi_stats.lat_mid_weighted, lng: state.stats.poi_stats.lon_mid_weighted }
    };

    markers.midpoint = midpoint;
    markers.weight_point = weight_point;

  }



  return markers;
}

const getters = {
	sidebarExpanded: state => state.sidebarExpanded,
	settingsPane: state => state.settingsPane,
  midpoint:(state) => {
    let lat = (state.stats.poi_stats === undefined) ? 0 : state.stats.poi_stats.lat_mid_weighted;
    let lon = (state.stats.poi_stats === undefined) ? 0 : state.stats.poi_stats.lon_mid_weighted;
    return {lat,lon};
  },

  hotelSummary:(state) => {
    return window.objectToArray(state.hotels);
  },

  mainMapMarkers: (state) => {

    let combined = {};
    if (Object.keys(state.pois).length !== 0) {
      for (var p in state.pois) {
        let poiMarker = buildMarker(state.pois[p]);
        combined[poiMarker.id] = poiMarker
      }
    };

    if (Object.keys(state.hotels).length !== 0) {
      for (var h in state.hotels) {
        let hotelMarker = buildHotel(state.hotels[h]);
        combined[hotelMarker.id] = hotelMarker
      }
    };

    let midMarkers = buildMidPointMarkers(state);
    if (midMarkers.midpoint !== undefined) {
      combined.midpoint = midMarkers.midpoint;
      combined.weight_point = midMarkers.weight_point;
    }
    // console.log('COMBINED:', combined);
    return combined;
  }
}

//----------------------------------------------------------------------------------------------------------------------

const state = {
  hw: 'hallo world!',
	sidebarExpanded: false,
	settingsPane: undefined,
	loadingHotels: false,
  pois: {},
  stats: {},
  hotels:{},
  travel:{}
}

//----------------------------------------------------------------------------------------------------------------------

const vue_store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});

//----------------------------------------------------------------------------------------------------------------------

export default vue_store;

//----------------------------------------------------------------------------------------------------------------------

window.vm = vue_store;

//----------------------------------------------------------------------------------------------------------------------

