<style scoped lang="scss">
.wrapper {
  background: #f2f6fc;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-size: 1em;
}

// ::-webkit-scrollbar {
//   width: 8px;
//   height: 8px;
//   background: #f2f4f6;
// }
// ::-webkit-scrollbar-thumb {
//   background: #333;
//   border-radius: 4px;
// }
#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

.top-header {
  height: 30px;
  background: #dcdfe6;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .left-side,
  .right-side {
    background: #dcdfe6;
    display: flex;
    align-items: center;
    flex-direction: row;
    i {
      margin-right: 10px;
    }
  }
}

.left-left-side {
  height: 100vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex-basis: 30%;
  transition: visibility 2s, opacity 0.5s linear;
}

.search-input {
  padding: 20px;
  padding-bottom: 0;
  .sync-time{
      font-size:12px;
      color:#ccc;
      padding-top: 10px;
  }
}

.file-list {
  background: #fff;
  border: 0;
}

.meta {
  border-bottom: 0px solid #dcdfe6;
  .title {
    font-size: 26px;
    font-weight: 400;
    display: flex;
    align-items: center;
  }
  .description {
    color: #5e6d82;
  }
}

.right-side {
  background: #f2f6fc;
  padding: 0;
}

.archive {
  color: #c0c4cc;
  font-size: 12px;
  display: inline-block;
  margin-right: 10px;
}

.left-side {
  opacity: 0.3;
  background: #fff;
  transition: opacity 0.15s ease-in-out;
  &:hover {
    opacity: 1;
  }
}

.markdown-body {
  font-size: 12px;
  letter-spacing: 1px;
  color: #606266;
}

.file-list-item {
  height: 40px;
  line-height: 40px;
  font-weight: 400;
  font-size: 13px;
}

</style>

<template>

        <div class="left-side unselectable">
            <div class="search-input">
                <el-input placeholder="Search" v-model="searchText" class="input-with-select" clearable>
                <div slot="append">
                    <el-button v-if="isAuthenticated" :title="syncTime" icon="el-icon-upload" @click="getGists"></el-button>
                    <el-button v-else title="Please login" icon="el-icon-upload" disabled></el-button>
                </div>
                
                </el-input>
                <template v-if="isAuthenticated">
                <div v-if="ifNetworkError" class="sync-time">Sync Error! Please try later.</div>
                <div v-else class="sync-time">Last sync - {{this.syncTime}}</div>
                </template>
            </div>

            <el-menu class="file-list" text-color="#606266">
                <el-menu-item-group>
                    <template v-for="gist in filtered_gists">
                        <el-menu-item :index="gist.id" @click="openFile(gist.id)" class="unselectable file-list-item">
                            {{gist.description.title}}
                        </el-menu-item>
                    </template>
                </el-menu-item-group>
            </el-menu>
        </div>

</template>

<script>

import moment from 'moment'

let self;

let searchFileter = (gists, text, type) => {
  if (self.searchType == "content") {
        return Object.keys(self.gists)
          .filter(key => {
            let searchRange = JSON.stringify(self.gists[key].files) + JSON.stringify(self.gists[key].description)
            return (
              searchRange.indexOf(self.searchText) > -1
            );
          })
          .map(key => self.gists[key]);
      }

      if (self.searchType == "tag") {
        // later
      }
};

export default {
  name: "landing-page",
  data() {
    return {
      searchText: "",
      searchType: "content",
    };
  },

  created: function() {
    self = this;
//     if (self.$store.getters.isAuthenticated) {
//       self.$store.dispatch("getGist").then((res)=>{
//       self.$forceUpdate();
//     })
//   }
  },
  components: {
    
  },
  computed: {
      filtered_gists:{
          set(val){
          },
          get(){
            return searchFileter(self.gists,self.searchText,self.searchType)
          }
      },
    gists: {
      set(value) {
        this.$store.commit("SET_GISTS", value);
      },
      get() {
        return this.$store.state.gists;
      }
    },
    syncTime(){
        
        return moment(this.$store.state.sync_time).fromNow().toString();
    },
    ifNetworkError(){
        
        return this.$store.state.connection_error;
    },
    isEdit: {
      set(value) {
        this.$store.commit("SET_EDIT_MODE", value);
      },
      get() {
        return this.$store.state.edit_mode;
      }
    },
    isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      }
  },
  watch: {

  },
  methods: {
async getGists(){

     if(self.isAuthenticated){
            await self.$store.commit("SET_CURRENTGIST", -1);
            let res = await self.$store.dispatch("syncToGithub")
            if(res){
                self.$forceUpdate();
            }
            
        }

},
    openFile(gistid) {
      self.isEdit = false;
      self.$store.dispatch("setCurrentGist", gistid)
    }
  }
};
</script>
