<template>
	<section class="section has-text-centered">
		<h1 class="title">/r/anime Movie Survey</h1>
		<p>It's easy! Pick your ten favorite anime movies of all time below.</p>
		<br>
		<br>
		<show-picker v-model="selections"/>
		<div class="footer">
			<button :class="['button is-success is-large', {'is-loading': loading}]" :disabled="!changed" @click="submitForm">
				{{changed ? 'Submit' : 'Saved!'}}
			</button>
		</div>
		<div style="height: 100px;"></div>
	</section>
</template>

<script>
import ShowPicker from '../components/ShowPicker';
import {mapState, mapActions} from 'vuex';

const idSearchQuery = `
    query ($ids: [Int]) {
        anime: Page (page: 1, perPage: 50) {
            pageInfo {
                total
            }
            results: media (type: ANIME, id_in: $ids) {
                id
                format
                startDate {
                    year
                }
                title {
                    romaji
                    english
                    native
                    userPreferred
                }
                coverImage {
                    large
                }
                siteUrl
            }
        }
    }
`;

async function makeQuery (variables) {
	const response = await fetch('https://graphql.anilist.co', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({
			query: idSearchQuery,
			variables,
		}),
	});
	if (!response.ok) return alert('no bueno');
	const data = await response.json();
	return data.data;
}

export default {
	components: {
		ShowPicker,
	},
	data () {
		return {
			selections: [],
			changed: false,
			loading: false,
		};
	},
	computed: {
		...mapState([
			'response',
		]),
		selectionDisplay () {
			return this.selectionIDs.join(',');
		},
		selectionIDs () {
			return this.selections.map(s => s.id);
		},
	},
	watch: {
		async response (newVal) {
			if (!newVal) {
				this.selections = [];
			}
			const data = await makeQuery({
				ids: newVal.split(','),
			});
			this.selections = data.anime.results;
		},
		selections () {
			this.changed = true;
		},
	},
	methods: {
		...mapActions(['getResponse']),
		async submitForm () {
			this.loading = true;
			const response = await fetch('/api/response', {
				method: 'POST',
				body: this.selectionIDs.join(','),
			});
			this.loading = false;
			if (response.ok) {
				this.changed = false;
			} else {
				window.alert(await response.text());
			}
		},
	},
	mounted () {
		if (!this.response) {
			this.getResponse();
		}
	},
};
</script>

<style lang="scss">
.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 1.5rem !important;
}
</style>
