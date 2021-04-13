<template>
  <div id="MyExpense">
    <h3>Enter Your Spending Details</h3>

    <div>
      <div>Amount
      <input type="number" v-model.number="spendingAmount">
      </div>
    
      <div>Date
      <input type="date" v-model="spendingDate">
      </div>

      <div>Where
      <input type="text" v-model="spendingPlace">
      </div>

      <div>Category
      <select v-model="spendingCategory">
          <option v-for="(c,pos) in allCategories" :value="c.name" :key="pos">{{c.name}}</option>
      </select>
      </div>

      <br>
      <button v-on:click="addExpense">Save</button>
      <br>
    </div>

    <div>
      <h3>Expenses</h3>
      <tbody>
        <tr>
          <th> Date </th>
          <th> Category </th>
          <th> Place of Purchase </th>
          <th> Amount </th>
        </tr>
        <tr v-for="(t, pos) in allExpenses" :key="pos">
          <td>{{ t.date }}</td>
          <td>{{ t.category }}</td>
          <td>{{ t.where }}</td>
          <td>{{ t.amount.toFixed(2) }}</td>
        </tr>
      </tbody>
    </div>

    <div>
      <h3>Spending Summary</h3>
      <tbody>
        <tr>
          <th> Category </th>
          <th> Total Spending </th>
          <th> Buget Limit </th>
          <th> Status </th>
        </tr>
        <tr v-for="(t, pos) in expenseByCategory" :key="pos">
          <td>{{ t.category }}</td>
          <td>{{ t.amount.toFixed(2) }}</td>
          <td>{{ t.allocation }}</td>
          <td>{{ t.message }}</td>
        </tr>
      </tbody>
    </div>


    <!-- <ApexChart width="360" type="donut" :options="{
        labels: expenseByCategory.map(forDonut => forDonut.category),
        series: expenseByCategory.map(sweets => sweets.amount) }"></ApexChart> -->
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { FirebaseFirestore, QuerySnapshot, QueryDocumentSnapshot } from "@firebase/firestore-types";
  import { FirebaseAuth } from "@firebase/auth-types"
  import ApexChart from "vue-apexcharts";
  const groupedTotal = new Map<string,number>()

  @Component({components: {ApexChart}})
  export default class MyExpense extends Vue {
    readonly $appDB!: FirebaseFirestore;
    readonly $appAuth!: FirebaseAuth;
    private uid = "none";
    private spendingAmount = 0;
    private spendingDate = "";
    private spendingCategory = "";
    private spendingPlace = "";
    private allCategories: any[] = [];
    private allExpenses: any[] = [];
    private expenseByCategory: any[] = [];

    addExpense(): void {
    this.$appDB
        .collection(`users/${this.uid}/expenses`)
        .add({      
        amount: this.spendingAmount,
        date: this.spendingDate,
        category: this.spendingCategory,
        where: this.spendingPlace
        })
    }

    mounted(): void {
      console.log("This appDB", this.$appDB)
      this.$appDB
        .collection(`users/${this.uid}/categories`)
        .orderBy("name")       // Sort by category name
        .onSnapshot((qs: QuerySnapshot) => {
          this.allExpenses.splice(0);  // remove old data
          qs.forEach((qds: QueryDocumentSnapshot) => {
          //BROKEN!!!
            if (qds.exists) {
              const catData = qds.data();
              // console.log("catData",catData)
              this.allExpenses.push({
                amount: this.spendingAmount,
                date: this.spendingDate,
                category: this.spendingCategory,
                where: this.spendingPlace
              });
            }
          });
          // console.log("foreach", this.allExpenses)
        });

      this.$appDB
        .collection(`users/${this.uid}/expenses`)
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
          console.log("all expenses", this.allExpenses);
          this.allExpenses.forEach((ex: any) => {
              const { category, amount } = ex;
              console.log("ex:",ex)
              if (groupedTotal.has(category)) {
              // This category has been recorded earlier, get the old total
              const oldTotal = groupedTotal.get(category) as number;
              groupedTotal.set(category, oldTotal + amount);
              } else {
              // This is a new category
              groupedTotal.set(category, amount);
              }
          });

          this.expenseByCategory.splice(0);  // remove old data

          groupedTotal.forEach((spTotal: number, spCat: string) => {
              // locate the this category within the `allCategories` array
              const pos = this.allCategories.findIndex((d: any) => d.name === spCat);
              if (pos >= 0 ){
                this.expenseByCategory.push({
                    category: spCat,
                    amount: spTotal,
                    limit: this.allCategories[pos].monthlyLimit,
                });
              }
          });

          console.log("expenseby cat", this.expenseByCategory)
          console.log("grouped total", groupedTotal)
        });


        // this.allExpenses.forEach((ex: any) => {
        //     const { category, amount } = ex;
        //     if (groupedTotal.has(category)) {
        //     // This category has been recorded earlier, get the old total
        //     const oldTotal = groupedTotal.get(category) as number;
        //     groupedTotal.set(category, oldTotal + amount);
        //     } else {
        //     // This is a new category
        //     groupedTotal.set(category, amount);
        //     }
        // });

        // this.expenseByCategory.splice(0);  // remove old data

        // groupedTotal.forEach((spTotal: number, spCat: string) => {
        //     // locate the this category within the `allCategories` array
        //     const pos = this.allCategories.findIndex((d: any) => d.name === spCat);
        //     this.expenseByCategory.push({
        //         category: spCat,
        //         amount: spTotal,
        //         limit: this.allCategories[pos].limit,
        //     });
        // });
        console.log("expenseby cat", this.expenseByCategory)
        console.log("grouped total", groupedTotal)
    }

  }
</script>

<style scoped>
#MyExpense {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  align-content: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>