<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="酒店id" prop="hotelId">
        <el-input
          v-model="queryParams.hotelId"
          placeholder="请输入酒店id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户id" prop="guestName">
        <el-input
          v-model="queryParams.guestName"
          placeholder="请输入用户id"
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
          v-hasPermi="['hotel:nonstarbookings:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hotel:nonstarbookings:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hotel:nonstarbookings:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['hotel:nonstarbookings:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="nonstarbookingsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="非星级酒店预定id" align="center" prop="id" />
      <el-table-column label="酒店id" align="center" prop="hotelId" />
      <el-table-column label="房型id" align="center" prop="roomTypeId" />
      <el-table-column label="用户id" align="center" prop="guestName" />
      <el-table-column label="联系电话" align="center" prop="contactNumber" />
      <el-table-column label="是否已确认" align="center" prop="recorded" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['hotel:nonstarbookings:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['hotel:nonstarbookings:remove']">删除</el-button>
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

    <!-- 添加或修改非星级酒店预定信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="nonstarbookingsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="酒店id" prop="hotelId">
          <el-input v-model="form.hotelId" placeholder="请输入酒店id" />
        </el-form-item>
        <el-form-item label="房型id" prop="roomTypeId">
          <el-input v-model="form.roomTypeId" placeholder="请输入房型id" />
        </el-form-item>
        <el-form-item label="用户id" prop="guestName">
          <el-input v-model="form.guestName" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactNumber">
          <el-input v-model="form.contactNumber" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="是否已确认" prop="recorded">
          <el-input v-model="form.recorded" placeholder="请输入是否已确认" />
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

<script setup name="Nonstarbookings">
import { listNonstarbookings, getNonstarbookings, delNonstarbookings, addNonstarbookings, updateNonstarbookings } from "@/api/hotel/nonstarbookings";

const { proxy } = getCurrentInstance();

const nonstarbookingsList = ref([]);
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
    hotelId: null,
    guestName: null,
  },
  rules: {
    hotelId: [
      { required: true, message: "酒店id不能为空", trigger: "blur" }
    ],
    roomTypeId: [
      { required: true, message: "房型id不能为空", trigger: "blur" }
    ],
    guestName: [
      { required: true, message: "用户id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询非星级酒店预定信息列表 */
function getList() {
  loading.value = true;
  listNonstarbookings(queryParams.value).then(response => {
    nonstarbookingsList.value = response.rows;
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
    hotelId: null,
    roomTypeId: null,
    guestName: null,
    contactNumber: null,
    recorded: null
  };
  proxy.resetForm("nonstarbookingsRef");
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
  title.value = "添加非星级酒店预定信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getNonstarbookings(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改非星级酒店预定信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["nonstarbookingsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateNonstarbookings(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addNonstarbookings(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除非星级酒店预定信息编号为"' + _ids + '"的数据项？').then(function() {
    return delNonstarbookings(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('hotel/nonstarbookings/export', {
    ...queryParams.value
  }, `nonstarbookings_${new Date().getTime()}.xlsx`)
}

getList();
</script>
