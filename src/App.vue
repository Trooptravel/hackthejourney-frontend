<template>
	<div id="app">
		<Layout />
	</div>
</template>

<script>
import Layout from './views/Layout'
import ICN from '@/components/ICN';

import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

export default {
	components: {
		Layout
	},
	data() {		return {

		}
	},
	created() {

	},
	mounted() {
		this.pageLoaded();
	},
	methods: {
		...mapActions(['pageLoaded']),
		...mapMutations([])
	},
	computed: {
		...mapGetters([]),
		...mapState([])
	}
}
</script>


<style lang="scss">
@import "./assets/sass/app.scss";

input.form-control {
  width: 100%;
  font-size: 16px;
  border-radius: 100px;
  padding-left: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 5px;
  outline: none;
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none;
  border: 1px sold #ccc;
  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #ccc;
    opacity: 1;
  }
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
