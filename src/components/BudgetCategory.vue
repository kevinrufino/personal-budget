<template>
  <div id="BudgetCategory">
    <h3>Add Expense Category</h3>

    <div>Category
    <input type="text" v-model="budgetCategory">
    </div>
    
    <div>Monthly Budget
    <input type="number" v-model.number="budgetLimit">
    </div>

    <br>
    <button v-on:click="saveCategory">Add Category</button>
    <br>

    <tbody>
      <tr>
        <th>Category</th>
        <th>Monthly Limit</th>
      </tr>
      <tr v-for="(z,pos) in allCategories" :key="pos">
        <td>{{z.name}}</td>
        <td>${{z.limit.toFixed(2)}}</td>
      </tr>
    </tbody>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { FirebaseFirestore, QuerySnapshot, QueryDocumentSnapshot } from "@firebase/firestore-types";
  import { FirebaseAuth } from "@firebase/auth-types"

  @Component
  export default class BudgetCategory extends Vue {
    readonly $appDB!: FirebaseFirestore;
    readonly $appAuth!: FirebaseAuth;
    private uid = "none";
    private budgetCategory = "";
    private budgetLimit = 50;
    private allCategories: any[] = [];

    saveCategory(): void {
      this.$appDB
        .collection(`users/${this.uid}/categories`)
        .add({name: this.budgetCategory, monthlyLimit: this.budgetLimit})
    }

    mounted(): void {
      this.uid = this.$appAuth.currentUser?.uid ?? "none";
      this.$appDB
        .collection(`users/${this.uid}/categories`)
        .orderBy("name")       // Sort by category name
        .onSnapshot((qs: QuerySnapshot) => {
          this.allCategories.splice(0);  // remove old data
          qs.forEach((qds: QueryDocumentSnapshot) => {
            if (qds.exists) {
              const catData = qds.data();
              this.allCategories.push({
                name: catData.name,
                limit: catData.monthlyLimit,
              });
            }
          });
        });
    }

  }
</script>

<style scoped>
#BudgetCategory {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  align-content: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>