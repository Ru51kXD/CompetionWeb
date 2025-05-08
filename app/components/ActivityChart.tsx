import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

interface ActivityData {
  date: string;
  score: number;
}

interface ActivityChartProps {
  data: ActivityData[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Мемоизация вычислений для графика
  const chartData = useMemo(() => {
    const maxScore = Math.max(...data.map(d => d.score));
    const minScore = Math.min(...data.map(d => d.score));
    return { maxScore, minScore };
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Настройки графика
    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    // Рисуем оси
    ctx.beginPath();
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;

    // Ось X
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);

    // Ось Y
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();

    // Рисуем сетку
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 0.5;

    // Горизонтальные линии
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (height * i) / gridLines;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();

      // Подписи значений
      const value = chartData.maxScore - ((chartData.maxScore - chartData.minScore) * i) / gridLines;
      ctx.fillStyle = '#6B7280';
      ctx.font = '12px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(value).toString(), padding - 5, y + 4);
    }

    // Рисуем график
    ctx.beginPath();
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;

    data.forEach((point, index) => {
      const x = padding + (width * index) / (data.length - 1);
      const y = canvas.height - padding - (height * (point.score - chartData.minScore)) / (chartData.maxScore - chartData.minScore);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Рисуем точки
    data.forEach((point, index) => {
      const x = padding + (width * index) / (data.length - 1);
      const y = canvas.height - padding - (height * (point.score - chartData.minScore)) / (chartData.maxScore - chartData.minScore);

      ctx.beginPath();
      ctx.fillStyle = '#3B82F6';
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Подписи дат
      ctx.fillStyle = '#6B7280';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(new Date(point.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }), x, canvas.height - padding + 20);
    });
  }, [data, chartData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-full"
      />
    </motion.div>
  );
} 