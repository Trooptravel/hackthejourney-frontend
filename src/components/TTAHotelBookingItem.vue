<template>
  <div class="tta-hotel-booking-item-container">
    <div class="heading-label">
      {{bookingItem.label}}
    </div>
<div class="tta-hotel-booking-item">


  <div v-if="isOfType(['share','family'])" class="input-group quantity">
    <div class="input-label">
      Groups
    </div>
    <div class="input-value">
      <input class="hotel-booking-input" type="text" name="" value="" v-model="quantity" @change="onTotalChange">
    </div>
  </div>
  <div v-if="isOfType(['share'])" class="input-group male">
    <div class="input-label">
      Male
    </div>
    <div class="input-value">
      <input class="hotel-booking-input" type="text" name="" value="" v-model="male" @change="onTotalChange">
    </div>
  </div>
  <div v-if="isOfType(['share'])" class="input-group female">
    <div class="input-label">
      Female
    </div>
    <div class="input-value">
      <input class="hotel-booking-input" type="text" name="" value="" v-model="female" @change="onTotalChange">
    </div>
  </div>
  <div v-if="isOfType(['own'])" class="input-group adults">
    <div class="input-label">
      People
    </div>
    <div class="input-value">
      <input class="hotel-booking-input" type="text" name="" value="" v-model="adults" @change="onTotalChange">
    </div>
  </div>
  <div v-if="isOfType(['family','private'])" class="input-group adults">
    <div class="input-label">
      Adults
    </div>
    <div class="input-value">
      <input class="hotel-booking-input" type="text" name="" value="" v-model="adults" @change="onTotalChange">
    </div>
  </div>
  <div v-if="isOfType(['family'])" class="input-group children">
    <div class="input-label">
      Cildren
    </div>
    <div class="input-value">
      <input class="hotel-booking-input" type="text" name="" value="" v-model="children" @change="onTotalChange">
    </div>
  </div>
  <div class="total">
    {{total}}
  </div>
  <div class="delete-button" @click="deleteBooking">
    -
  </div>
</div>
</div>

</template>


<script>

import {mapState,mapActions,mapGetters,mapMutations} from "vuex";

  export default {
  components: {},
  props: {
    index:{type:Number,required:true},
    bookingItem:{type:Object,required:true}
  },
  data() { return {
    quantity:1,
    adults:0,
    children:0,
    male:0,
    female:0
  }
},
  created() {
    console.log('bookingItem:',this.bookingItem);
    this.quantity = ((this.bookingItem.quantity === undefined) ? 0 : this.bookingItem.quantity );
    this.adults   = ((this.bookingItem.adults   === undefined) ? 0 : this.bookingItem.adults );
    this.children = ((this.bookingItem.children === undefined) ? 0 : this.bookingItem.children );
    this.male     = ((this.bookingItem.male     === undefined) ? 0 : this.bookingItem.male );
    this.female   = ((this.bookingItem.female   === undefined) ? 0 : this.bookingItem.female );
    console.log('CREATED: quantity:',this.quantity, 'adults:',this.adults, 'children:',this.children, 'male:',this.male, 'female:',this.female);
  },
  mounted() {

  },
  methods:{
  	...mapActions([]),
  	...mapMutations([]),
    deleteBooking() {
      this.$emit('delete-booking',this.index * 1);
    },
    onTotalChange() {
      this.$emit('on-booking-changed',{
        index:(this.index === undefined ? 0 : this.index * 1),
        quantity:(this.quantity === undefined ? 0 : this.quantity * 1),
        adults:(this.adults === undefined ? 0 : this.adults * 1),
        children:(this.children === undefined ? 0 : this.children * 1),
        male:(this.male === undefined ? 0 : this.male * 1),
        female:(this.female === undefined ? 0 : this.female * 1)});
      },
      isOfType(types) {
        return types.indexOf(this.bookingItem.type) > -1;
      },
    updateValue() {
      let newValue = !this.value;
      this.$emit('input',!this.value);
      this.$emit('change',newValue);
    }
  },
  computed:{
  	...mapGetters([]),
  	...mapState([]),
    total() {
      console.log('quantity:',this.quantity, 'adults:',this.adults, 'children:',this.children, 'male:',this.male, 'female:',this.female);
      return this.quantity * (  this.adults * 1 + this.children * 1 + this.male * 1 + this.female * 1  );
    }
  }
 }
</script>
<style scoped>

div.input-label{
  font-size: 12px;
}

div.delete-button{
  margin:5px;
  padding:5px;
  border: 1px solid red;
  background: red;
  max-height: 25px;
  min-height: 25px;
  max-width: 25px;
  min-width: 25px;
  line-height: 12px;
  font-weight: bold;
  color:white;
  font-size:30px;
  border-radius: 50%;
  box-shadow: 1px 1px 1px 2px rgba(150,50,50,0.7);
  cursor: pointer;
}


div.total{
  /* border: 1px solid blue; */
  max-width: 40px;
}

div.input-group{
  /* border: 1px solid yellow; */
  width: 30px;
}

div.heading-label{
  /* border: 1px solid green; */
  /* max-width: 60px; */
  text-align: left;
  margin-left: 10px;
  font-size: 20px;
  padding:5px;
}

input.hotel-booking-input{
  width: 30px;
}

div.tta-hotel-booking-item div.label{
  /* display:flex; */
  flex:1;
}

div.tta-hotel-booking-item div.male{
  /* display:flex; */
  flex:1;
}

div.tta-hotel-booking-item div.female{
  /* display:flex; */
  flex:1;
}

div.tta-hotel-booking-item div.quantity{
  /* display:flex; */
  flex:1;
}

div.tta-hotel-booking-item div.adults{
  /* display:flex; */
  align-content: flex-start;
  flex:1;
}

div.tta-hotel-booking-item div.children{
  /* display:flex; */
  flex:1;
}

div.tta-hotel-booking-item div.total{
  /* display:flex; */
  font-size: 20px;
  background: #14212A;
  padding:3px;
  border-radius: 4px;
  margin-right: 10px;
  flex:1;
}

	div.tta-hotel-booking-item{
    display: flex;
    align-items: flex-end;
    align-content: flex-start;
	}

</style>
