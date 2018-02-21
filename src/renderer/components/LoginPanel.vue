<template>

<div  class="login">
  <template v-if="isAuthenticated">


    <el-button @click="openExternal('https://github.com/cogons')" type="text" style="color:#000" round >{{this.username}}</el-button>
    <div>Your gists: {{Object.keys(this.$store.state.gists).length}}</div>
    <img class="avatar" :src="$store.getters.avatarUrl">
    <el-button type="plain" round class='pull' @click="getGist">Pull From Github (discard local changes)</el-button>
    <div></div>
    <el-button type="plain" round class='logout' @click="logout">Logout</el-button>

  </template>

  <template v-else>

    <el-button  type="primary" round @click="login" v-if="!authorizing">Github Login</el-button>
    <el-button  type="primary" icon="el-icon-loading" round v-else>Login...</el-button>
  
  </template>

  <span slot="footer" class="dialog-footer">
    <el-button @click="openExternal('https://github.com/cogons')" type="text" style="color:#aaa;font-size:12px;letter-spacing:1.2px;" round >Jist OpenSource Project</el-button>
  </span>

    

</div>
</div>
  
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        authorizing: false
      };
    },
    computed: {
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
      username() {
        return this.$store.getters.username;
      }
    },
    methods: {
      login() {
        this.authorizing = true;
        this.$store.dispatch('getToken').then(res => {
          this.$store.getters.onAuthenticated.then(this.onSuccess);
        }, err => {
          console.log('Error while getting token', err);
        });
      },
      logout() {
      this.$store.dispatch('logout').then(() => {});
      },
      getGist(){

        this.$store.dispatch('getGist').then(res => {
          console.log(res)
        }, err => {
          console.log('Error while getting token', err);
        });

      },

      onSuccess() {
        console.log(this.$store)
        console.log(this.$store.getters.accessToken)
        this.authorizing = false;
        
      },
      openExternal(link) {
      this.$electron.shell.openExternal(link);
    }
    }
  }
</script>

<style lang="scss" scoped>
  .login {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    div,img{
      margin-bottom: 20px;
    }

    img{
      width:80px;
      border-radius: 20px;
    }

    .authorizing {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    } 
    .dialog-footer{
      margin-top:20px;
    }
  }
  
</style>
