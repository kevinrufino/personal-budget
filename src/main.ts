import Vue from 'vue'
import App from './App.vue'
import firebase from "firebase/app"
import "firebase/firestore";
import "firebase/auth";
import VueApexCharts from "vue-apexcharts";


const firebaseConfig = {
  apiKey: "AIzaSyCiQGA8SAEMK0f2xl033ALAkOEyivfxpqs",
  authDomain: "personal-budget-f08b8.firebaseapp.com",
  projectId: "personal-budget-f08b8",
  storageBucket: "personal-budget-f08b8.appspot.com",
  messagingSenderId: "507049840652",
  appId: "1:507049840652:web:2200a27ef4fca4f59c5e29",
  measurementId: "G-5LK6MWSX47"
}
firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false
Vue.prototype.$appDB = firebase.firestore();
Vue.prototype.$appAuth = firebase.auth();
Vue.use(VueApexCharts);

new Vue({
  render: h => h(App),
}).$mount('#app')

