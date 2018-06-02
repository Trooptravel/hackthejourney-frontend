<template>
	<div class="hotels">
		<h4> Hotel Preferences </h4>
		<div class="hotels__form">
			<el-date-picker v-model="query.checkInDate"
			                type="date"
			                placeholder="Check in date">
			</el-date-picker>
		</div>
		<el-button class="hotels__find-button"
		           type="primary"
		           @click="findHotels">Search</el-button>
	</div>
</template>

<script>
import axios from 'axios';
const postURL = 'https://hackthejourney.landobyte.com/vue'
export default {

	data() {
		return {
			query: {
				checkInDate: undefined,
				checkOutDate: undefined,
				adults: undefined,
				roomQuantity: undefined
			}
		}
	},

	methods: {
		findHotels() {
			const content = {
				...this.query,
				"lat": 40.4168,
				"lon": -3.7038
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
  }

  &__find-button {
    margin-top: 20px;
  }
}
</style>
