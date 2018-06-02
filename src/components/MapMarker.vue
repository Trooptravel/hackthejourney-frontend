<template>
  <div :class="scaleClass" :style="markerContainerStyle">

  <div v-show="!loading && markerPassesFilter" :class="markerClass" :style="rotateStyle">

    <!-- <div class="marker-icon" :style="iconStyle">
      <icn :width="18" :height="18" :icon="options.icon" :vendor="options.vendor" alt=""></icn>
    </div> -->

    <div :class="calculatingClass('marker-shape')" style="pointer-events:none">
      <svg  style="pointer-events:none" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 640 640" width="90" height="90">
        <defs>
          <path @click="mapMarkerClicked" @mouseenter="doMouseEnter"  @mouseleave="doMouseLeave" style="pointer-events:fill" class="map-marker-path" d="M326.38 9.78C447.71 9.78 546.06 106.62 546.05 226.08C546.05 345.54 335.1 624.95 326.37 624.51C317.63 624.08 106.69 345.53 106.7 226.07C106.7 106.61 205.06 9.78 326.38 9.78Z" :id="id1"></path>
          <path @click="mapMarkerClicked"  @mouseenter="doMouseEnter"  @mouseleave="doMouseLeave" style="pointer-events:fill" class="map-marker-path" d="M314.82 23.01C436.15 23.02 534.5 119.86 534.5 239.31C534.49 358.77 323.54 638.18 314.81 637.75C306.07 637.31 95.14 358.76 95.14 239.3C95.14 119.85 193.5 23.01 314.82 23.01Z" :id="id2"></path>
          <radialGradient :id="id3" gradientUnits="userSpaceOnUse" cx="340.72" cy="193.2" r="168">
            <stop :style="gradientStartStyle" offset="0%"></stop>
            <stop :style="gradientStopStyle" offset="100%">
              <!-- <stop :style="stop-color: #b00909;stop-opacity: 1" offset="0%"></stop>
              <stop :style="stop-color: #710000;stop-opacity: 1" offset="100%"> -->
            </stop>
          </radialGradient>
        </defs>
        <g>

          <g>
            <g>
              <use class="shadow" :xlink:href="'#'+id1" opacity="1" :fill="darkestColor" fill-opacity="1"></use>
              <g>
                <use class="shadow" :xlink:href="'#'+id1" opacity="1" fill-opacity="0" stroke="#000000" stroke-width="1" stroke-opacity="0">
                </use>
              </g>
            </g>
            <g>
              <use :xlink:href="'#'+id2" opacity="1" :fill="'url(#'+id3+')'"></use>
              <g>
                <use :xlink:href="'#'+id2" opacity="1" fill-opacity="0" stroke="#000000" stroke-width="1" stroke-opacity="0">
                </use>
              </g>
            </g>
          </g>

        </g>
      </svg>
    </div>
    <div :class="calculatingClass('marker-image')" :style="imageStyle">
      <img :src="options.photo" alt="">
    </div>
    <div class="marker-text" :style="iconStyle">
      <div class="text-letter" v-for="(l,index) in short_label" :key="l" :style="letterStyle(index)">{{l}}</div>
    </div>
    <div class="map-marker-shadow">

    </div>
  </div>
</div>

</template>


<script>
    import icn from '@/components/ICN.vue';
    import { mapState } from "vuex";
    import { mapActions } from "vuex";
    import { mapGetters } from "vuex";
    import { mapMutations } from "vuex";
    export default {
        components: {icn},
        props: ['options','calculating'],
        data() {
            return {
              hover:false,
              id1:'',
              id2:'',
              id3:'',
              angle:0,
              iconColor: '#333333',
              pass:true,
              imageBackground:'#555555',
              label: 'PYRAMID OF GIZA',
              filters: {},
              visible:true
            }
        },
        created() {

          this.id1 = 'id1'+Math.round(Math.random() * 10000000000);
          this.id2 = 'id2'+Math.round(Math.random() * 10000000000);
          this.id3 = 'id3'+Math.round(Math.random() * 10000000000);
            // let filterFunction = this.options.filterFunction;
            // let v = this;
            this.angle = (this.options.angle === undefined) ? 0 : this.options.angle;
            // let fonCriteriaChanged = function(criteria) {
            //     let pass = filterFunction(criteria);
            //     v.pass = pass;
            //     // v.$set(v.filters, criteria.id, pass);
            // };
            // onEvent(this.options.eventName, fonCriteriaChanged);
        },
        mounted() {
            this.iconColor = '#FFFFFF';
            this.imageBackground = window.darkerColor(this.options.color);
        },
        beforeDestroy() {
          // console.log('MAPMarker On Before Destroy:',this.options);
          // this.unsubscribeFromAllEvents();
        },
        methods: {
            ...mapActions([]),
            ...mapMutations(['setActiveMarker']),
            calculatingClass(additionalClasses) {
                let calculatingClass = (this.calculating === true) ? ' calculating-marker ' : ' not-calculating ';
                return additionalClasses+'  '+calculatingClass;
            },

            doMouseEnter() {
              // console.log('MOUSE ENTER!'+this.options.id);
              // this.setActiveMarker({marker_id:this.options.id,layer:this.options.layer});
              // this.hover = true;
            },
            doMouseLeave() {
              // console.log('MOUSE LEAVE!'+this.options.id);
              this.hover = false;
            },
            mapMarkerClicked() {
              this.hover = true;
              // this.setActiveMarker({marker_id:this.options.id,layer:this.options.layer});
              this.setActiveMarker({marker_id:this.options.id,layer:this.options.layer});
            },
            bindEvents() {

            },
            letterStyle(index) {
                let angle = index * 17 - 120;
                return { 'transform': 'rotateZ(' + angle + 'deg)' }
            }
        },
        computed: {
            ...mapGetters([]),
            ...mapState(['loading','map_level','active_marker']),
            // calculating() {
            //   return false;
            // },
            scaleClass() {
              let hoverClass = (this.hover === true) ? ' hover ' : ' not-hover ';

              // console.log('hoverClass:|'+hoverClass+'|');
              return (this.active_marker == this.options.id) ? 'active-marker visible'+hoverClass : 'normal-marker visible '+hoverClass;
            },
            markerClass() {
              // let hoverClass = (this.hover === true) ? ' hover ' : ' not-hover ';
              // console.log('hoverClass:|'+hoverClass+'|');
              return (this.active_marker == this.options.id) ? 'active-marker map-marker-container' : 'normal-marker map-marker-container';
            },
            rotateStyle() {
              let duration = (this.active_marker == this.options.id) ? 150 : Math.round(Math.random() * 2500) + 500;
              return {transform:'rotateZ('+this.angle+'deg)'};
              // return {transform:'rotateZ('+this.angle+'deg)',}
            },
            markerContainerStyle() {
              let duration = (this.active_marker == this.options.id) ? 150 : Math.round(Math.random() * 2500) + 500;
              return {'animation-duration': 300+'ms'};
              // return {transform:'rotateZ('+this.angle+'deg)',}
            },
            gradientStartStyle() {
              return {'stop-color': window.lighterColor( this.lighterColor),'stop-opacity': 1}
            },
            gradientStopStyle() {
              return {'stop-color': this.color,'stop-opacity': 1}
            },
            short_label() {
							console.log('this.options',this.options);
              let label = this.options.lat;
              return (label.length > 20) ? label.substring(0,20).toUpperCase() + '...' : label.toUpperCase();
              // return (this.options.label.length > 20) ? this.options.label.substring(0,20).toUpperCase() + '...' : this.options.label.toUpperCase();
            },
            svgStyle() {
                let darkerColor = window.darkerColor( this.options.color);
                return { filter: 'drop-shadow( 4px -5px 0px '+darkerColor+' ) drop-shadow( -1px -1px 0px '+darkerColor+' )'  }
            },
            imageStyle() {
              return {background:this.imageBackground,'pointer-events':'none'};
            },
            markerPassesFilter() {
              return true;
              // let mapLevelVisible = true;
              // if (this.options.category_zoom_visibility !== undefined) {
              //   if (this.map_level === 'global') {
              //     mapLevelVisible = (this.options.category_zoom_visibility.Global === true)
              //   } else
              //   if (this.map_level === 'country') {
              //     mapLevelVisible = (this.options.category_zoom_visibility.Country === true)
              //   } else
              //   if (this.map_level === 'city') {
              //     mapLevelVisible = (this.options.category_zoom_visibility.City === true)
              //   } else
              //   if (this.map_level === 'regional') {
              //     mapLevelVisible = (this.options.category_zoom_visibility.Regional === true)
              //   }
              // }
              // return (this.pass && mapLevelVisible);
            },
            iconStyle() {
                let color = this.iconColor;
                let opacity = 0.8;
                let fill = 'white';
                return { color, opacity ,fill,'pointer-events':'none'}
            },
            markerIcon() {
                return '/static/marker_icons/sygic/destination-island.png'
            },
            darkestColor() {
              return window.darkerColor(this.darkerColor);
            },
            darkerColor() {
              return window.darkerColor(this.color);
            },
            lighterColor() {
              return window.lighterColor(this.color);
            },
            color() {
                if (this.options.color == undefined) {
                    return '#333333'
                }
                else {
                    return this.options.color;
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    div.map-marker-container {
      /* background: red; */
        top: -55px;
        position: relative;
        left:-13px;
        max-width: 80px;
        max-height: 80px;
        transform-origin: 45px 90px;
        pointer-events: none;
        /* transform: scale(1.0); */
    }

    .active-marker{
      /* animation: shake;
      animation-duration: 150ms;
      animation-iteration-count: 3;
      pointer-events: none; */
    }

    .calculating-marker{
      animation: shimmer;
      animation-duration: 1500ms;
      animation-iteration-count: 100;
      animation-timing-function: linear;
    }

    .hover{
      /* animation-delay: 30ms; */
      animation-name:baloon;
      animation-duration: 0.3s;
      animation-iteration-count: 1;
      animation-timing-function: linear;
      z-index: 2000;
      animation-fill-mode:forwards;
      pointer-events: none;
    }

    .not-hover{
      animation-name:deflate;
      animation-duration: 0.2s;
      animation-iteration-count: 1;
      animation-timing-function: linear;
      z-index: 1000;
      animation-fill-mode:forwards;
      pointer-events: none;
    }

    .visible{
      /* animation: drop;
      animation-iteration-count: 2; */
    }


    @keyframes shimmer{
      0% {
        opacity: 0.9;
      }
      20% {
        opacity: 0.7;
      }
      50% {
        opacity: 0.5;
      }
      80% {
        opacity: 0.7;
      }
      100% {
        opacity: 0.9;
      }
    }


    @keyframes baloon{
      0% {
        transform:scale(1);
      }
      100% {
        transform:scale(2);
      }
    }

    @keyframes deflate{
      0% {
        transform:scale(2);
      }
      100% {
        transform:scale(1);
      }
    }


    @keyframes drop{
      0% {
        transform:translate3d(0px,-1000px,0px) scale3d(3,3,1);
      }
      100% {
        transform:translate3d(0px,0px,0px) scale3d(1,1,1);
      }
    }



    .normal-marker{

    }

    div.marker-image {
      background: blue;
        position: absolute;
        top: 12px;
        left: 23px;
        width: 38px;
        height: 38px;
        padding:4px;
        border-radius: 50%;
        overflow: hidden;
        pointer-events: none;
    }
    .shadow{
      box-shadow: 3px 3px 3px 3px grey;
    }
    div.marker-image img {
       border-radius: 50%;
       /* position: relative; */
       /* top:-1px; */
       /* left: -1px; */
       height: 100%;
       width: 100%;
       pointer-events: none;
    }

    div.marker-shape {
      /* background: green; */
        position: absolute;
        top: 0px;
        left: 0px;
        pointer-events: none;
    }

    .red{
      border: 1px solid red;
    }

    div.map-marker-shadow{
      position: relative;
      /* border: 1px solid rgba(150,150,150,0.6); */
      height: 10px;
      width: 50px;
      top:75px;
      left:5px;
      z-index: -10;
      border-radius: 100%;
      pointer-events: none;
      /* background: rgba(150,150,150,0.6); */
      /* box-shadow: 0px 0px 10px 10px rgba(150,150,150,0.6); */
    }

    div.marker-icon {
        position: absolute;
        /* border: 1px solid red; */
        z-index: 100;
        display: flex;
        /* background: blue; */
        width: 60px;

          /* Apply only on IE */
        @media screen and (-ms-high-contrast: none) {
          width: 40px;
        }
        height: 10px;
        top: 63px;
        left: 16px;
        justify-content: center;
        pointer-events: none;
    }

    div.marker-icon div.icn{
        flex:1;
        /* border: 1px solid green; */
        max-width: 20px;
        pointer-events: none;

    }

    div.marker-icon svg {
        height: 13px;
        pointer-events: none;
    }

    div.marker-icon div.icn {
        height: 25px;
        pointer-events: none;
    }

    div.marker-text {
        color: white;
        position: absolute;
        /* background: red; */
        width: 60px;
        height: 60px;
        top: 5px;
        left: 15px;
        z-index: 300;
        pointer-events: none;
    }

    div.marker-shape svg {

    }


.map-marker-path{
   /* transition-duration: all 3s; */
}


.map-marker-path :hover{
  /* transition-duration: all 3s; */
  /* transform: scale(2); */
}

div.text-letter {
        font-size: 10px;
        left: 25px;
        top: -2px;
        font-weight: bold;
        position: absolute;
        /* border: 1px solid red; */
        height: 30px;
        width: 10px;
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        -moz-transform-origin: 50% 100%;
        -webkit-transform-origin: 50% 100%;
        -o-transform-origin: 50% 100%;
        -ms-transform-origin: 50% 100%;
        transform-origin: 50% 100%;
    }
</style>
