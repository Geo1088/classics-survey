<template>
	<div class="panel show-picker">
		<h2 class="panel-heading">Select shows</h2>
		<p class="panel-tabs">
			<a @click="selectedTab = 'search'" :class="{'is-active': selectedTab === 'search'}">Search</a>
			<a @click="selectedTab = 'selections'" :class="{'is-active': selectedTab === 'selections'}">Selections</a>
		</p>
		<template v-if="selectedTab === 'search'">
			<div class="panel-block">
				<div class="field has-addons">
					<p class="control has-icons-left is-expanded">
						<input
							class="input is-small"
							type="text"
							:value="search"
							@input="handleInput($event)"
							placeholder="Search by title..."
						/>
						<span class="icon is-small is-left">
							<i class="fas fa-search"/>
						</span>
					</p>
					<div class="control">
						<span
							class="button is-small is-static"
							:class="{'is-loading': !loaded}"
						>
							{{total}} show{{total === 1 ? '' : 's'}}
						</span>
					</div>
				</div>
			</div>
			<template v-if="loaded && shows.length">
				<show-entry
					v-for="show in shows"
					:key="show.id"
					:show="show"
					:selected="showSelected(show)"
					@action="toggleShow(show, $event)"
				/>
			</template>
			<div v-if="loaded" class="panel-block">
				No results :(
			</div>
			<div class="panel-block" v-else>
				Loading...
			</div>
		</template>
		<template v-else-if="value.length">
			<show-entry
				v-for="show in value"
				:key="'selected' + show.id"
				:show="show"
				:selected="showSelected(show)"
				@action="toggleShow(show, $event)"
			/>
		</template>
		<template v-else>
			<div class="panel-block">
				Select shows from the "Search" tab.
			</div>
		</template>
	</div>
</template>

<script>
import ShowEntry from './ShowEntry';

const showSearchQuery = `
    query ($search: String) {
        anime: Page (page: 1, perPage: 50) {
            pageInfo {
                total
            }
            results: media (type: ANIME, search: $search, startDate_lesser: 20170930) {
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

export default {
	components: {
		ShowEntry,
	},
	props: {
		value: Array,
	},
	data () {
		return {
			loaded: true,
			typingTimeout: null,
			search: '',
			shows: [],
			total: 'No',
			selectedTab: 'search',
		};
	},
	methods: {
		handleInput (event) {
		// TODO - this could just be a watcher
			this.search = event.target.value;
			this.loaded = false;
			clearTimeout(this.typingTimeout);
			this.typingTimeout = setTimeout(() => {
				this.sendQuery();
			}, 750);
		},
		async sendQuery () {
			if (!this.search) {
				this.loaded = true;
				this.shows = [];
				this.total = 'No';
				return;
			}
			const response = await fetch('https://graphql.anilist.co', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				body: JSON.stringify({
					query: showSearchQuery,
					variables: {
						search: this.search,
					},
				}),
			});
			if (!response.ok) return alert('no bueno');
			const data = await response.json();
			this.shows = data.data.anime.results;
			this.total = data.data.anime.pageInfo.total || 'No';
			this.loaded = true;
		},
		showSelected (show) {
			return this.value.some(s => s.id === show.id);
		},
		toggleShow (show, select = true) {
			if (select) {
				if (this.showSelected(show)) return;
				this.$emit('input', [...this.value, show]);
			} else {
				if (!this.showSelected(show)) return;
				const index = this.value.findIndex(s => s.id === show.id);
				const arr = [...this.value];
				arr.splice(index, 1);
				this.$emit('input', arr);
			}
		},
	},
};
</script>

<style lang="scss">
.show-picker {
	max-width: 600px;
	margin: 0 auto;
}
</style>
