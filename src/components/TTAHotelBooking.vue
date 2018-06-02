<template>
  <div class="tta-hotel-booking-detail">
    <div class="hotel-booking-title">
      HOTEL BOOKING REQUIREMENTS
    </div>
    <!-- <div class="private-rooms-total">
      {{getTravellers}} - {{booked}} = {{remaining}}
    </div> -->
    <div class="private-rooms">
      <div class="private-rooms-label label">
        Total Travellers
      </div>
      <div class="private-rooms-value value">
        {{getTravellers}}
      </div>
    </div>
    <div class="private-rooms">
      <div class="private-rooms-label label">
        Private Rooms
      </div>
      <div class="private-rooms-value value">
        {{remaining}}
      </div>
    </div>
    <div v-for="(group,index) in groups" class="tta-hotel-booking">
      <TTAHotelBookingItem :booking-item="group" :index="index" @on-booking-changed="onBookingChanged" @delete-booking="deleteBooking">

      </TTAHotelBookingItem>
    </div>
    <div v-if="this.remaining > 0" class="booking-buttons">
      <div v-if="!hasOwnArrangement" class="book-group-button button-own" @click="addGroup('own')">
        <div class="plus-sign">
          +
        </div>
        Own
      </div>
      <div class="book-group-button button-group" @click="addGroup('share')">
        <div class="plus-sign">
          +
        </div>
        Group
      </div>
      <div class="book-group-button button-family" @click="addGroup('family')">
        <div class="plus-sign">
          +
        </div>
        Family
      </div>
    </div>
  </div>
</template>

<script>

import TTAHotelBookingItem from './TTAHotelBookingItem.vue';

import {mapState,mapActions,mapGetters,mapMutations} from "vuex";
export default {
  components: {
    TTAHotelBookingItem
  },
  props: {travellers:{type:Number,required:true}},
  data() {
    return {
      // {quantity:1,type:'family', adults:2,children:2,label:'Family'},
      //         {quantity:1,type:'share',  adults:0,children:0,male:3,female:3,label:'Sharing'},
      //         {quantity:1,type:'own',    adults:2,children:0,male:0,female:0,label:'Own Arrangement'},
      //         {quantity:1,type:'private',adults:2,children:0,label:'Private Room'}
      groups:[]
    }
  },
  created() {
console.log('travellers:',this.travellers);
  },
  mounted() {

  },
  methods:{
    ...mapActions([]),
  	...mapMutations([]),
    deleteBooking(index) {
      this.groups.splice(index,1);
    },
    addGroup(type) {
      const labels = {family:'Family',share:'Sharing',own:'Own Arrangement',private:'Private Room'};
      let group = {quantity:1,type:type,label:labels[type]};
      if (type === 'own') {
        group.adults = 1;
      } else
      if (type === 'family') {
        group.adults = 2;
        group.children = 2;
      } else
      if (type === 'share') {
        group.male = 2;
        group.female = 2;
      };
      this.groups.push(group);
    },
    adults(index) {
      return (this.groups[index].adults === undefined) ? 0 : this.groups[index].adults;
    },
    children(index) {
      return (this.groups[index].children === undefined) ? 0 : this.groups[index].children;
    },
    male(index) {
      return (this.groups[index].male === undefined) ? 0 : this.groups[index].male;
    },
    female(index) {
      return (this.groups[index].female === undefined) ? 0 : this.groups[index].female;
    },

    onBookingChanged(booking) {
      this.groups[booking.index].quantity = booking.quantity;
      this.groups[booking.index].adults = booking.adults;
      this.groups[booking.index].children = booking.children;
      this.groups[booking.index].male = booking.male;
      this.groups[booking.index].female = booking.female;
      console.log('booking:',booking);
    }
  },
  computed:{
  	...mapGetters([]),
  	...mapState([]),
    hasOwnArrangement() {
      let res = false;
      for (var i = 0 ; i < this.groups.length ; i ++ ) {
        let group = this.groups[i];
        if (group.type === 'own') {
          res = true;
          break
        }
      }
      return res;
    },
    remaining() {
      return this.getTravellers - this.booked;
    },
    getTravellers() {
      return this.travellers * 1;
    },
    booked() {
      let res = 0;
      for (var i = 0 ; i < this.groups.length ; i ++ ) {
        let group = this.groups[i];
        let groupTotal = group.quantity * (this.adults(i) +
        this.children(i) +
        this.male(i) +
        this.female(i) );
        res = res + groupTotal
      }
      return res;
    },
  }
 }
</script>
<style scoped>

div.hotel-booking-title{
  padding:10px;
 background: #14212A;

}

div.private-rooms-total{
  /* border: 1px solid red; */
}

div.private-rooms{
  /* border: 1px solid red; */
  background:#0098DA;
  padding:5px;
  display: flex;
}

div.private-rooms-label{
  flex:1;
  text-align: left;
  margin-left: 10px;
}

div.private-rooms-value{
  flex:1;
  background: #14212A;
  margin-top:2px;
  padding:3px;
  max-width: 40px;
  margin-right: 45px;
  border-radius: 4px;
  font-size: 20px;
}

div.private-rooms-total{
  background: #0098DA;
  margin-top:2px;
  padding:3px;

}


div.tta-hotel-booking{
  background: #0098DA;
  margin-top:2px;
  margin-bottom:2px;
  padding:5px;

}

div.plus-sign{
  position: absolute;
  top:-15px;
  right: -5px;
  background: #98BF0D;
  max-width: 30px;
  max-height: 30px;
  min-height: 30px;
  min-width: 30px;
  border-radius: 15px;
  font-size: 25px;
}

div.booking-buttons{
  padding-top:10px;
  display:flex;
  align-items: flex-end;
  justify-content: flex-end;
  background: #0098DA;
  padding-bottom:10px;
  padding-right:10px;
}

div.book-group-button{
  position: relative;
  flex:1;
  max-width: 100px;
  border: 1px solid grey;
  margin:5px;
  padding:10px;
  text-align: center;
  min-height: 30px;
  border-radius: 5px;
  box-shadow: 1px 1px 1px 2px rgba(250,250,250,0.5);
  cursor: pointer;
  margin:10px;
}

div.tta-hotel-booking-detail{
  background: #14212A;
  color:white;
  font-weight: bold;
  box-shadow: 2px 2px 3px 4px rgba(50,50,50,0.7);
  border-radius: 5px;
  overflow: hidden;
}

div.tta-hotel-booking{
  /* border: 1px solid red; */
}

</style>
