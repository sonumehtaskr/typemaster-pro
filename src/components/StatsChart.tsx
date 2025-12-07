'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface StatsChartProps {
  data?: {
    time: number[]
    wpm: number[]
    accuracy: number[]
  }
}

export default function StatsChart({ data }: StatsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  // Sample data for demonstration
  const sampleData = {
    time: [0, 10, 20, 30, 40, 50, 60],
    wpm: [0, 15, 25, 35, 42, 48, 52],
    accuracy: [100, 98, 96, 95, 94, 93, 92]
  }

  const chartData = data || sampleData

  useEffect(() => {
    if (!chartRef.current) return

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current)

    // Chart configuration
    const option = {
      title: {
        text: 'Real-time Performance',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['WPM', 'Accuracy'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        name: 'Time (s)',
        data: chartData.time,
        axisLine: {
          lineStyle: {
            color: '#666'
          }
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'WPM',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#3b82f6'
            }
          },
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: 'Accuracy (%)',
          position: 'right',
          min: 0,
          max: 100,
          axisLine: {
            lineStyle: {
              color: '#10b981'
            }
          },
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name: 'WPM',
          type: 'line',
          data: chartData.wpm,
          smooth: true,
          lineStyle: {
            color: '#3b82f6',
            width: 3
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(59, 130, 246, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(59, 130, 246, 0.05)'
              }
            ])
          },
          symbol: 'circle',
          symbolSize: 6
        },
        {
          name: 'Accuracy',
          type: 'line',
          yAxisIndex: 1,
          data: chartData.accuracy,
          smooth: true,
          lineStyle: {
            color: '#10b981',
            width: 3
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(16, 185, 129, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(16, 185, 129, 0.05)'
              }
            ])
          },
          symbol: 'circle',
          symbolSize: 6
        }
      ]
    }

    // Set chart options
    chartInstance.current.setOption(option)

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
    }
  }, [chartData])

  return (
    <div 
      ref={chartRef} 
      className="w-full h-80"
      style={{ minHeight: '320px' }}
    />
  )
}