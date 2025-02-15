import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { FormatDate } from "@/utility/FormatDate"
import Link from "next/link"

const chartConfig = 
{
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-1))",
    },
    upcoming: {
      label: "Upcoming",
      color: "hsl(var(--chart-2))",
    },
};

const ProgressBar = ({batch}) =>
{

    const completed = batch.sessions.filter((session) => session.status === 'Completed').length;
    const pending = batch.sessions.length - completed;

    const chartData = 
    [
        { label: 'Completed', value: completed, fill:'hsl(var(--chart-1))'},
        { label: 'Upcoming', value: pending, fill:'white'},
    ]

    return (
    <div className="flex flex-col h-fit text-lg text-white">
      <CardHeader className="items-center pb-0">
        <CardTitle className='text-base'>{batch.course.title}</CardTitle>
        <CardDescription className='pt-1'>{FormatDate(batch.startDate) +' - ' +FormatDate(batch.endDate) }</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              innerRadius={50}
              strokeWidth={5}
            >
            <Label
              content={({ viewBox }) => {
              return (
              <text x={viewBox.cx}
              y={viewBox.cy}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-black text-lg font-semibold">
              {((completed / (completed + pending)) * 100).toFixed(1)}%
            </text>);
            }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="font-semibold">
          
        </div>
        <div className="flex items-center gap-2 font-semibold leading-none text-sm text-white">
        {batch.title} <span className="text-gray-500 font-medium">instructed by</span> {batch.mentor.name}
        </div>
        
      </CardFooter>
    </div>
  )
}

export default ProgressBar