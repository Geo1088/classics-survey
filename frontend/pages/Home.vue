<template>
	<section class="section">
		<div class="container">
			<div class="content has-text-centered">
				<h1>Classics survey!</h1>
				<p>Click the button below to get started.</p>
				<p><a :href="me ? '/form' : '/auth/reddit'" class="button is-primary">Fill out the survey!</a></p>
			</div>
			<!-- <pre>{{info}}</pre> -->
		</div>
	</section>
</template>

<script>
import {mapState, mapActions} from 'vuex';

export default {
	computed: {
		...mapState([
			'me',
		]),
		info () {
			return JSON.stringify(this.me, null, 4);
		},
	},
	methods: {
		...mapActions([
			'getMe',
		]),
	},
	mounted () {
		if (this.me === undefined) {
			this.getMe();
		}
	},
};
</script>
