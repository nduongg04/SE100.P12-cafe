import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from 'date-fns';

type RevenueData = {
  dateTime: string;
  revenue: number;
};

type AreaChartComponentProps = {
  data: RevenueData[];
  className?: string;
  startDate?: Date;
  endDate?: Date;
};

export function AreaChartComponent({ data, className, startDate, endDate }: AreaChartComponentProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
          <CardDescription>No data available for the selected period</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatXAxis = (tickItem: string) => {
    try {
      return format(parseISO(tickItem), 'dd/MM');
    } catch {
      return tickItem;
    }
  };

  const formatTooltip = (value: number, name: string, props: { payload: RevenueData }) => {
    if (props && props.payload) {
      try {
        const date = parseISO(props.payload.dateTime);
        return [`$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, format(date, 'dd/MM/yyyy')];
      } catch {
        return [`$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, props.payload.dateTime];
      }
    }
    return [`$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, ''];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
        <CardDescription>Daily revenue for the selected period</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="dateTime" 
              tickFormatter={formatXAxis}
              type="category"
              interval={Math.ceil(data.length / 15)}
              tick={{ fontSize: 14 }}
              height={60}
              tickMargin={20}
              angle={-30}
            />
            <YAxis 
              tickFormatter={(value) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              tick={{ fontSize: 14 }}
            />
            <Tooltip content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const [formattedValue, formattedDate] = formatTooltip(payload[0].value as number, payload[0].name as string, { payload: payload[0].payload as RevenueData });
                return (
                  <div className="bg-white p-2 border border-gray-200 rounded shadow">
                    <p className="font-semibold">{formattedDate}</p>
                    <p>Revenue: {formattedValue}</p>
                  </div>
                );
              }
              return null;
            }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#00B074" 
              strokeWidth={2} 
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

