
<style scoped lang="scss">

.wrapper{
    width:100%;
    height: 100%;
    margin-top: 40vh;
    text-align: center;
    
    
    .content{

        opacity: 0.2;
    font-size:12px;
    color:#303133;
    display: inline-block;
    letter-spacing: 1.5px;
    h1{
        font-size:16px;
        line-height: 30px;
    }

    }
    .content:hover{
        opacity: 0.4;
        cursor:pointer;
    }
}
</style>

<template>

    <div class="wrapper" >
        <div class="content" @click="openExternal('https://github.com/cogons/jist')">
        <h1>Stay Hungry, Stay Foolish.</h1>
        </div>
    </div>
</template>


<script>


let self;

export default {
    name: "welcome-page",
    data() {
        return {

            
            
        };
    },

    created: async function() {
        self = this;
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
