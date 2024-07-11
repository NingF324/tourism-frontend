<template>
  <div className="app-container">
    <!-- Echarts 容器 -->
    <div id="scenic-chart" style="width: 100%; height: 1000px;"></div>
  </div>
</template>

<script setup name="ScenicChart">
import {listScenicChart} from "@/api/scenic/scenicChart";
import {onMounted, onBeforeUnmount, ref, reactive, toRefs, watch} from 'vue';
import * as echarts from 'echarts';
const {proxy} = getCurrentInstance();

const scenicChartList = ref([]);
const loading = ref(true);
const total = ref(0);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
  rules: {
    city: [
      {required: true, message: "城市不能为空", trigger: "blur"}
    ],
    name: [
      {required: true, message: "名称不能为空", trigger: "blur"}
    ],
    address: [
      {required: true, message: "地址不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

const scenicChartInstance = ref(null);

const initChart = () => {
  const chartDom = document.getElementById('scenic-chart');
  scenicChartInstance.value = echarts.init(chartDom);

  const option = {
    title: {
      text: '景区评分图表'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'shadow'}
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

  scenicChartInstance.value.setOption(option);
};

const updateChart = () => {
  if (scenicChartInstance.value) {
    // 根据评分排序
    const sortedList = [...scenicChartList.value].sort((a, b) => a.score - b.score);
    const names = sortedList.map(item => item.name);
    const scores = sortedList.map(item => item.score);

    const dataWithColors = scores.map((score, index) => ({
      value: score,
      itemStyle: {
        color: scenicChartInstance.value.getOption().color[index % scenicChartInstance.value.getOption().color.length]
      }
    }));

    scenicChartInstance.value.setOption({
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
  if (scenicChartInstance.value) {
    scenicChartInstance.value.resize();
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

watch(scenicChartList, () => {
  updateChart();
});

/** 查询景区信息列表 */
function getList() {
  loading.value = true;
  listScenicChart(queryParams.value).then(response => {
    scenicChartList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

getList();
</script>
