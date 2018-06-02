<template>
	<div class="hotel-prices-container"
	     v-loading="loading">
		 <h4> Hotels </h4>
		<Hotel v-for="hotel in hotelSummary"
		       :hotel="hotel"
		       :key="hotel.id" />
	</div>
</template>


<script>
import Hotel from '@/components/Hotel'
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

export default {
	components: {
		Hotel
	},
	props: [],
	data() {		return {

		}
	},
	created() {

	},
	mounted() {

	},
	methods: {
		...mapActions([]),
		...mapMutations([])
	},
	computed: {
		...mapGetters(['hotelSummary']),
		...mapState([
			'loadingHotels'
		]),

		loading() {
			return this.loadingHotels
		}
	}
}
</script>
<style>
div.hotel-prices-container {
	overflow: auto;
	padding: 10px;
}
</style>
