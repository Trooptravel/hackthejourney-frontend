<template>
	<div class="add-trip-poi-container poi">
		<h4> Point of Interests </h4>
		<div class="poi-top">
			<div class="poi__form-element">
				<span class="demo-input-label">Visit Count</span>
				<el-input-number v-model="trips"
				                 size="mini"
				                 :min="1"
				                 :max="10"></el-input-number>
			</div>
			<div class="poi__form-element">
				<span class="demo-input-label">Search Point of Interest</span>
				<div class="poi__search">
					<vue-google-autocomplete :country="['gb']"
					                         @touchstart="selectAllText"
					                         @click="selectAllText"
					                         @focus="selectAllText"
					                         ref="location-address"
					                         id="location-address"
					                         types=""
					                         classname="location-autocomplete"
					                         v-on:placechanged="getAddress"
					                         :enableGeolocation="true"
					                         placeholder="Add a point of interest...">
					</vue-google-autocomplete>
				</div>
			</div>
		</div>
		<el-button class="next-button"
		           type="primary"
		           @click="gotoHotels">Next</el-button>
	</div>
</template>




<script>
const calcTravelURL = 'https://amadeushack-c3157.appspot.com/clearStats';

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
	for (var i = 0; i < placeResultData.address_components.length; i++) {
		let component = placeResultData.address_components[i];
		if (component.types.indexOf('country') != -1) {
			country = component.long_name;
			country_code = component.short_name;
			break;
		}
	};

	let city = '';
	for (var i = 0; i < placeResultData.address_components.length; i++) {
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

import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import VueGoogleAutocomplete from './VueGoogleAutocomplete.vue';
import axios from 'axios'


export default {
	components: { VueGoogleAutocomplete },
	props: [],
	data() {		return {
			address: '',
			addressText: '',
			addressPlaceID: '',
			trips: 1,
			lat: 0,
			lon: 0

		}
	},
	created() {

	},
	mounted() {

	},
	methods: {
		...mapActions([
			'addPOI',
			'toggleSettings'
		]),

		...mapMutations([]),

		gotoHotels() {
			axios.get(calcTravelURL)
			this.toggleSettings('hotels')
		},

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
				trips_from: this.trips,
				trips_to: this.trips,
				type: 'address'
			}
			this.addPOI(fbPOI);
			this.$refs['location-address'].clear();
			//   this.setCountryCode(this.address.country_code);
			//   this.setCurrentLocation({ lat: this.lat, lon: this.lon });
			//   this.routeCoordinates();
		},
		selectAllText() {
			this.$refs['location-address']['$refs']['autocomplete'].focus();
			this.$refs['location-address']['$refs']['autocomplete'].select();
		},
	},
	computed: {
		...mapGetters([]),
		...mapState([])
	}
}
</script>
<style scoped lang="scss">
div.add-trip-poi-container {
  /* border: 1px solid red; */
  /* position: fixed;
  width: 400px;
  height: 40px;
  top: 0px;
  right: 100px;
  z-index: 1000; */
}

.poi {
  margin-bottom: 20px;
  // width: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;

  &__form-element {
    margin-top: 20px;
    align-self: center;
    display: flex;
    flex-direction: column;
  }

  &__search {
    width: 100%;
  }
}

.next-button {
  width: 100px;
  margin-top: 50px;
  align-self: center;
}

div.poi-top {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

div.trips {
  /* border: 1px solid green; */
  flex: 1;
  max-width: 150px;
}

div.address {
  /* border: 1px solid blue; */

  flex: 1;
}
</style>
