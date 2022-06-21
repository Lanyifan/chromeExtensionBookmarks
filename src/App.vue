<template>
  <div id="app">
    <!-- command button -->
    <el-row>
      <el-col class="margin-bottom-15 margin-top-15 left">
        <el-button type="primary" @click="openCheckedNodes">打开选中标签</el-button>
      </el-col>
    </el-row>
    <!-- search input -->
    <el-row>
      <el-col class="margin-bottom-15">
        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" clearable v-model="search">
        </el-input>
      </el-col>
    </el-row>
    <!-- Bookmarks Tree -->
    <el-row class="margin-bottom-50">
      <el-col class="treeNodeHeight">
        <el-tree class="treeNode" :data="treeData" highlight-current show-checkbox draggable node-key="id"
          :props="defaultProps" :default-expanded-keys="defaultExpandedKeys" :render-content="customContent"
          :filter-node-method="filterNode" ref="tree"></el-tree>
        <div class="bottomDiv"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import bookmarks from "../public/js/content";

export default {
  name: "App",
  components: {
    // HelloWorld
  },
  data() {
    return {
      // isExpandAll: false,
      search: "",
      defaultExpandedKeys: ["1"],
      treeData: [],
      defaultProps: {
        label: "title",
        children: "children",
      },
    };
  },
  watch: {
    search(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    var that = this;
    bookmarks().then(function (res) {
      // console.log(res);
      that.treeData = res[0].children;
    });

    // console.log(that.treeData);
  },
  methods: {
    expandAll() {
      if (this.isExpandAll === false) {
        this.isExpandAll = true;
      } else {
        this.isExpandAll = false;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    customContent(h, { node, data, stored }) {
      // console.log(data);
      var isDir = data.url === undefined;
      var result = (
        <span>
          <i class="el-icon-folder" id="dirI"></i>
          {data.title}
        </span>
      );
      if (!isDir) {
        result = (
          <el-tooltip
            effect="dark"
            content={data.url.substring(0, 50)}
            placement="right-end"
          >
            <el-link href={data.url} type="primary" target="_blank">
              {data.title}
            </el-link>
          </el-tooltip>
        );
      }
      return result;
    },
    openCheckedNodes() {
      var nodes = this.$refs.tree.getCheckedNodes();
      if (nodes.length > 20) {
        this.$confirm('标签数大于20个，确认要打开？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          nodes.forEach(d => {
            chrome.tabs.create({ url: d.url })
          });
        })
      } else {
        nodes.forEach(d => {
          chrome.tabs.create({ url: d.url })
        });
      }
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 500px;
  margin: 0 auto;
  height: 580px;
  overflow: hidden;
}

#dirI {
  margin-right: 10px;
}

.treeNode {
  font-size: 16px;
}

.margin-bottom-15 {
  margin-bottom: 15px;
}

.margin-bottom-50 {
  margin-bottom: 50px;
}

.margin-top-15 {
  margin-top: 15px;
}

.left {
  text-align: left;
}

.treeNodeHeight {
  height: 580px;
  overflow: scroll;
}

.bottomDiv {
  height: 150px;
}
</style>
