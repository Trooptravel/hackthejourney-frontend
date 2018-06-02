<template>
	<div class="hotel">
		<div class="hotel__row">
			<div class="hotel__name">
				{{hotel.name}}
			</div>
			<div class="hotel__price">
				€ {{hotelPrice | price}}
			</div>
		</div>
		<div class="hotel__row">
			<div class="hotel__trips">
				Trips: {{hotel.hotel_total_trips}}
			</div>
			<div class="hotel__trips">
				Dist: {{hotel.hotel_total_uber_distance}}
			</div>
			<div class="hotel__trips">
				Time: {{hotel.hotel_total_uber_duration / 60 | price}}
			</div>
		</div>
		<div class="hotel__row">
			<div class="hotel__uber_price">
				Uber Price: {{hotel.hotel_total_uber_price}}
			</div>
			<div class="hotel__uber_price">
				Time cost: {{hotel.hotel_total_travel_time_cost | price}}
			</div>
		</div>
		<div class="hotel__row"
		     style="margin-top: 10px; font-weight: bold">
			<div>
				TOTAL COST: € {{hotel.hotel_total_travel_time_cost + hotelPrice + hotel.hotel_total_uber_price | price}}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		hotel: {
			type: Object,
			required: true
		}
	},

	computed: {
		offer() {
			let offerArray = objectToArray(this.hotel.offers);
			let offer = offerArray[0];
			return offer;
		},
		hotelPrice() {
			// this.hotel.offers.
			return this.offer === undefined ? 0 : this.offer.price_total;
		}
	}

}
</script>

<style lang="scss">
.hotel {
  margin-top: 20px;
  display: flex;
  //   justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-size: 12px;
  flex-direction: column;

  &__row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  &__name {
    font-weight: 600;
  }

  &__price {
    float: right;
  }
}
</style>
