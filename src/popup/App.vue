<template>
	<div id="app">
		<div class="report-info">
			<progress-table v-if="chapterDetail && !loading" :chapterDetail="chapterDetail" :ignoreSupplement="ignoreSupplement"/>
			<div v-else-if="!chapterDetail && !loading">
				読み込めませんでした :(
			</div>
			<div v-else>
				Now loading!
			</div>
		</div>
		<div class="detail">
			<div class="contents">
				<label>
					<input type="checkbox" v-model="ignoreSupplement"> サプリメント教材を無視
				</label>
			</div>
			<footer>
				<a href="https://github.com/nnn-ed-nico-extension/planner-for-n-yobiko" target="_blank"><fa :icon="['fab', 'github']" />ソースコード</a>
				<a href="https://github.com/nnn-ed-nico-extension/planner-for-n-yobiko" target="_blank"><fa icon="donate" />開発者に寄付をする</a>
			</footer>
		</div>
	</div>
</template>

<script>
import ProgressTable from './components/ProgressTable.vue';

export default {
	name: 'App',
	data: () => ({
		chapterDetail: null,
		ignoreSupplement: false,
		loading: true
	}),
	components: {
		ProgressTable
	},
	watch: {
		ignoreSupplement (newVal) {
			chrome.storage.local.set({ignoreSupplement: newVal}, function() {});
		}
	},
	created () {
		chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
			try {
				chrome.tabs.sendMessage(tab.id, {method: 'getDetail'}, res => {
					this.chapterDetail = res;
				});
			} catch (e) { // eslint-disable-line
				
			} finally {
				this.loading = false;
			}
		});
		chrome.storage.local.get({ignoreSupplement: true}, result => {
			this.ignoreSupplement = result.ignoreSupplement;
		});
	}
}
</script>

<style>
:root {
	--table-border: 1px solid #dbdbdb;
}
html {
	width: 800px;
}

body {
	margin: 0;
}

#app {
	display: flex;
}

a {
	text-decoration: none;
	color: #6486ff;
}
</style>
<style scoped>
.report-info {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 400px;
}

.detail {
	flex: 1;
	display: flex;
	flex-direction: column;
	box-shadow: 0 0 5px 0 #00000034;
}

.detail .contents {
	flex: 1;
	padding: 10px;
}

footer {
	padding: 10px;
	background: #222222;
}

footer a {
	padding: 0 5px;
}
</style>
