<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <h1>Personal Budget</h1>
    <h2>Kevin Rufino</h2>
    <AppLogin/>
    <div id="comp">
      <BudgetCategory id="box"/>
      <MyExpense id="box"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import BudgetCategory from './components/BudgetCategory.vue';
import MyExpense from './components/MyExpense.vue'
import AppLogin from './components/AppLogin.vue'
import {FirebaseFirestore} from "@firebase/firestore-types";

@Component({
  components: {
    BudgetCategory,
    MyExpense,
    AppLogin
  },
})

export default class App extends Vue {
  readonly $appDB!: FirebaseFirestore;

  // This function is automatically called when
  // the App component is added to the DOM tree
  mounted(): void {
    // Just for debugging, you may delete the following two
    // lines after it is confirmed that this.$appDB is
    // initialized correctly
    console.log("API Key", this.$appDB.app.options_.apiKey);
  }
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#comp {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
#box {
  flex: 1 1 150px; /*  Stretching: */
  flex: 0 1 150px; /*  No stretching: */
  margin: 5px;
}
</style>
