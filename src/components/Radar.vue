<template>
<div class="radar">
    <!-- THIS IS A RADAR -->
</div>
</template>


<script>

import {mapState,mapActions,mapGetters,mapMutations} from "vuex";

  export default {
  components: {},
  props: [],
  data() { return {

  		}
  	},
  created() {

  },
  mounted() {

  },
  methods:{
  	...mapActions([]),
  	...mapMutations([])
  },
  computed:{
  	...mapGetters([]),
  	...mapState([])
  }
 }
</script>
<style scoped>

	div.radar{
        /* display:none; */
        pointer-events: none;
        border: 1px solid lightblue;
        position: relative;
        width: 10px; 
        height: 10px;
        border-radius: 200px;
        animation-name:radar;
        animation-duration: 3s;
       animation-iteration-count: infinite;
       animation-timing-function: linear;
       
       /* box-shadow: 10px 10px 10px 10px red; */
       

	}


@keyframes radar{
   0% {
     transform:scale(1);
     opacity:0.6;
   }
   100% {
     transform:scale(80);
     opacity:0;
   }
}


    


</style>
