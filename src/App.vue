<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script>
import Layout from './views/Layout'
import ICN from '@/components/ICN';

import {mapState,mapActions,mapGetters,mapMutations} from "vuex";

export default {
	components: {
		Layout
	},
   data() { return {

  		}
  	},
  created() {

  },
  mounted() {
    this.pageLoaded();
  },
  methods:{
  	...mapActions(['pageLoaded']),
  	...mapMutations([])
  },
  computed:{
  	...mapGetters([]),
  	...mapState([])
  }
}
</script>


<style lang="scss">
@import './assets/sass/app.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
