<style scoped lang="scss">

.files-card-header{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}


</style>

<template>

<el-main class="edit-panel">
    <el-card>
        <div slot="header" class="clearfix" style="display:flex;justify-content:space-between">
            <div>
                <el-button type="plain" size="small" icon="el-icon-back" @click="closeEdit()">Back</el-button>
            </div>
            <div>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteDialogVisible=true" v-if="isUpdate">Delete</el-button>
                <el-button v-if="isUpdate" type="success" size="small" icon="el-icon-check" @click="comfirmUpdate()">Update</el-button>
                <el-button v-else type="success" size="small" icon="el-icon-check" @click="comfirmSubmit()">Submit</el-button>

                <el-dialog
  title="提示"
  :visible.sync="deleteDialogVisible"
  width="30%">
  <span>Are you sure?</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogVisible = false">Cancel</el-button>
    <el-button type="danger" @click="deleteFile(gist.id)">Comfirm</el-button>
  </span>
</el-dialog>

            </div>
        </div>
        <el-input placeholder="optional" v-model="gist.description.title">
            <template slot="prepend">
                Title
            </template>
        </el-input>
        <div style="margin: 10px 0;"></div>
        <el-input placeholder="optional" v-model="gist.description.description">
            <template slot="prepend">
                Description
            </template>
        </el-input>
        <div style="margin: 10px 0;"></div>
        <el-input placeholder="separate tags with a space" v-model="gist.description.tags">
            <template slot="prepend">
                Tags
            </template>
        </el-input>

    </el-card>
                    
    <el-card class="box-card">

        <div slot="header" class="files-card-header">
            <h1>Files</h1>
            <el-button type="plain" size="small" @click="addFile()">Add new file</el-button>
        </div>

        <el-collapse v-model="activeNames">
        <template v-for="file in gist.files" v-if="file">

            <el-collapse-item :title="file.filename" :name="file.filename">

                <el-input placeholder="Please enter" v-model="file.filename">
            <template slot="prepend">
                Title
            </template>
        </el-input>
        <div style="margin: 10px 0;"></div>
                
        <el-input type="textarea" :rows="15" placeholder="Clear the content to delete the file" v-model="file.raw_content">
        </el-input>
  </el-collapse-item>

        </template>
  
</el-collapse>
        
    </el-card>
</el-main>



</template>

<script>
const { ipcRenderer: ipc } = require("electron");

let self;

export default {
  name: "landing-page",
  data() {
    return {
      files: [],
      activeNames: [],
      gist: {
            files: {},
            description: {
                title:"",
                tags:"",
                description:""
            }
          },
      currentFile: {},
      currentMeta: "",
      currentFiles: {},
      searchText: "",
      searchType: "content",
      isShowLeftLeft: false,
      dialogVisible: false,
      tagStr: "",
      isShowArchive: true,
      deleteDialogVisible: false
    };
  },

  components: {},
  created: function() {
    self = this;
  },
  computed: {
    isEdit: {
      set(value) {
        this.$store.commit("SET_EDIT_MODE", value);
      },
      get() {
        return this.$store.state.edit_mode;
      }
    },
    isUpdate: {
      set(value) {
        this.$store.commit("SET_UPDATE_MODE", value);
      },
      get() {
        if (this.$store.state.update_mode) {
          this.gist = JSON.parse(
            JSON.stringify(
              self.$store.state.gists[self.$store.state.currentGist]
            )
          );
        }
        return this.$store.state.update_mode == true;
      }
    }
  },
  methods: {
    addFile() {
      let timestamp = new Date().getTime();
      let temp_filename = "@new-" + timestamp;
      self.gist.files[temp_filename] = {
        filename: "" + timestamp,
        raw_content: ""
      };
      //self.$forceUpdate();
      self.activeNames.push("" + timestamp);
    },

    openEdit() {
      self.isEdit = true;
      self.isUpdate = true;
    },
    
    closeEdit() {
      self.isEdit = false;
    },

    async deleteFile(id) {
        self.deleteDialogVisible = false;
        self.isEdit = false;
        await self.$store.dispatch("deleteLocalGist",id)
    },
 
    async comfirmUpdate() {
      await self.$store.dispatch("patchLocalGist",self.gist)  
      self.closeEdit()
    },
    async comfirmSubmit() {

    await self.$store.dispatch("postLocalGist",self.gist)  
    await self.closeEdit()


    }
  }
};
</script>
