<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="酒店名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入酒店名称"
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
          v-hasPermi="['hotel:starhotels:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hotel:starhotels:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hotel:starhotels:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['hotel:starhotels:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="starhotelsListView" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="酒店id" align="center" prop="id" />
      <el-table-column label="酒店名称" align="center" prop="name" />
      <el-table-column label="星级" align="center" prop="starLevel" />
      <el-table-column label="最低价" align="center" prop="minPrice" />
      <el-table-column label="总剩余量" align="center" prop="totalQuantity" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="图片" align="center" prop="imageUrl" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.imageUrl" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['hotel:starhotels:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['hotel:starhotels:remove']">删除</el-button>
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

    <!-- 添加或修改星级酒店信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="starhotelsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="酒店名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入酒店名称" />
        </el-form-item>
        <el-form-item label="星级" prop="starLevel">
          <el-input v-model="form.starLevel" placeholder="请输入星级" />
        </el-form-item>
        <el-form-item label="最低价" prop="minPrice">
          <el-input v-model="form.minPrice" placeholder="请输入最低价" />
        </el-form-item>
        <el-form-item label="总剩余量" prop="totalQuantity">
          <el-input v-model="form.totalQuantity" placeholder="请输入总剩余量" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <image-upload v-model="form.imageUrl"/>
        </el-form-item>
        <el-form-item label="所属人id" prop="ownerId">
          <el-input v-model="form.ownerId" placeholder="请输入所属人id" :value="userStore.id"/>
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

<script setup name="Starhotels">
import {addStarhotels, delStarhotels, getStarhotels, listStarhotels, updateStarhotels} from "@/api/hotel/starhotels";
import useUserStore from '@/store/modules/user';

const { proxy } = getCurrentInstance();
const userStore = useUserStore();
const starhotelsList = ref([]);
const starhotelsListView = ref([]);
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
    address: null,
  },
  rules: {
    name: [
      { required: true, message: "酒店名称不能为空", trigger: "blur" }
    ],
    starLevel: [
      { required: true, message: "星级不能为空", trigger: "blur" }
    ],
    minPrice: [
      { required: true, message: "最低价不能为空", trigger: "blur" }
    ],
    totalQuantity: [
      { required: true, message: "总剩余量不能为空", trigger: "blur" }
    ],
    address: [
      { required: true, message: "地址不能为空", trigger: "blur" }
    ],
    imageUrl: [
      { required: true, message: "图片不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询星级酒店信息列表 */
function getList() {
  loading.value = true;
  listStarhotels(queryParams.value).then(response => {
    starhotelsList.value = response.rows;
    // 过滤出 owner_id 为 userStore.id 的酒店信息
    starhotelsListView.value = response.rows.filter(item => item.ownerId === userStore.id);
    total.value = response.total;
    loading.value = false;
    if(userStore.id===1){
      starhotelsListView.value=starhotelsList.value;
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
    name: null,
    starLevel: null,
    minPrice: null,
    totalQuantity: null,
    address: null,
    imageUrl: null,
    ownerId: null
  };
  proxy.resetForm("starhotelsRef");
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
  title.value = "添加星级酒店信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getStarhotels(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改星级酒店信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["starhotelsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateStarhotels(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addStarhotels(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除星级酒店信息编号为"' + _ids + '"的数据项？').then(function() {
    return delStarhotels(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('hotel/starhotels/export', {
    ...queryParams.value
  }, `starhotels_${new Date().getTime()}.xlsx`)
}

getList();
</script>
