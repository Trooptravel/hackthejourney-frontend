<template>
	<div :class="iconClassName"
	     :style="backgroundStyle">
		<div v-if="useMask"
		     class="icon-image"
		     :style="maskStyle"
		     :title="title">
		</div>
		<div v-if="!useMask"
		     class="icon-image"
		     :style="imageStyle">
			<img :src="require(`../assets/static/images/${vendor}/${icon}.${extension}`)"
			     :alt="icon"
			     :style="sizeStyle"
			     :title="title">
		</div>
	</div>
</template>

<script>
import { isIE } from "@/utils/js-utils.js";
export default {
	components: {},
	props: {
		vendor: { type: String, default: "fa" },
		icon: { type: String, default: "camera" },
		extension: { type: String, default: "svg" },
		className: { type: String, default: "icn" },
		mask: { type: Boolean, default: false },
		width: { type: Number, default: 30 },
		color: { type: String, default: "none" },
		title: { type: String, default: "" },
		height: { type: Number, default: 30 }
	},
	data() {
		return {
			useMask: false
		};
	},
	methods: {
		imagePath() {
			let path =
				"../assets/static/images/" +
				this.vendor +
				"/" +
				this.icon +
				"." +
				this.extension;
			if (this.vendor == "https") {
				path = "https:" + this.icon;
			}
			console.log(path);
			return path;
		}
	},
	computed: {
		isFA() {
			return this.vendor === "fa";
		},

		iconClassName() {
			return "icon " + this.className;
		},
		sizeStyle() {
			return {
				width: this.width + "px",
				height: this.height + "px"
			};
		},
		maskStyle() {
			let col = this.color;
			if (col == "none") {
				col = "white";
			}
			return {
				...this.sizeStyle,
				"background-color": col,
				"mask-image": "url(" + this.imagePath + ")"
			};
		},
		backgroundStyle() {
			return {
				width: this.width + "px",
				height: this.height + "px"
			};
		},
		imageStyle() {
			let style = {
				width: this.width + "px",
				height: this.height + "px"
			};
			if (isIE() && this.isFA) style = { ...style, color: this.color };
			return style;
		}
	},

	mounted() {
		this.useMask = isIE() ? false : this.mask;
	}
};
</script>
<style>
div.icon-image {
  mask-size: 100% 100%;
  mask-position: 0% 0%;
  mask-repeat: no-repeat;
  display: flex;
  /* border: 1px solid orange; */
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
div.icon-image img {
  width: 100%;
}

div.icon {
  /* flex:1; */
}
</style>
