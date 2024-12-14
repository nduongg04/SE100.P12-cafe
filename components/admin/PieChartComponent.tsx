import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type BillReportData = {
  doneCount: number;
  pendingCount: number;
  totalCount: number;
  donePercent: number;
  pendingPercent: number;
};

type PieChartComponentProps = {
  data: BillReportData;
  className?: string;
};

export function PieChartComponent({ data, className }: PieChartComponentProps) {
  const chartData = [
    { name: 'Done', value: data.doneCount },
    { name: 'Pending', value: data.pendingCount },
  ];

  const COLORS = ['#00B074', '#FF6B6B'];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
        <CardDescription>Distribution of done and pending orders</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

