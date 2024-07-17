<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="处理人id" prop="handlerId">
        <el-input
          v-model="queryParams.handlerId"
          placeholder="请输入处理人id"
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
          v-hasPermi="['complaint:handlingresults:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['complaint:handlingresults:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['complaint:handlingresults:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['complaint:handlingresults:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="handlingresultsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="处理结果id" align="center" prop="id" />
      <el-table-column label="投诉id" align="center" prop="complaintId" />
      <el-table-column label="内容" align="center" prop="result" />
      <el-table-column label="处理时间" align="center" prop="handleTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.handleTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工号" align="center" prop="handlerId" />
      <el-table-column label="图片" align="center" prop="picUrl" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.picUrl" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['complaint:handlingresults:edit']">处理</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['complaint:handlingresults:remove']">删除</el-button>
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

    <!-- 添加或修改投诉处理结果对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="handlingresultsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="投诉id" prop="complaintId">
          <el-input v-model="form.complaintId" placeholder="请输入投诉id" />
        </el-form-item>
        <el-form-item label="内容" prop="result">
          <el-input v-model="form.result" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="处理时间" prop="handleTime">
          <el-date-picker clearable
            v-model="form.handleTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择处理时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工号" prop="handlerId">
          <el-input v-model="form.handlerId" placeholder="请输入处理人id" />
        </el-form-item>
        <el-form-item label="图片" prop="picUrl">
          <image-upload v-model="form.picUrl"/>
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

<script setup name="Handlingresults">
import { listHandlingresults, getHandlingresults, delHandlingresults, addHandlingresults, updateHandlingresults } from "@/api/complaint/handlingresults";

const { proxy } = getCurrentInstance();

const handlingresultsList = ref([]);
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
    result: null,
    handlerId: null,
  },
  rules: {
    complaintId: [
      { required: true, message: "投诉id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询投诉处理结果列表 */
function getList() {
  loading.value = true;
  listHandlingresults(queryParams.value).then(response => {
    handlingresultsList.value = response.rows;
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
    complaintId: null,
    result: null,
    handleTime: null,
    handlerId: null,
    picUrl: null
  };
  proxy.resetForm("handlingresultsRef");
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
  title.value = "添加投诉处理结果";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getHandlingresults(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改投诉处理结果";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["handlingresultsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateHandlingresults(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addHandlingresults(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除投诉处理结果编号为"' + _ids + '"的数据项？').then(function() {
    return delHandlingresults(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('complaint/handlingresults/export', {
    ...queryParams.value
  }, `handlingresults_${new Date().getTime()}.xlsx`)
}

getList();
</script>
