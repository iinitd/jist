<style scoped lang="scss">



.setting-list {
  list-style: none;
  li{
      padding:10px 20px;
    //   border-bottom:1px solid #dcdfe6;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
  }
  li:first-child{
    //   border-top:1px solid #dcdfe6;
  }
  li.login{

  }
}

</style>

<template>
<div>
    <ul class="setting-list">
        <li>
            <Login/>
        </li>
        <li>
            <div style="color:#909399;font-size:12px;">
        <el-button type="text" @click="openExternal('https://github.com/cogons')" round size="mini">github</el-button>
    </div>
        </li>
    </ul>
     
    <div style="margin: 20px 0;"></div>
    
</div>
 
</template>


<script>
import Login from "./Login.vue";

let self;

export default {
  name: "setting-panel",
  data() {
    return {
    };
  },

  created: function() {
    self = this;
  },
  components: {
    Login
  },
  computed: {
    gist: {
      set(val) {},
      get() {
        return this.$store.state.gists[this.$store.state.currentGist];
      }
    }
  },

  methods: {
      
    openExternal(link) {
      this.$electron.shell.openExternal(link);
    }
  }
};
</script>
