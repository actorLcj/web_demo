this.$refs['cw_echart_basic_view_Dw_1'].$refs.echart.chartInstance.clear();

// 对list进行排序，按照所有项目时间总和降序排序
const sortedData = list.slice().sort((a, b) => a.sumTime - b.sumTime);
let maxTime = Math.max(...sortedData.map(item => item.sumTime));
let maxX = Math.ceil(maxTime / 5) * 5; // 计算大于 maxTime 的最小的 5 的倍数
// 动态生成 series
const series = [];
const uniquePeople = Array.from(new Set(sortedData.flatMap(d => d.list.map(p => p.name))));

uniquePeople.forEach(personName => {
    const projectData = sortedData.map(project => {
        const person = project.list.find(p => p.name === personName);
        return person ? person.time : 0;
    });

    series.push({
        name: personName,
        type: 'bar',
        stack: 'total',
        barWidth: 20, // 固定每根柱子的宽度为20
        animation: false,// 禁用柱状图的动画效果
        label: {
            show: true,
            formatter: params => params.data !== 0 ? `${params.data}h` : '', // 在数字后面加上 'h'
            textStyle: {
                color: '#FFFFFF' // 设置数字颜色为白色
            }
        },
        emphasis: {
            focus: 'series'
        },
        data: projectData,
        itemStyle: {
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}` // 随机颜色
        }
    });
});
this.option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        },
        formatter: params => {
            let result = `${params[0].axisValue.split('\n')[0]}<br/>`; // 获取名字并换行
            params.forEach(param => {
                if (param.data !== 0) {
                    // 添加小圆点和项目：工时
                    result += `
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${param.color}; margin-right: 5px;"></span>
                        ${param.seriesName}: ${param.data} h<br/>
                    `;
                }
            });
            return result;
        }
    },
    legend: {
        bottom: 0, // 图例位置在底部
        height: '100%', // 设置图例的高度，以限制显示的行数
        // top: '10%' // 增加图例区域的高度
        type: 'scroll' // 允许图例滚动，以显示省略的图例项
    },
    grid: {
        // left: '3%',
        left: 150, // 固定左边距，宽度为200像素
        right: '4%',
        // bottom: '10%',
        top: '1%',
        // containLabel: true
        containLabel: false // 使得 grid 不包含标签
    },
    xAxis: {
        type: 'value',
        max:maxX, // 设置 x 轴的最大值为最大项目时间总和
        axisLabel: {
            animation: false // 禁用 x 轴标题的动画效果
        }
    },
    
    yAxis: {
        type: 'category',
        data: sortedData.map(item => `${item.projectName}\n共 ${item.sumTime} 人天`),
        // max: maxTime, // 设置y轴的最大值为最长柱子的值
        axisLabel: {
            formatter: function(value) {
                const [name, sumTime] = value.split('\n');
                return `${name}\n${sumTime}`;
            },
            width: 140, // 固定宽度，和grid.left保持一致
            overflow: 'break', // 超过宽度换行
        }
    },
    dataZoom: [
        {
            id: 'dataZoomY',
            yAxisIndex: [0],
            show: true,
            type: 'slider',
            start: 1000,
            end: 1000,
            // startValue: 100,
            // endValue: 100,
            width: 6,
            borderColor: 'transparent',
            fillerColor: 'rgba(205,205,205,1)',
            zoomLock: true,
            showDataShadow: false,
            backgroundColor: '#fff',
            showDetail: false,
            realtime: true,
            // filterMode: 'weakFilter', // 使用弱过滤模式，数据缩放时不改变轴的最大值
            filterMode: 'filter',
            handleIcon: 'circle',
            handleStyle: {
                color: 'rgba(205,205,205,1)',
                borderColor: 'rgba(205,205,205,1)',
            },
            handleSize: '80%',
            moveHandleSize: 0,
            maxValueSpan: 9,
            minValueSpan: 9,
            brushSelect: false
        },
        {
            type: 'inside',
            yAxisIndex: 0,
            zoomOnMouseWheel: false,
            moveOnMouseMove: true,
            moveOnMouseWheel: true
        }
    ],

    series: series // 使用动态生成的series
};
