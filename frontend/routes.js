import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// Layouts, pages, and routing
import PublicLayout from './layouts/Default';

import Home from './pages/Home';
import Form from './pages/Form';
import NotFound from './pages/NotFound';

export default new VueRouter({
	mode: 'history',
	routes: [
		// Default layout
		{
			path: '/',
			component: PublicLayout,
			children: [
				{path: '', component: Home},
				{path: 'form', component: Form},
			],
		},
		// 404 route - keep last
		{path: '*', component: NotFound},
	],
});
