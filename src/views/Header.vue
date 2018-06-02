<template>
	<div class="header">
		<img class="logo"   src="../assets/trooptravel-icon.png">
	<!-- <AddTripPOIs></AddTripPOIs> -->
	</div>
</template>

<script>

import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

import AddTripPOIs from '../components/AddTripPOIs.vue';


export default {
	components: {AddTripPOIs},
	props: [],
	data() {
		return {

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
		...mapGetters([]),
		...mapState(['hw'])
	}
}

</script>

<style scoped lang="scss">
div.header {
  color: white;
  width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  .logo {
    margin-right: 10px;
    height: 40px;
  }
}
</style>
