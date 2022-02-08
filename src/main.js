import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Paginate from 'vuejs-paginate'
import VueMeta from 'vue-meta'
import App from './App.vue'
import router from './router'
import store from './store'
import dateFilter from './filters/date.filter'
import currencyFilter from './filters/currency.filter'
import currencyBillFilter from './filters/currencyBill.filter'
import localizeFilter from './filters/localize.filter'
import localizeAuthFilter from './filters/localizeAuth.filter'
import messagePlugin from './utils/message.plugin'
import titlePlugin from './utils/title.plugin'
import tooltipDirective from './directives/tooltip.directive'
import Loader from '@/app/Loader'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'

Vue.config.productionTip = false
Vue.use(VueMeta)
Vue.use(titlePlugin)
Vue.use(messagePlugin)
Vue.use(Vuelidate)
Vue.filter('date', dateFilter) 
Vue.filter('currency', currencyFilter) 
Vue.filter('bill', currencyBillFilter)
Vue.filter('localize', localizeFilter)
Vue.filter('authLocale', localizeAuthFilter)
Vue.component('Loader', Loader)
Vue.directive('tooltip', tooltipDirective)
Vue.component('Paginate', Paginate)

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
firebase.initializeApp({
  apiKey: "AIzaSyCwf1t2EXWmeGGDqZQjTA1xu2oG6RVHako",
  authDomain: "fire-base-auth-2-f9220.firebaseapp.com",
  projectId: "fire-base-auth-2-f9220",
  storageBucket: "fire-base-auth-2-f9220.appspot.com",
  messagingSenderId: "986989033668",
  appId: "1:986989033668:web:5fc1f38f4bd9b3ce62f191"
});
let app
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')

  }
});
