<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="城市" prop="city">
        <el-input
          v-model="queryParams.city"
          placeholder="请输入城市"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="景区名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入景区名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['scenic:scenicareas:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['scenic:scenicareas:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['scenic:scenicareas:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['scenic:scenicareas:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="scenicareasList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="景区id" align="center" prop="id" />
      <el-table-column label="城市" align="center" prop="city" />
      <el-table-column label="景区名称" align="center" prop="name" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="图片" align="center" prop="picUrl" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.picUrl" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="评分" align="center" prop="score" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['scenic:scenicareas:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['scenic:scenicareas:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改景区信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="scenicareasRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="景区名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入景区名称" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="图片" prop="picUrl">
          <image-upload v-model="form.picUrl"/>
        </el-form-item>
        <el-form-item label="评分" prop="score">
          <el-input v-model="form.score" placeholder="请输入评分" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Scenicareas">
import { listScenicareas, getScenicareas, delScenicareas, addScenicareas, updateScenicareas } from "@/api/scenic/scenicareas";

const { proxy } = getCurrentInstance();

const scenicareasList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    city: null,
    name: null,
    address: null,
  },
  rules: {
    city: [
      { required: true, message: "城市不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "景区名称不能为空", trigger: "blur" }
    ],
    address: [
      { required: true, message: "地址不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询景区信息列表 */
function getList() {
  loading.value = true;
  listScenicareas(queryParams.value).then(response => {
    scenicareasList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    city: null,
    name: null,
    address: null,
    picUrl: null,
    score: null,
    description: null
  };
  proxy.resetForm("scenicareasRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加景区信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getScenicareas(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改景区信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["scenicareasRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateScenicareas(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addScenicareas(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除景区信息编号为"' + _ids + '"的数据项？').then(function() {
    return delScenicareas(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('scenic/scenicareas/export', {
    ...queryParams.value
  }, `scenicareas_${new Date().getTime()}.xlsx`)
}

getList();
</script>
