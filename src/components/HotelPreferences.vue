<template>
	<div class="hotels">
		<h4> Hotel Preferences </h4>
		<div class="hotels__form">
			<div class="hotels__form-element">
				<el-date-picker v-model="query.checkInDate"
				                type="date"
				                placeholder="Check in date">
				</el-date-picker>
			</div>
			<div class="hotels__form-element">
				<el-date-picker v-model="query.checkOutDate"
				                type="date"
				                placeholder="Check out date">
				</el-date-picker>
			</div>
			<div class="hotels__form-element">
				<el-input-number v-model="query.adults"
				                 :min="1"
				                 :max="3"></el-input-number>
			</div>
			<div class="hotels__form-element">
				<el-input-number v-model="query.roomQuantity"
				                 :min="1"
				                 :max="5"></el-input-number>
			</div>
		</div>
		<!-- <TTAHotelBooking :travellers="20" /> -->
		<el-button class="hotels__find-button"
		           type="primary"
		           @click="findHotels">Search</el-button>
	</div>
</template>

<script>
import axios from 'axios';
import TTAHotelBooking from '@/components/TTAHotelBooking'

const postURL = 'https://hackthejourney.landobyte.com/vue'
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
				roomQuantity: 1
			}
		}
	},

	methods: {
		findHotels() {
			const content = {
				...this.query,
				"lat": 51.5074,
				"lon": -0.1278
			}
			axios.post(postURL, content)
				.then(res => {
					console.log('res:', res);
				})
				.catch(err => {
					console.log('err:', err);
				})
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
    margin-top: 10px;
    align-self: center;
  }

  &__find-button {
    margin-top: 20px;
  }
}
</style>
