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
      <el-form-item label="房型id" prop="roomTypeId">
        <el-input
          v-model="queryParams.roomTypeId"
          placeholder="请输入房型id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预约人id" prop="guestId">
        <el-input
          v-model="queryParams.guestId"
          placeholder="请输入预约人id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否确认" prop="recorded">
        <el-input
          v-model="queryParams.recorded"
          placeholder="请输入是否确认"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="住客姓名" prop="guestName">
        <el-input
          v-model="queryParams.guestName"
          placeholder="请输入住客姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="starbookingsListView" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="星级酒店预定id" align="center" prop="id" />
      <el-table-column label="酒店id" align="center" prop="hotelId" />
      <el-table-column label="房型id" align="center" prop="roomTypeId" />
      <el-table-column label="预约人id" align="center" prop="guestId" />
      <el-table-column label="联系方式" align="center" prop="contactNumber" />
      <el-table-column label="是否确认" align="center">
        <template #default="scope">
          <span>{{ scope.row.recorded === 1 ? '已确认' : '未确认' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="开房时间" align="center" prop="checkInTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.checkInTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退房时间" align="center" prop="checkOutTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.checkOutTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="住客姓名" align="center" prop="guestName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleConfirm(scope.row)" v-hasPermi="['hotel:starbookings:confirm']">确认</el-button>
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

    <!-- 添加或修改星级酒店预定信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="starbookingsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="酒店id" prop="hotelId">
          <el-input v-model="form.hotelId" placeholder="请输入酒店id" />
        </el-form-item>
        <el-form-item label="房型id" prop="roomTypeId">
          <el-input v-model="form.roomTypeId" placeholder="请输入房型id" />
        </el-form-item>
        <el-form-item label="预约人id" prop="guestId">
          <el-input v-model="form.guestId" placeholder="请输入预约人id" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contactNumber">
          <el-input v-model="form.contactNumber" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="是否确认" prop="recorded">
          <el-input v-model="form.recorded" placeholder="请输入是否确认" />
        </el-form-item>
        <el-form-item label="开房时间" prop="checkInTime">
          <el-date-picker clearable
            v-model="form.checkInTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开房时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退房时间" prop="checkOutTime">
          <el-date-picker clearable
            v-model="form.checkOutTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择退房时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="住客姓名" prop="guestName">
          <el-input v-model="form.guestName" placeholder="请输入住客姓名" />
        </el-form-item>
        <el-form-item label="所有人id" prop="ownerId">
          <el-input v-model="form.ownerId" placeholder="请输入所有人id" :value="userStore.id"/>
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

<script setup name="Starbookings">
import { listStarbookings, getStarbookings, delStarbookings, addStarbookings, updateStarbookings ,ConfirmStarbookings } from "@/api/hotel/starbookings";
import useUserStore from '@/store/modules/user';
const { proxy } = getCurrentInstance();
const userStore = useUserStore();
const starbookingsList = ref([]);
const starbookingsListView = ref([]);
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
    roomTypeId: null,
    guestId: null,
    recorded: null,
    guestName: null,
  },
  rules: {
    hotelId: [
      { required: true, message: "酒店id不能为空", trigger: "blur" }
    ],
    roomTypeId: [
      { required: true, message: "房型id不能为空", trigger: "blur" }
    ],
    guestId: [
      { required: true, message: "预约人id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询星级酒店预定信息列表 */
function getList() {
  loading.value = true;
  listStarbookings(queryParams.value).then(response => {
    starbookingsList.value = response.rows;
    starbookingsListView.value = response.rows.filter(item => item.ownerId === userStore.id);
    total.value = response.total;
    loading.value = false;
    if(userStore.id === 1){
      starbookingsListView.value = starbookingsList.value;
    }
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
    guestId: null,
    contactNumber: null,
    recorded: null,
    checkInTime: null,
    checkOutTime: null,
    guestName: null,
    ownerId: null
  };
  proxy.resetForm("starbookingsRef");
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
  title.value = "添加星级酒店预定信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getStarbookings(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改星级酒店预定信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["starbookingsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateStarbookings(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addStarbookings(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleConfirm(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认星级酒店预定信息编号为"' + _ids +"的预定？").then(function() {
    return ConfirmStarbookings(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("确认成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('hotel/starbookings/export', {
    ...queryParams.value
  }, `starbookings_${new Date().getTime()}.xlsx`)
}

getList();
</script>
