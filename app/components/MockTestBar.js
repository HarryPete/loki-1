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
import { useCallback, useRef } from "react";
import downloadIcon from '../../assets/download.png'
import Image from "next/image";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";

const chartConfig = 
{
    correct: {
      label: "Correct",
      color: "#4CAF50",
    },
    incorrect: {
      label: "Incorrect",
      color: "hsl(var(--chart-4))",
    },
};

const MockTestBar = ({mockData}) =>
{
    const divRef = useRef(null);
    const total = mockData.answers.length
    const correct = mockData.score;
    const incorrect = total - correct;

    const chartData = 
    [
        { label: 'Correct', value: correct, fill:'#4CAF50'},
        { label: 'Incorrect', value: incorrect, fill:'#F5F5F5'},
    ]

    const downloadReport = 
    useCallback(() => 
    {   
        if(divRef.current === null) 
            return

        toPng(divRef.current, { cacheBust: true, })
        .then((dataUrl) => 
        {
            const link = document.createElement('a')
            link.download = 'fintAML.png'
            link.href = dataUrl
            link.click()
        })
        .catch((err) => 
        {
            toast.error(err)
        })

    }, [divRef])

    return (
    <Card className="" style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
      <div className="flex flex-col text-white rounded-t-xl" style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}} ref={divRef}>
      <CardHeader className="items-center pb-0">
      <h1 className="font-semibold text-center text-lg">Mock Report</h1>
      <p className="text-muted">{mockData.enrollment.batch.title} | Mock set {mockData.quiz.title.split('-')[0][0]}</p>
      </CardHeader>
      <CardContent className="flex gap-2 pb-0 items-center">
        
      
        <div className="w-full">
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
              {((correct / (total)) * 100).toFixed(1)}%
            </text>);
            }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        </div>        
      </CardContent>
      <CardFooter>
      <div className="flex flex-col text-center justify-between gap-2 text-sm w-full">
          <p><span className="font-semibold">Name</span> {mockData.enrollment.user.name}</p>
          <p className="text-gray-400 text-xs">Latest attempt on {FormatDate(mockData.updatedAt)}</p>
     
          <div className="flex text-center justify-around text-xs">
            <div className="flex items-center gap-1">
              <p className="font-semibold">Questions</p>
              <p className="bg-blue-500 p-0.5 px-2 w-fit rounded-full text-white">{total}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">Correct</p>
              <p className="bg-green-500 p-0.5 px-2 w-fit rounded-full text-white">{correct}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">Incorrect</p>
              <p className="bg-red-500 p-0.5 px-2 w-fit rounded-full text-white">{incorrect}</p>
            </div>
          </div>
           </div>
      
      </CardFooter>
      
    </div>
    <Button className='w-full' onClick={downloadReport}>Download Report</Button>
    {/* <Image className='h-5 w-fit absolute top-0 rounded-full md:left-[-24px] left-[-20px] cursor-pointer' onClick={downloadReport} src={downloadIcon} alt='download'/> */}
    </Card>
  )
}

export default MockTestBar