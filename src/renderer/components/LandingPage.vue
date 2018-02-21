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
    .left-side{
      background: #dcdfe6;

      i{
        margin-right: 10px;
        
      }

    }
    .right-side {
        background: #dcdfe6;
        display: flex;
        align-items: center;
        flex-direction: row;
        img {
            margin-left: 10px;
            box-sizing: border-box;
            height:30px;
            border-radius:15px;
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

// ::-webkit-scrollbar {
//     display: none
// }

</style>

<template>

<el-container class="wrapper">
    <el-header class="top-header unselectable" style="-webkit-app-region: drag;" height="60px">
        <div class="left-side">
            <i class="el-icon-error" @click="windows('close')"></i>
            <i class="el-icon-remove" @click="windows('min')"></i>
        </div>
        <!--
        <div class="unselectable" style="cursor: pointer;">Pad</div> -->

        <div class="right-side">
            <el-dialog title="用户中心" :visible.sync="dialogVisible" width="30%" center>
                <LoginPanel/>
            </el-dialog>
            <el-button type="plain" @click="dialogVisible = true" size="small" icon="el-icon-menu" round></el-button>
            <el-button type="plain" size="small" icon="el-icon-edit-outline" @click="newFile()" round></el-button>
        </div>
    </el-header>

    <el-container>
        <el-aside class="left-side unselectable">
            <Menu/>
        </el-aside>

        <el-main class="right-side">
            
                <el-container class="edit-panel" v-if="isEdit">
                    <EditPanel/>
                </el-container>
                <el-container v-else>
                  <template v-if="currentGistIdx!==-1">
                    <PreviewPanel/>
                     </template>
                    <template v-else>
                <WelcomePanel/>
            </template>
                </el-container>

           
            

        </el-main>
    </el-container>
</el-container>

</template>

<script>

import EditPanel from './EditPanel.vue';
import PreviewPanel from './PreviewPanel';
import WelcomePanel from './WelcomePanel';
import LoginPanel from './LoginPanel';
import Menu from './Menu'


let self;

export default {
    name: "landing-page",
    data() {
        return {
            files: [],
            //gists: [],
            loading:true,
            currentFile: {},
            currentMeta: "",
            currentFiles: {},
            searchText: "",
            searchType: "content",
            isShowLeftLeft: false,
            dialogVisible: false,
            tagStr: "",
            isShowArchive: true
        };
    },

    created: async function() {
        self = this;
        if(self.isAuthenticated&&Object.keys(self.gists).length==0){
            console.log("getting gists")
            this.$store.dispatch('getGist')
        }
    },
    components: {
        LoginPanel,
        Menu,
        EditPanel,
        PreviewPanel,
        WelcomePanel
    },
    computed: {

      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },

    currentGistIdx(){
      return this.$store.state.currentGist
    },
        isEdit:{
          set(value) {
                    this.$store.commit("SET_EDIT_MODE", value);
                },
                get() {
                    return this.$store.state.edit_mode==true
                }
        },
        isUpdate:{
          set(value) {
                    this.$store.commit("SET_UPDATE_MODE", value);
                },
                get() {
                    return this.$store.state.update_mode==true
                }
        }
    },
    methods: {

            openExternal(link) {
                this.$electron.shell.openExternal(link);
            },
            openEdit() {
                self.isEdit = true;
            },

            windows(type) {
                ipc.send(type);
            },


            newFile() {
              self.isEdit = true
              self.isUpdate = false
      }
    }
};

</script>
