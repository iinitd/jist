<style scoped lang="scss">



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
    cursor:pointer;
  }
  .description {
    color: #5e6d82;
  }
}

.right-side {
  background: #f2f6fc;
  padding: 0;
}

.file-card{
    margin-bottom: 20px;
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

<el-main>
    <el-card class="box-card">
        <div class="clearfix meta">
            <el-button type="plain" size="mini" icon="el-icon-edit" @click="openEdit()" style="float:right"></el-button>
            <a class="title"  @click="openUrl()">{{this.gist.description.title}}</a>
            <div style="margin: 10px 0;" v-if="gist.description.description"></div>
            <a class="description">{{this.gist.description.description}}</a>
            <div style="margin: 10px 0;" v-if="gist.description.tags"></div>
            <div class="tags" v-if="gist.description.tags">
                <template v-for="tag in tagStr">
                    <el-tag type="info" size="mini" style="margin-right:10px">{{tag}}</el-tag>
                </template>
            </div>
            
        </div>
    </el-card>
    <div style="margin: 20px 0;"></div>
    
    <el-card class="file-card">

        <div slot="header">
            <h1>Files</h1>
        </div>

        <el-collapse v-model="activeNames" >
        <template v-for="file in gist.files" v-if="file">

            <el-collapse-item :title="file.filename" :name="file.filename">
                
        <section class="markdown-body" v-html="file.html_content"></section>
  </el-collapse-item>

        </template>
  
</el-collapse>

        

    </el-card>
</el-main>

</template>

<script>
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown.css";


let self;

export default {
  name: "landing-page",
  data() {
    return {
      activeNames: ['1'],
      searchText: "",
      searchType: "content",
      dialogVisible: false,
    };
  },
  created: function() {
        self = this;
    },
  computed: {
      tagStr(){
          if(this.gist.description.tags.length){
            return this.gist.description.tags.split(" ")
          }
          
          else return ""
      },
    gist: {
      set(val) {},
      get() {
        this.activeNames = Object.keys(this.$store.state.gists[this.$store.state.currentGist].files)
        return this.$store.state.gists[this.$store.state.currentGist];
      }
    },
    isEdit:{
          set(value) {
                    this.$store.commit("SET_EDIT_MODE", value);
                },
                get() {
                    return this.$store.state.edit_mode
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
    openUrl() {
        let link = this.gist.html_url.toString()
      this.$electron.shell.openExternal(link);
    },
    openEdit() {
        console.log(self.isEdit)
      self.isEdit = true
      self.isUpdate = true
    },
    closeEdit() {
      self.isEdit = false;
      self.refreshFiles();
    }

  }
};
</script>
