<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['emergency:emergencyinfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['emergency:emergencyinfo:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="emergencyinfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="应急信息id" align="center" prop="id" />
      <el-table-column label="优先级" align="center" prop="priority" />
      <el-table-column label="截止日期" align="center" prop="validity" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.validity, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文本内容" align="center" prop="content" />
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <span>{{ scope.row.status === 1 ? '已审批' : '未审批' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['emergency:emergencyinfo:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['emergency:emergencyinfo:remove']">删除</el-button>
          <el-button link type="primary" icon="Edit" @click="confirm(scope.row)" v-hasPermi="['emergency:emergencyinfo:confirm']">确认</el-button>
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

    <!-- 添加或修改应急信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="emergencyinfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="优先级" prop="priority">
          <el-input v-model="form.priority" placeholder="请输入优先级" />
        </el-form-item>
        <el-form-item label="截止日期" prop="validity">
          <el-date-picker clearable
            v-model="form.validity"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择截止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文本内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="form.status" placeholder="请输入状态" />
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

<script setup name="Emergencyinfo">
import { listEmergencyinfo, getEmergencyinfo, delEmergencyinfo, addEmergencyinfo, updateEmergencyinfo, confirmEmergencyinfo } from "@/api/emergency/emergencyinfo";

const { proxy } = getCurrentInstance();

const emergencyinfoList = ref([]);
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
  },
  rules: {
    priority: [
      { required: true, message: "优先级不能为空", trigger: "blur" }
    ],
    validity: [
      { required: true, message: "截止日期不能为空", trigger: "blur" }
    ],
    content: [
      { required: true, message: "文本内容不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询应急信息列表 */
function getList() {
  loading.value = true;
  listEmergencyinfo(queryParams.value).then(response => {
    emergencyinfoList.value = response.rows;
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
    priority: null,
    validity: null,
    content: null,
    status: null
  };
  proxy.resetForm("emergencyinfoRef");
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
  title.value = "添加应急信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getEmergencyinfo(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改应急信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["emergencyinfoRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEmergencyinfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEmergencyinfo(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除应急信息编号为"' + _ids + '"的数据项？').then(function() {
    return delEmergencyinfo(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

function confirm(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认审批通过编号为"' + _ids + '"的应急信息？').then(function() {
    return confirmEmergencyinfo(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("审批成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('emergency/emergencyinfo/export', {
    ...queryParams.value
  }, `emergencyinfo_${new Date().getTime()}.xlsx`)
}

getList();
</script>
