<template>
  <div class="app-container">
    <!-- Echarts 容器 -->
    <div id="entertainment-chart" style="width: 100%; height: 1000px;"></div>

    <!-- 添加或修改娱乐汇总对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="entertainmentChartRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="EntertainmentChart">
import { listEntertainmentChart, getEntertainmentChart, delEntertainmentChart, addEntertainmentChart, updateEntertainmentChart } from "@/api/entertainment/entertainmentChart";
import { onMounted, onBeforeUnmount, ref, reactive, toRefs, watch } from 'vue';
import * as echarts from 'echarts';

const { proxy } = getCurrentInstance();

const entertainmentChartList = ref([]);
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
  },
  rules: {
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

const entertainmentChartInstance = ref(null);

const initChart = () => {
  const chartDom = document.getElementById('entertainment-chart');
  entertainmentChartInstance.value = echarts.init(chartDom);

  const option = {
    title: {
      text: '娱乐评分图表'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '10%',  // 预留空间以显示标签
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: []
    },
    color: [
      '#5470C6',
      '#91CC75',
      '#FAC858',
      '#EE6666',
      '#73C0DE',
      '#3BA272',
      '#FC8452',
      '#9A60B4',
      '#EA7CCC'
    ],
    series: [
      {
        type: 'bar',
        data: [],
        barWidth: 60, // 设置固定的条形宽度
        label: {
          show: true,
          position: 'right',
          formatter: '{c}'
        },
        emphasis: {
          focus: 'series',
          label: {
            show: true,
            position: 'right',
            formatter: (params) => {
              return `${params.name}: ${params.value}`;
            }
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  entertainmentChartInstance.value.setOption(option);
};

const updateChart = () => {
  if (entertainmentChartInstance.value) {
    // 根据评分排序
    const sortedList = [...entertainmentChartList.value].sort((a, b) => a.score - b.score);
    const names = sortedList.map(item => item.name);
    const scores = sortedList.map(item => item.score);

    const dataWithColors = scores.map((score, index) => ({
      value: score,
      itemStyle: {
        color: entertainmentChartInstance.value.getOption().color[index % entertainmentChartInstance.value.getOption().color.length]
      }
    }));

    entertainmentChartInstance.value.setOption({
      yAxis: {
        data: names
      },
      series: [
        {
          data: dataWithColors,
          label: {
            show: true,
            position: 'right',
            formatter: '{c}'
          },
          emphasis: {
            focus: 'series',
            label: {
              show: true,
              position: 'right',
              formatter: (params) => {
                return `${params.name}: ${params.value}`;
              }
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    });
  }
};

const resizeChart = () => {
  if (entertainmentChartInstance.value) {
    entertainmentChartInstance.value.resize();
  }
};

onMounted(() => {
  initChart();
  getList(); // 加载初始数据
  window.addEventListener('resize', resizeChart);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart);
});

watch(entertainmentChartList, () => {
  updateChart();
});

/** 查询娱乐汇总列表 */
function getList() {
  loading.value = true;
  listEntertainmentChart(queryParams.value).then(response => {
    entertainmentChartList.value = response.rows;
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
    openingTime: null,
    address: null,
    closingTime: null,
    picUrl: null,
    score: null
  };
  proxy.resetForm("entertainmentChartRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["entertainmentChartRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEntertainmentChart(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEntertainmentChart(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

getList();
</script>
