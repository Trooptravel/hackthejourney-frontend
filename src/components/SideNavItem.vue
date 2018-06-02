<template>
	<div class="sidenav-item"
	     @click="$emit('click')">
		<div v-if="sidebarExpanded"
		     class="sidenav-item--expanded">
			<i :class="`fas fa-${icon}`" /> {{label}}
		</div>
		<div v-else
		     class="sidenav-item--collapsed">
			<i :class="`fas fa-${icon}`"></i>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	props: {
		label: {
			type: String,
			required: true
		},

		icon: {
			type: String,
			required: true
		}
	},

	computed: {
		...mapGetters([
			'sidebarExpanded'
		]),

		colorStyle() {
			return {
				color: this.color
			}
		}
	}

}
</script>

<style lang="scss">
.sidenav-item {
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #ccc;
    i {
      //   color: #fff;
    }
  }

  &--collapsed {
    i {
      font-size: 25px;
    }
  }
}
</style>
