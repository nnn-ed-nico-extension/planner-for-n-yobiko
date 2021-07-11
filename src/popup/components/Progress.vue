<template>
	<span class="progress">
		{{_displayValue}} ({{ percentage.toFixed(1) }}%) <span v-if="completed" class="completed"><fa icon="check-circle" /></span>
	</span>
</template>

<script>
export default {
	name: 'v-progress',
	props: {
		max: {
			type: Number
		},
		min: {
			type: Number
		},
		displayValue: {
			type: String
		},
		short: {
			type: Object
		}
	},
	computed: {
		_displayValue () {
			return this.displayValue || `${this._min}/${this._max}`;
		},
		percentage () {
			return (this._min/this._max*100);
		},
		completed () {
			return this.percentage === 100;
		},
		_max () {
			return this.short?.all || this.max || 0;
		},
		_min () {
			return this.short?.passed || this.min || 0;
		}
	}
}
</script>

<style>
.completed {
	color: #44db6c;
}
</style>