<template>
  <div id="AppLogin">

    <div>Email
    <input type="text" v-model="userEmail">
    </div>
    
    <div>Password
    <input type="password" v-model.number="userPassword">
    </div>

    <br>
    <button v-on:click="createAccount" :disabled="noInput">Sign Up</button>
    <button v-on:click="authenticate" :disabled="noInput">Sign In</button>
    <br>

    <div>{{ message }}</div>

  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { FirebaseFirestore, QuerySnapshot, QueryDocumentSnapshot } from "@firebase/firestore-types";
  import { FirebaseAuth, UserCredential } from "@firebase/auth-types"

  @Component
  export default class AppLogin extends Vue {
    readonly $appDB!: FirebaseFirestore;
    readonly $appAuth!: FirebaseAuth;
    private uid = "none";
    private userEmail = "";
    private userPassword = "";
    private message = "";
    private allCategories: any[] = [];

    get noInput(): boolean {
        return this.userEmail.length === 0 || this.userPassword.length === 0;
    }
    
    showMessage(m: string): void {
        this.message = m;
        setTimeout(() => {    // Auto disappear after 5 seconds
            this.message = "";
        }, 5000);
    }

    createAccount(): void {
    this.$appAuth
        .createUserWithEmailAndPassword(this.userEmail, this.userPassword)
        .then((u: UserCredential) => {
        this.showMessage(`User create UID ${u.user?.uid}`);
        })
        .catch((err: any) => {
        this.showMessage(`Unable to create account ${err}`);
        });    
    }

    authenticate(): void {
    this.$appAuth
        .signInWithEmailAndPassword(this.userEmail, this.userPassword)
        .then((u: UserCredential) => {
        this.showMessage(`Login successful UID ${u.user?.uid}`);
        })
        .catch((err: any) => {
        this.showMessage(`Unable to login ${err}`);
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