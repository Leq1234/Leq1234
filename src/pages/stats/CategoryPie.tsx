import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { formatMoney } from '@/utils/amount';
import type { CategoryData } from '@/types/stats';

interface CategoryPieProps {
  data: CategoryData[];
}

/** 分类占比环形图 */
export default function CategoryPie({ data }: CategoryPieProps) {
  const option = useMemo<any>(() => {
    const valid = data.filter((d) => d.amount > 0);
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: { name: string; value: number; percent: number }) =>
          `${params.name}<br/>¥${formatMoney(params.value)} (${params.percent}%)`
      },
      legend: {
        orient: 'vertical',
        right: 0,
        top: 'middle',
        itemWidth: 10,
        itemHeight: 10,
        icon: 'circle',
        textStyle: { fontSize: 11, color: '#636E72' },
        formatter: (name: string) => {
          const item = valid.find((d) => d.name === name);
          return `${name} ${item ? `${item.percent}%` : ''}`;
        }
      },
      color: valid.map((d) => d.color),
      series: [
        {
          type: 'pie',
          radius: ['48%', '72%'],
          center: ['32%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
          label: { show: false },
          emphasis: { label: { show: false } },
          data: valid.map((d) => ({ name: d.name, value: d.amount }))
        }
      ]
    };
  }, [data]);

  return <ReactECharts option={option} style={{ height: 220 }} notMerge />;
}