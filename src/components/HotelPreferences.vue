<template>
	<div class="hotels">
		<h4> Hotel Preferences </h4>
		<div class="hotels__form">
			<div class="hotels__form-element">
				<span class="demo-input-label">Check-in Date</span>
				<el-date-picker v-model="query.checkInDate"
				                type="date"
				                placeholder="Check in date">
				</el-date-picker>
			</div>
			<div class="hotels__form-element">
				<span class="demo-input-label">Check-out Date</span>
				<el-date-picker v-model="query.checkOutDate"
				                type="date"
				                placeholder="Check out date">
				</el-date-picker>
			</div>
			<div class="hotels__form-element">
				<span class="demo-input-label">Number of Adults</span>
				<el-input-number v-model="query.adults"
				                 :min="1"
				                 :max="3"></el-input-number>
			</div>
			<div class="hotels__form-element">
				<span class="demo-input-label">Amount of rooms</span>
				<el-input-number v-model="query.roomQuantity"
				                 :min="1"
				                 :max="5"></el-input-number>
			</div>
			<div class="hotels__form-element">
				<span class="demo-input-label">Minimum rating</span>
				<el-rate v-model="query.ratings"></el-rate>
			</div>
			<div class="hotels__form-element" style="width: 80%">
				<span class="demo-input-label">Price</span>
				<el-slider v-model="query.priceRangeUpper"
				           :max="500"></el-slider>
			</div>
		</div>
		<el-button class="hotels__find-button"
		           type="primary"
		           @click="findHotels">Search</el-button>
	</div>
</template>

<script>
import axios from 'axios';
import TTAHotelBooking from '@/components/TTAHotelBooking'
import { mapGetters, mapActions, mapMutations } from 'vuex'

const postURL = 'https://hackthejourney.landobyte.com/vue';
const calcTravelURL = 'https://amadeushack-c3157.appspot.com/calcTravel';
export default {

	components: {
		TTAHotelBooking
	},

	data() {
		return {
			query: {
				checkInDate: undefined,
				checkOutDate: undefined,
				adults: 1,
				roomQuantity: 1,
				ratings: 3,
				priceRangeUpper: 100
			}
		}
	},

	computed: {
		...mapGetters([
			'midpoint'
		])
	},

	methods: {
		...mapActions([
			'toggleSettings'
		]),

		...mapMutations([
			'setLoadingHotels'
		]),

		findHotels() {
			const content = {
				...this.query,
				...this.midpoint
			}

			delete content.priceRangeUpper
			delete content.ratings

			this.setLoadingHotels(true)

			axios.post(postURL, content)
				.then(res => {
					console.log('res:', res);
					axios.get(calcTravelURL)
					this.setLoadingHotels(false)
				})
				.catch(err => {
					console.log('err:', err);
				})
			this.toggleSettings('results')
		}
	}

}
</script>

<style lang="scss">
.hotels {
  &__form {
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
  }

  &__form-element {
    margin-top: 20px;
    align-self: center;
  }

  &__find-button {
    margin-top: 20px;
  }
}
</style>
