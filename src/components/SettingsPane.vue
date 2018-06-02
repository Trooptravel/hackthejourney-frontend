<template>
	<div class="settings"
	     :class="{'settings--active': settingsPane}">
		<div class="settings__content"
		     v-if="settingsPane">
			<div class="settings__close"
			     @click="$emit('close')">
				<i class="fas fa-times"></i>
			</div>
			<div v-if="settingsPane === 'hotels'">
				<HotelPreferences />
			</div>
			<div v-if="settingsPane === 'poi'">
				<AddTripPOIs />
			</div>
			<div v-if="settingsPane === 'results'">
				<HotelPrices />
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import HotelPreferences from '@/components/HotelPreferences'
import HotelPrices from '@/components/HotelPrices'
import POISelections from '@/components/POISelections'
import AddTripPOIs from '@/components/AddTripPOIs'
export default {

	components: {
		HotelPreferences,
		POISelections,
		AddTripPOIs,
		HotelPrices
	},

	computed: {
		...mapGetters([
			'settingsPane'
		])
	}

}
</script>

<style lang="scss">
.settings {
  width: 0px;
  background-color: white;
  height: 100%;
  transition: all 0.4s;
  border-right: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  position: relative;

  &--active {
    width: 300px;
  }

  &__content {
    padding-top: 10px;
  }

  &__close {
    position: absolute;
    top: 5px;
    right: 10px;
    cursor: pointer;
  }
}
</style>
