<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="餐饮娱乐id" prop="diningEntertainmentId">
        <el-input
          v-model="queryParams.diningEntertainmentId"
          placeholder="请输入餐饮娱乐id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评价人" prop="guestName">
        <el-input
          v-model="queryParams.guestName"
          placeholder="请输入评价人"
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
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="reviewsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="评价id" align="center" prop="id" />
      <el-table-column label="餐饮娱乐id" align="center" prop="diningEntertainmentId" />
      <el-table-column label="内容" align="center" prop="content" />
      <el-table-column label="评价人" align="center" prop="guestName" />
      <el-table-column label="评分" align="center" prop="rating" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 添加或修改餐饮娱乐评价对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="reviewsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="餐饮娱乐id" prop="diningEntertainmentId">
          <el-input v-model="form.diningEntertainmentId" placeholder="请输入餐饮娱乐id" />
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="评价人" prop="guestName">
          <el-input v-model="form.guestName" placeholder="请输入评价人" />
        </el-form-item>
        <el-form-item label="评分" prop="rating">
          <el-input v-model="form.rating" placeholder="请输入评分" />
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

<script setup name="Reviews">
import { listReviews, getReviews, delReviews, addReviews, updateReviews } from "@/api/entertainment/derev";

const { proxy } = getCurrentInstance();

const reviewsList = ref([]);
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
    diningEntertainmentId: null,
    content: null,
    guestName: null,
  },
  rules: {
    diningEntertainmentId: [
      { required: true, message: "餐饮娱乐id不能为空", trigger: "blur" }
    ],
    content: [
      { required: true, message: "内容不能为空", trigger: "blur" }
    ],
    guestName: [
      { required: true, message: "评价人不能为空", trigger: "blur" }
    ],
    rating: [
      { required: true, message: "评分不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询餐饮娱乐评价列表 */
function getList() {
  loading.value = true;
  listReviews(queryParams.value).then(response => {
    reviewsList.value = response.rows;
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
    diningEntertainmentId: null,
    content: null,
    guestName: null,
    rating: null
  };
  proxy.resetForm("reviewsRef");
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
  title.value = "添加餐饮娱乐评价";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getReviews(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改餐饮娱乐评价";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["reviewsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateReviews(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addReviews(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除餐饮娱乐评价编号为"' + _ids + '"的数据项？').then(function() {
    return delReviews(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('entertainment/derev/export', {
    ...queryParams.value
  }, `reviews_${new Date().getTime()}.xlsx`)
}

getList();
</script>
