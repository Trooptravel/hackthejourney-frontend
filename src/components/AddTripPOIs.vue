<template>
<div class="add-trip-poi-container">
    <div class="poi-top">
        <vue-google-autocomplete  :country="['es']" @touchstart="selectAllText" @click="selectAllText" @focus="selectAllText" ref="location-address" id="location-address" types="" classname="location-autocomplete" v-on:placechanged="getAddress"
                    :enableGeolocation="true" placeholder="Your Location...">
        </vue-google-autocomplete>
    </div>
    <div class="poi-points">

    </div>
    <div class="poi-bottom">

    </div>
</div>
</template>




<script>


function assignPlace(addressData, placeResultData) {
  const fields = ['place_id', 'icon', 'rating', 'website', 'formatted_phone_number', 'html_attributions', 'name'];
  let address = addressData;
  if (placeResultData.photos != undefined) {
    if (placeResultData.photos.length > 0) {
      let photo = placeResultData.photos[0].getUrl({ 'maxWidth': 300, 'maxHeight': 300 });
      address['photo'] = photo;
    }
  };
  for (var i = 0; i < fields.length; i++) {
    let field = fields[i];
    if (placeResultData[field] != undefined) {
      address[field] = placeResultData[field]
    }
  };
  let country = '';
  let country_code = '';
  for (var i = 0 ; i < placeResultData.address_components.length ; i ++ ) {
    let component = placeResultData.address_components[i];
    if (component.types.indexOf('country') != -1) {
      country = component.long_name;
      country_code = component.short_name;
      break;
    }
  };

  let city = '';
  for (var i = 0 ; i < placeResultData.address_components.length ; i ++ ) {
    let component = placeResultData.address_components[i];
    if (component.types.indexOf('locality') != -1) {
      city = component.long_name;
      break;
    }
  };

  let meeting_address = placeResultData.formatted_address;
  address['meeting_address'] = meeting_address;
  address['city'] = city;
  address['country'] = country;
  address['country_code'] = country_code;
  return address;
};

import {mapState,mapActions,mapGetters,mapMutations} from "vuex";
import VueGoogleAutocomplete from './VueGoogleAutocomplete.vue';



  export default {
  components: {VueGoogleAutocomplete},
  props: [],
  data() { return {
      address:'',
      addressText:'',
      addressPlaceID:'',
      lat:0,
        lon:0

  		}
  	},
  created() {

  },
  mounted() {

  },
  methods:{
  	...mapActions(['addPOI']),
  	...mapMutations([]),
    getAddress(addressData, placeResultData, id) {
      this.address = assignPlace(addressData, placeResultData);
      this.addressText = placeResultData.formatted_address;
      this.addressPlaceID = this.address.place_id;
      this.lat = this.address.latitude;
      this.lon = this.address.longitude;


      let fbPOI = {
  account_id: 1,
  address: this.addressText,
  city: this.address.city,
  country: this.address.country_code,
  created_by: 1,
  created_timestamp: new Date(),
  deleted: false,
  id: window.getID("htj_poi-"),
  lat: this.address.latitude,
  lon: this.address.longitude,
  modified_by: 1,
  modified_timestamp: new Date(),
  name: this.address.name,
  picutres: this.address.photo,
  place_id: this.address.place_id,
  trips_from: 1,
  trips_to: 1,
  type: 'address'
}
    this.addPOI(fbPOI);
      console.log('GOT ADDRESS:',fbPOI);
    //   this.setCountryCode(this.address.country_code);
    //   this.setCurrentLocation({ lat: this.lat, lon: this.lon });
    //   this.routeCoordinates();
            },
    selectAllText() {
    this.$refs['location-address']['$refs']['autocomplete'].focus();
    this.$refs['location-address']['$refs']['autocomplete'].select();
        },
  },
  computed:{
  	...mapGetters([]),
  	...mapState([])
  }
 }
</script>
<style scoped>

	div.add-trip-poi-container{
        border: 1px solid red;
        position:fixed;
        width: 300px;
        height: 300px;
        top:50px;
        right:100px;
    z-index: 100;
        }


div.poi-top{
    border: 1px solid green;
}
div.poi-points{
        border: 1px solid blue;

}
div.poi-bottom{
        border: 1px solid yellow;
}

</style>
