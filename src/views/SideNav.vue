<template>
	<div class="sidenav-container">
		<div class="sidebar"
		     :class="{ 'sidebar--expanded': sidebarExpanded }">
			<i @click="toggleSidebar"
			   class="fas fa-bars sidebar__expand-icon"></i>

			<SideNavItem label="Points of Interest"
			             icon="map-marker-alt"
						 @click="toggleSettings('poi')" />
			<SideNavItem label="Hotel Preferences"
			             icon="building"
			             @click="toggleSettings('hotels')" />
			<SideNavItem label="Favourites"
			             icon="star"
						 @click="toggleSettings('results')" />

		</div>
		<div class="settings-pane">
			<SettingsPane @close="toggleSettings" />
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SideNavItem from '@/components/SideNavItem';
import SettingsPane from '@/components/SettingsPane';
export default {
	components: {
		SideNavItem,
		SettingsPane
	},

	computed: {
		...mapGetters([
			'sidebarExpanded'
		])
	},

	methods: {
		...mapActions([
			'toggleSidebar',
			'toggleSettings'
		])
	}

}
</script>

<style lang="scss">
.sidenav-container {
  display: flex;
  height: 100%;
}

.sidebar {
  border-right: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.4s;
  width: 60px;

  &--expanded {
    width: 300px;
  }

  &__expand-icon {
    font-size: 25px;
    padding: 20px 0;
    margin-bottom: 10px;
    border-bottom: solid 1px #ccc;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: #ccc;
    }
  }
}
</style>
