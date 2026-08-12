import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { toYuan } from '@/utils/amount';
import type { DailyData } from '@/types/stats';

interface TrendChartProps {
  data: DailyData[];
}

/** 月度收支趋势图（折线） */
export default function TrendChart({ data }: TrendChartProps) {
  const option = useMemo<any>(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: (params: Array<{ seriesName: string; value: number; axisValue: string }>) => {
          let html = `<div style="font-weight:600">${params[0]?.axisValue ?? ''}</div>`;
          for (const p of params) {
            const color = p.seriesName === '支出' ? '#FF6B6B' : '#4ECDC4';
            html += `<div style="display:flex;align-items:center;gap:6px;margin-top:2px">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color}"></span>
              <span>${p.seriesName}</span>
              <b style="margin-left:auto">¥${toYuan(p.value)}</b>
            </div>`;
          }
          return html;
        }
      },
      legend: { data: ['支出', '收入'], bottom: 0, itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 11 } },
      grid: { left: 8, right: 8, top: 24, bottom: 28, containLabel: true },
      xAxis: {
        type: 'category',
        data: data.map((d) => Number(d.date.slice(8, 10))),
        axisLine: { lineStyle: { color: '#F0F0F0' } },
        axisLabel: { color: '#B2BEC3', fontSize: 10, interval: 4 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#B2BEC3', fontSize: 10, formatter: (v: number) => `${v / 100}` },
        splitLine: { lineStyle: { color: '#F5F5F5' } }
      },
      series: [
        {
          name: '支出',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: data.map((d) => d.expense),
          lineStyle: { width: 2, color: '#FF6B6B' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255,107,107,0.18)' },
                { offset: 1, color: 'rgba(255,107,107,0)' }
              ]
            }
          }
        },
        {
          name: '收入',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: data.map((d) => d.income),
          lineStyle: { width: 2, color: '#4ECDC4' }
        }
      ]
    }),
    [data]
  );

  return <ReactECharts option={option} style={{ height: 240 }} notMerge />;
}