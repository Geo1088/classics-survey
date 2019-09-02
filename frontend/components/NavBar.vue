<template>
	<nav :class="['navbar', {vertical}]">
		<div :class="['container', {'is-fullwidth': fullwidth}]">
			<div class="navbar-brand">
				<span class="navbar-item">
					<h1 class="is-size-4">yeet</h1>
				</span>
				<a
					@click="expanded = !expanded"
					role="button"
					:class="['navbar-burger', {'is-active': expanded}]"
					aria-label="menu"
					:aria-expanded="expanded"
				>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</a>
			</div>
			<div :class="['navbar-menu', {'is-active': expanded}]">
				<div class="navbar-start">
					<nav-bar-link
						v-for="route in namedRoutes"
						:key="route.path"
						:route="route"
					/>
				</div>
				<div class="navbar-end">
					<span class="navbar-item has-dropdown is-hoverable" v-if="me">
						<span class="navbar-link">
							<img class="navbar-user-avatar" :src="me.avatar">
							/u/{{me.name}}
						</span>
						<div class="navbar-dropdown">
							<a href="/auth/logout" class="navbar-item">Log out</a>
						</div>
					</span>
					<span v-else class="navbar-item">
						<a class="button is-primary" href="/auth/reddit">
							Log in with Reddit
						</a>
					</span>
				</div>
			</div>
		</div>
	</nav>
</template>

<script>
import {mapState} from 'vuex';
import NavBarLink from './NavBarLink';

export default {
	components: {
		NavBarLink,
	},
	props: {
		routes: Array,
		fullwidth: Boolean,
		vertical: Boolean,
	},
	data () {
		return {
			expanded: false,
		};
	},
	computed: {
		...mapState([
			'me',
		]),
		namedRoutes () {
			return this.routes.filter(route => route.name);
		},
	},
};
</script>

<style lang="scss">
.navbar-user-avatar {
	margin-right: 10px;
	border-radius: 5px;
}
.navbar > .container.is-fullwidth {
	max-width: none;
	flex-basis: calc(100% - 1.5rem);
	flex-grow: 0;
}
</style>
