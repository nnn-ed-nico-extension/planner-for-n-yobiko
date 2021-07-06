<template>
	<div id="app">
		<div class="report-info">
			<table v-if="chapterDetail && !loading">
				<tr>
					<th colspan="3" class="merge-right-cell">全体</th><td> {{p(passedSections.length, sections.length)}}</td>
				</tr>
				<tr>
					<td rowspan="14" class="padding"></td>
				</tr>
				<template v-if="counts[resourceType.MOVIE]">
				<tr>
					<!--                              --><th colspan="2" class="merge-right-cell">動画</th><td>{{formatTime(moviesLength)}}</td>
				</tr>
				<tr>
					<!--                              --><td rowspan="4" class="padding"></td><td class="merge-right-cell">視聴済み</td><td>{{formatTime(passedMoviesLength)}} ({{getPercentage(passedMoviesLength, moviesLength).toFixed(1)}}%)</td>
				</tr>
				<tr>
					<!--                                                                   --><td class="merge-right-cell">未視聴</td><td>{{formatTime(noPassedMoviesLength)}}</td>
				</tr>
				<tr>
					<!--                                                                   --><td class="merge-right-cell">授業動画数</td><td>{{pd(counts[resourceType.MOVIE])}}</td>
				</tr>
				<tr>
					<!--                                                                   --><td class="merge-right-cell">動画平均時間</td><td>{{formatTime(moviesLengthAverage)}}</td>
				</tr>
				</template>
				<template v-if="counts[resourceType.VR_EXPERIENCE]">
				<tr>
					<!--                              --><th colspan="2" class="merge-right-cell">VR専用動画</th><td>{{pd(counts[resourceType.VR_EXPERIENCE])}}</td>
				</tr>
				</template>
				<template v-if="tests">
				<tr>
					<!--                              --><th colspan="2" class="merge-right-cell">テスト</th><td>{{pd(tests)}}</td>
				</tr>
				<tr>
					<!--                              --><td rowspan="2" class="padding"></td><td class="merge-right-cell">記述/選択テスト</td><td>{{pd(counts[resourceType.EVALUATION_TEST])}}</td>
				</tr>
				<tr>
					<!--                                                                   --><td class="merge-right-cell">論述テスト</td><td>{{pd(counts[resourceType.ESSAY_TEST])}}</td>
				</tr>
				</template>
				<tr>
					<!--                              --><th colspan="2" class="merge-right-cell">レポート</th><td>{{pd(reports)}}</td>
				</tr>
				<tr>
					<!--                              --><td rowspan="2" class="padding"></td><td class="merge-right-cell">記述/選択テスト</td><td>{{pd(counts[resourceType.EVALUATION_REPORT])}}</td>
				</tr>
				<tr>
					<!--                                                                   --><td class="merge-right-cell">論述テスト</td><td>{{pd(counts[resourceType.ESSAY_REPORT])}}</td>
				</tr>
			</table>
			<div v-else-if="!chapterDetail && !loading">
				読み込めませんでした :(
			</div>
			<div v-else>
				Now loading!
			</div>
		</div>
		<div class="detail">
			<label>
				<input type="checkbox" v-model="ignoreSupplement"> サプリメント教材を無視
			</label>
		</div>
	</div>
</template>

<script>
import { resourceType } from './Constants';

export default {
	name: 'App',
	data: () => ({
		chapterDetail: null,
		ignoreSupplement: false,
		loading: true,
		resourceType
	}),
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
	},
	methods: {
		getPercentage: (val, param) => val / param * 100,
		p (val, param) { return `${val}/${param} (${this.getPercentage(val, param).toFixed(1)}%)`; },
		pd (val) { return this.p(val.passed, val.all); },
		calcCount (o, t) { return (this.counts[o] || this.counts[o]) ? {passed: (this.counts[o]?.passed || 0)+(this.counts[t]?.passed || 0), all:(this.counts[o]?.all || 0)+(this.counts[t]?.all || 0)} : void 0; },
		formatTime: s => `${Math.floor(s/3600)}時間${Math.floor((s%3600)/60)}分${s%60}秒`
	},
	watch: {
		ignoreSupplement (newVal) {
			chrome.storage.local.set({ignoreSupplement: newVal}, function() {});
		}
	},
	computed: {
		sections () {
			const sections = this.chapterDetail.chapter.chapter.sections;
			return this.ignoreSupplement
				? sections.filter(sec => sec.material_type != 'supplement')
				: sections;
		},
		passedSections () {
			return this.sections.filter(sec => sec.passed);
		},
		counts (){
			const result = {};
			for (const section of this.sections) {
				if (!result[section.resource_type]) this.$set(result, section.resource_type, {all: 0, passed: 0});
				result[section.resource_type].all = result[section.resource_type].all + 1;
				if (section.passed) result[section.resource_type].passed = result[section.resource_type].passed + 1;
			}
			console.log(result);
			return result;
		},
		movies () {
			return this.sections.filter(sec => sec.resource_type === resourceType.MOVIE);
		},
		passedMovies () {
			return this.passedSections.filter(sec => sec.resource_type === resourceType.MOVIE);
		},
		moviesLength () {
			return  this.movies.reduce((a, c) => a+c.length,0);
		},
		passedMoviesLength () {
			return  this.passedMovies.reduce((a, c) => a+c.length,0);
		},
		noPassedMoviesLength () {
			return this.movies.filter(sec => !sec.passed).reduce((a, c) => a+c.length,0);
		},
		moviesLengthAverage () {
			return Math.floor(this.moviesLength / this.movies.length);
		},
		tests () {
			return this.calcCount(resourceType.ESSAY_TEST, resourceType.EVALUATION_TEST);
		},
		reports () {
			return this.calcCount(resourceType.ESSAY_REPORT, resourceType.EVALUATION_REPORT);
		}
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

.report-info {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 400px;
}

.report-info table {
	border-collapse: collapse;
	border: var(--table-border);
	width: 100%;
}

.report-info table td:not(.padding) {
	border: var(--table-border);
}

.report-info table th {
	border: var(--table-border);
	border-bottom: 0;
}

.report-info table :is(td, th) {
	padding: 7px;
}

.report-info table td.padding {
	width: 15px;
	border: var(--table-border);
	border-top: none;
}

.merge-right-cell {
	border-right: none !important;
}

.merge-right-cell + td{
	border-left: none !important;
}

.detail {
	flex: 1;
	padding: 10px;
	box-shadow: 0 0 5px 0 #00000034;
}
</style>
