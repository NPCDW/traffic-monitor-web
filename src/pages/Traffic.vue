<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import app_api, { AppState, cycleStatisticMethodEnum, CycleType } from '../api/app';
import traffic_api, { MonitorDay, MonitorHour, MonitorSecond } from '../api/traffic';
import { ElMessage } from 'element-plus';
import { nextTick } from 'vue';
import { Chart } from 'chart.js/auto';
import { formatBytes, daysBetweenDates, formatDate, formatDateTime } from '../util/str_util';
import { useTokenStore } from '../store/token';

const version = ref<string>('')
app_api.version().then(({data}) => {
    if (data.code === 200) {
        version.value = data.data
    } else {
        console.log(data.message)
        ElMessage.error(data.message)
    }
}).catch(err => {
  console.log(err)
})

const trafficUsageChart = ref<HTMLCanvasElement | null>(null);
const cycleUsageChart = ref<HTMLCanvasElement | null>(null);
const cycleType = ref<CycleType | null>(null)
const app_state = ref<AppState | null>(null)
app_api.get_app_state().then(({data}) => {
    if (data.code === 200) {
        app_state.value = data.data
        if (app_state.value?.cycle) {
            cycleType.value = new CycleType(app_state.value?.cycle?.cycle_type)
        }
                
        nextTick(() => {
            if (trafficUsageChart.value && app_state.value?.cycle) {
                new Chart(trafficUsageChart.value, {
                    type: 'pie',
                    data: {
                        labels: ['已用流量', '剩余流量'],
                        datasets: [{
                            data: [app_state.value?.cycle.traffic_usage, app_state.value?.cycle.traffic_limit - app_state.value?.cycle.traffic_usage],
                            backgroundColor: ['rgba(204, 204, 204, 0.8)', 'rgba(161, 218, 153, 0.8)'],
                        }]
                    },
                    options: {
                        interaction: {
                            mode: 'dataset',
                            intersect: false,
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: '流量使用情况'
                            },
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                callbacks: {
                                    // 自定义 tooltip 内容
                                    label: function(context) {
                                        let value = context.parsed;
                                        return context.label + ' ' + formatBytes(value);
                                    }
                                }
                            }
                        },
                    }
                });
            }
            if (cycleUsageChart.value && app_state.value?.cycle) {
                let total_day = daysBetweenDates(app_state.value?.cycle.current_cycle_start_date, app_state.value?.cycle.current_cycle_end_date) + 1
                let usage_day = daysBetweenDates(app_state.value?.cycle.current_cycle_start_date, formatDate(new Date()))
                new Chart(cycleUsageChart.value, {
                    type: 'pie',
                    data: {
                        labels: ['已过', '还剩'],
                        datasets: [{
                            data: [usage_day, total_day - usage_day],
                            backgroundColor: ['rgba(204, 204, 204, 0.8)', 'rgba(161, 218, 153, 0.8)'],
                        }]
                    },
                    options: {
                        interaction: {
                            mode: 'dataset',
                            intersect: false,
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: '周期剩余情况'
                            },
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                callbacks: {
                                    // 自定义 tooltip 内容
                                    label: function(context) {
                                        let value = context.parsed;
                                        return context.label + ' ' + value + '天';
                                    }
                                }
                            }
                        },
                    }
                });
            }
        })
    } else {
        console.log(data.message)
        ElMessage.error(data.message)
    }
}).catch(err => {
  console.log(err)
})

let today = new Date();
let thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(today.getDate() - 30);

const dayChart = ref<HTMLCanvasElement | null>(null);
const traffic_day_list = ref<MonitorDay[]>([])
traffic_api.list_traffic_day({start_date: formatDate(thirtyDaysAgo), end_date: formatDate(today)}).then(({data}) => {
    if (data.code === 200) {
        traffic_day_list.value = data.data
    } else {
        console.log(data.message)
        ElMessage.error(data.message)
        return
    }
    const dayDataset = {
        labels: traffic_day_list.value.map((item: MonitorDay) => item.day),
        datasets: [
            {
                label: '上行',
                data: traffic_day_list.value.map((item: MonitorDay) => item.uplink_traffic_usage),
                backgroundColor: 'rgba(144,238,144, 0.5)',
                borderRadius: Number.MAX_VALUE,
                borderSkipped: false,
            },
            {
                label: '下行',
                data: traffic_day_list.value.map((item: MonitorDay) => item.downlink_traffic_usage),
                backgroundColor: 'rgba(0,191,255, 0.5)',
                borderRadius: 5,
                borderSkipped: false,
            }
        ]
    };
    nextTick(() => {
        if (dayChart.value) {
            new Chart(dayChart.value, {
                type: 'bar',
                data: dayDataset,
                options: {
                    responsive: true,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        y: {
                            ticks: {
                                // 使用自定义的格式化函数
                                callback: function(value, index, values) {
                                    return formatBytes(value as number);
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: '最近30天流量统计'
                        },
                        tooltip: {
                            callbacks: {
                                // 自定义 tooltip 内容
                                label: function(context) {
                                    let value = context.parsed.y;
                                    return context.dataset.label + ' ' + formatBytes(value);
                                }
                            }
                        }
                    }
                },
            });
        }
    })
}).catch(err => {
  console.log(err)
})

let now = new Date();
let twentyFourHourAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

const hourChart = ref<HTMLCanvasElement | null>(null);
const traffic_hour_list = ref<MonitorHour[]>([])
traffic_api.list_traffic_hour({start_time: formatDateTime(twentyFourHourAgo), end_time: formatDateTime(now)}).then(({data}) => {
    if (data.code === 200) {
        traffic_hour_list.value = data.data
    } else {
        console.log(data.message)
        ElMessage.error(data.message)
    }
    const hourDataset = {
        labels: traffic_hour_list.value.map((item: MonitorHour) => item.hour),
        datasets: [
            {
                label: '上行',
                data: traffic_hour_list.value.map((item: MonitorHour) => item.uplink_traffic_usage),
                backgroundColor: 'rgba(144,238,144, 0.5)',
                borderRadius: Number.MAX_VALUE,
                borderSkipped: false,
            },
            {
                label: '下行',
                data: traffic_hour_list.value.map((item: MonitorHour) => item.downlink_traffic_usage),
                backgroundColor: 'rgba(0,191,255, 0.5)',
                borderRadius: 5,
                borderSkipped: false,
            }
        ]
    };
    nextTick(() => {
        if (hourChart.value) {
            new Chart(hourChart.value, {
                type: 'bar',
                data: hourDataset,
                options: {
                    responsive: true,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        y: {
                            ticks: {
                                // 使用自定义的格式化函数
                                callback: function(value, index, values) {
                                    return formatBytes(value as number);
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: '最近24小时流量统计'
                        },
                        tooltip: {
                            callbacks: {
                                // 自定义 tooltip 内容
                                label: function(context) {
                                    let value = context.parsed.y;
                                    return context.dataset.label + ' ' + formatBytes(value);
                                }
                            }
                        }
                    }
                },
            });
        }
    })
}).catch(err => {
  console.log(err)
})

let tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

const secondChart = ref<HTMLCanvasElement | null>(null);
const traffic_second_list = ref<MonitorSecond[]>([])
traffic_api.list_traffic_second({start_time: formatDateTime(tenMinutesAgo), end_time: formatDateTime(now)}).then(({data}) => {
    if (data.code === 200) {
        traffic_second_list.value = data.data
    } else {
        console.log(data.message)
        ElMessage.error(data.message)
    }
    const secondDataset = {
        labels: traffic_second_list.value.map((item: MonitorSecond) => item.end_time.substring(11)),
        datasets: [
            {
                label: '上行',
                data: traffic_second_list.value.map((item: MonitorSecond) => item.uplink_traffic_usage),
                backgroundColor: 'rgba(144,238,144, 0.5)',
                borderColor: 'rgba(144,238,144, 0.5)',
                yAxisID: 'y',
            },
            {
                label: '下行',
                data: traffic_second_list.value.map((item: MonitorSecond) => item.downlink_traffic_usage),
                backgroundColor: 'rgba(0,191,255, 0.5)',
                borderColor: 'rgba(0,191,255, 0.5)',
                yAxisID: 'y',
            }
        ]
    };
    nextTick(() => {
        if (secondChart.value) {
            new Chart(secondChart.value, {
                type: 'line',
                data: secondDataset,
                options: {
                    responsive: true,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                // 使用自定义的格式化函数
                                callback: function(value, index, values) {
                                    return formatBytes(value as number);
                                }
                            }
                        },
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: '最近10分钟流量统计'
                        },
                        tooltip: {
                            callbacks: {
                                // 自定义 tooltip 内容
                                label: function(context) {
                                    let value = context.parsed.y;
                                    return context.dataset.label + ' ' + formatBytes(value);
                                }
                            }
                        }
                    }
                },
            });
        }
    })
}).catch(err => {
  console.log(err)
})

const router = useRouter()
function logout() {
    useTokenStore().clearToken()
    router.push({ path: '/login' })
}

const modifyDataForm = ref({
    uplink_traffic_usage: 0,
    downlink_traffic_usage: 0,
})
const modifyDataDialogFormVisible = ref(false)
function modifyData() {
    traffic_api.modify_data({
        uplink_traffic_usage: Math.floor(modifyDataForm.value.uplink_traffic_usage * 1024 * 1024 * 1024),
        downlink_traffic_usage: Math.floor(modifyDataForm.value.downlink_traffic_usage * 1024 * 1024 * 1024)
    }).then(({data}) => {
        if (data.code === 200) {
            traffic_second_list.value = data.data
            modifyDataDialogFormVisible.value = false
            router.go(0)
        } else {
            console.log(data.message)
            ElMessage.error(data.message)
        }
    }).catch(err => {
      console.log(err)
    })
}
</script>

<template>
<div class="traffic">
    <div style="height: 250px; display: flex;">
        <canvas ref="trafficUsageChart"></canvas>
        <canvas ref="cycleUsageChart"></canvas>
        <div style="flex: auto">
            <el-descriptions title="VPS 配置" border :column="3">
                <template #extra>
                    <el-button type="primary" @click="logout()">退出</el-button>
                </template>
                <el-descriptions-item label="VPS名称">{{ app_state?.config.vps_name }}</el-descriptions-item>
                <el-descriptions-item label="网卡">{{ app_state?.config.network_name }}</el-descriptions-item>
                <el-descriptions-item label="监控版本">{{ version }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="流量周期" v-if="app_state && app_state!.cycle" border :column="3">
                <template #extra>
                    <el-button type="success" @click="modifyDataDialogFormVisible = true">修正数据</el-button>
                </template>
                <el-descriptions-item label="周期类型">{{ cycleType ? cycleType.interval + cycleType.type : '' }}</el-descriptions-item>
                <el-descriptions-item label="开始日期">{{ app_state?.cycle?.current_cycle_start_date }}</el-descriptions-item>
                <el-descriptions-item label="结束日期">{{ app_state?.cycle?.current_cycle_end_date }}</el-descriptions-item>
                <el-descriptions-item label="统计方式">{{ cycleStatisticMethodEnum[app_state?.cycle?.statistic_method as "SumInOut" | "MaxInOut" | "OnlyOut"] }}</el-descriptions-item>
                <el-descriptions-item label="上行流量"><el-tag size="small" type="success">{{ formatBytes(app_state?.cycle?.uplink_traffic_usage) }}</el-tag></el-descriptions-item>
                <el-descriptions-item label="下行流量"><el-tag size="small" type="primary">{{ formatBytes(app_state?.cycle?.downlink_traffic_usage) }}</el-tag></el-descriptions-item>
                <el-descriptions-item label="计入流量">{{ formatBytes(app_state?.cycle?.traffic_usage) + ' / ' + formatBytes(app_state?.cycle?.traffic_limit) }}</el-descriptions-item>
                <el-descriptions-item label="达限执行"><code>{{ app_state?.config?.traffic_cycle?.exec }}</code></el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
    <div>
        <canvas ref="dayChart"></canvas>
        <canvas ref="hourChart"></canvas>
        <canvas ref="secondChart"></canvas>
    </div>
</div>

<el-dialog v-model="modifyDataDialogFormVisible" title="修正流量数据" width="500">
    <el-form :model="modifyDataForm">
      <el-form-item label="上行流量(GB)">
        <el-input-number v-model="modifyDataForm.uplink_traffic_usage" autocomplete="off" :precision="2" :controls="false" />
      </el-form-item>
      <el-form-item label="下行流量(GB)">
        <el-input-number v-model="modifyDataForm.downlink_traffic_usage" autocomplete="off" :precision="2" :controls="false" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="modifyDataDialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="modifyData()">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.traffic {
    width: 60%;
    height: 100%;
    margin: auto;
    margin-top: 10px;
}
</style>
