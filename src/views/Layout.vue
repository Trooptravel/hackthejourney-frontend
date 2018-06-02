<template>
	<div class="layout">
		<div class="header">
			<Header />
		</div>

		<div class="sidenav">
			<SideNav :class="{ 'sidenav--expanded': sidebarExpanded } " />
		</div>
		<div class="body">

			<GoogleMap  :center="mapcenter" :markers="mapmarkers"></GoogleMap>

			<!-- <router-view/> -->
		</div>
		<!-- <div class="footer">
			<Footer />
		</div> -->
	</div>
</template>


<script>
import Header from './Header'
import SideNav from './SideNav'
import Footer from './Footer'


import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import GoogleMap from '@/components/GoogleMap.vue';
import AddTripPOIs from '@/components/AddTripPOIs.vue';
import HotelPrices from '@/components/HotelPrices.vue';

export default {
	components: {
		HotelPrices,
		AddTripPOIs,
		GoogleMap,
		Header,
		SideNav,
		Footer
	},
	props: [],
	data() {		return {
			showMap:true,
			timer:undefined,
			center:{lat:0,lon:0}
		}
	},
	created() {

	},
	mounted() {

	},
	methods: {
		...mapActions(['zoomToMidPoint']),
		...mapMutations([]),
		zoomMapToCenter() {
			let layout = this;
			console.log('ZOOMING THE MAP!');
			if (this.center !== this.midpoint) {


			if (this.timer === undefined) {

				layout.timer = setTimeout(function() {

					layout.zoomToMidPoint();
					layout.center = layout.midpoint;
				},2000);
			}
			else {
				clearTimeout(this.timer);
				layout.timer = undefined;
				layout.timer = setTimeout(function() {
					layout.zoomToMidPoint();
					layout.center = layout.midpoint;
				},2000);
			}
		  }
			// this.zoomToMidPoint();
		}
	},
	computed: {
		...mapGetters([
			'mainMapMarkers',
			'sidebarExpanded',
			'midpoint'
		]),
		...mapState([]),
		mapcenter() {
			let center = {lat:0,lng:0};
			if (this.mainMapMarkers.weight_point !== undefined) {
				center = this.mainMapMarkers.weight_point;
			}
			return center;
		},
		mapmarkers() {
			// console.log('REFRESHING MARKERS:');
			this.zoomMapToCenter();
			let res = [];
			for (var m in this.mainMapMarkers ) {
				let marker = this.mainMapMarkers[m];
				marker.sort = Math.random() * 100000;
				marker.id = marker.id + marker.sort;
				res.push(marker);
			};
			return res.sort(function(a,b) {return a.sort - b.sort});
		}
	}
}
</script>
<style lang="scss">
@import "../assets/sass/app.scss";
div.layout {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: #eee;
  z-index: 2;
}

.body {
  position: fixed;
  top: 40px;
  left: 60px;
  right: 0;
  bottom: 0px;
  z-index: 0;
}

.sidenav {
  z-index: 1;
  position: fixed;
  top: 40px;
  left: 0;
  bottom: 0px;
  min-width: 60px;
  background-color: $light-background;
  transition: all .4s;
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  height: 50px;
  background-color: $dark-blue;
}
</style>
