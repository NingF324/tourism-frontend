<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="提交时间" prop="submitTime">
        <el-date-picker clearable
          v-model="queryParams.submitTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择提交时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="投诉人id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入投诉人id"
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
          v-hasPermi="['complaint:complaints:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['complaint:complaints:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['complaint:complaints:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['complaint:complaints:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="complaintsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="投诉id" align="center" prop="id" />
      <el-table-column label="内容" align="center" prop="content" />
      <el-table-column label="提交时间" align="center" prop="submitTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.submitTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="0为待审批，1为已经审批待处理，2为已处理待确认，3为已经结案" align="center" prop="status" />
      <el-table-column label="结果" align="center" prop="result" />
      <el-table-column label="处理时间" align="center" prop="handleTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.handleTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投诉人id" align="center" prop="userId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['complaint:complaints:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['complaint:complaints:remove']">删除</el-button>
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

    <!-- 添加或修改投诉信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="complaintsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="提交时间" prop="submitTime">
          <el-date-picker clearable
            v-model="form.submitTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择提交时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结果" prop="result">
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
        <el-form-item label="投诉人id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入投诉人id" />
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

<script setup name="Complaints">
import { listComplaints, getComplaints, delComplaints, addComplaints, updateComplaints } from "@/api/complaint/complaints";

const { proxy } = getCurrentInstance();

const complaintsList = ref([]);
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
    content: null,
    submitTime: null,
    status: null,
    userId: null
  },
  rules: {
    content: [
      { required: true, message: "内容不能为空", trigger: "blur" }
    ],
    submitTime: [
      { required: true, message: "提交时间不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "0为待审批，1为已经审批待处理，2为已处理待确认，3为已经结案不能为空", trigger: "change" }
    ],
    result: [
      { required: true, message: "结果不能为空", trigger: "blur" }
    ],
    handleTime: [
      { required: true, message: "处理时间不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "投诉人id不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询投诉信息列表 */
function getList() {
  loading.value = true;
  listComplaints(queryParams.value).then(response => {
    complaintsList.value = response.rows;
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
    content: null,
    submitTime: null,
    status: null,
    result: null,
    handleTime: null,
    userId: null
  };
  proxy.resetForm("complaintsRef");
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
  title.value = "添加投诉信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getComplaints(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改投诉信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["complaintsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateComplaints(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addComplaints(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除投诉信息编号为"' + _ids + '"的数据项？').then(function() {
    return delComplaints(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('complaint/complaints/export', {
    ...queryParams.value
  }, `complaints_${new Date().getTime()}.xlsx`)
}

getList();
</script>
