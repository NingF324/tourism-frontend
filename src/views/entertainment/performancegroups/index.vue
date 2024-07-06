<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="团体名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入团体名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker clearable
          v-model="queryParams.startTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="演出场地" prop="venue">
        <el-input
          v-model="queryParams.venue"
          placeholder="请输入演出场地"
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
          v-hasPermi="['entertainment:performancegroups:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['entertainment:performancegroups:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['entertainment:performancegroups:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['entertainment:performancegroups:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="performancegroupsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="演出团体id" align="center" prop="id" />
      <el-table-column label="团体名称" align="center" prop="name" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="演出单场时长" align="center" prop="duration" />
      <el-table-column label="演出场地" align="center" prop="venue" />
      <el-table-column label="容量" align="center" prop="capacity" />
      <el-table-column label="票价" align="center" prop="price" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['entertainment:performancegroups:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['entertainment:performancegroups:remove']">删除</el-button>
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

    <!-- 添加或修改演出团体信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="performancegroupsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="团体名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入团体名称" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="form.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="演出单场时长" prop="duration">
          <el-input v-model="form.duration" placeholder="请输入演出单场时长" />
        </el-form-item>
        <el-form-item label="演出场地" prop="venue">
          <el-input v-model="form.venue" placeholder="请输入演出场地" />
        </el-form-item>
        <el-form-item label="容量" prop="capacity">
          <el-input v-model="form.capacity" placeholder="请输入容量" />
        </el-form-item>
        <el-form-item label="票价" prop="price">
          <el-input v-model="form.price" placeholder="请输入票价" />
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

<script setup name="Performancegroups">
import { listPerformancegroups, getPerformancegroups, delPerformancegroups, addPerformancegroups, updatePerformancegroups } from "@/api/entertainment/performancegroups";

const { proxy } = getCurrentInstance();

const performancegroupsList = ref([]);
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
    name: null,
    startTime: null,
    venue: null,
  },
  rules: {
    name: [
      { required: true, message: "团体名称不能为空", trigger: "blur" }
    ],
    startTime: [
      { required: true, message: "开始时间不能为空", trigger: "blur" }
    ],
    duration: [
      { required: true, message: "演出单场时长不能为空", trigger: "blur" }
    ],
    venue: [
      { required: true, message: "演出场地不能为空", trigger: "blur" }
    ],
    capacity: [
      { required: true, message: "容量不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "票价不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询演出团体信息列表 */
function getList() {
  loading.value = true;
  listPerformancegroups(queryParams.value).then(response => {
    performancegroupsList.value = response.rows;
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
    name: null,
    startTime: null,
    duration: null,
    venue: null,
    capacity: null,
    price: null
  };
  proxy.resetForm("performancegroupsRef");
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
  title.value = "添加演出团体信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPerformancegroups(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改演出团体信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["performancegroupsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePerformancegroups(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPerformancegroups(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除演出团体信息编号为"' + _ids + '"的数据项？').then(function() {
    return delPerformancegroups(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('entertainment/performancegroups/export', {
    ...queryParams.value
  }, `performancegroups_${new Date().getTime()}.xlsx`)
}

getList();
</script>
