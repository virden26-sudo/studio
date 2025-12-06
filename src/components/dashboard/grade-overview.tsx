"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { mockCourses } from "@/lib/mock-data";

const chartConfig = {
  grade: {
    label: "Grade",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function GradeOverview() {
  const chartData = mockCourses.map((course) => ({
    course: course.name,
    grade: course.grade,
  }));

  const gpa = (
    mockCourses.reduce((acc, course) => acc + course.grade, 0) /
    (mockCourses.length * 25)
  ).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gradient">Grade Overview</CardTitle>
        <CardDescription>
          Your current estimated GPA is {gpa}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="course"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.substring(0, 3)}
              />
              <YAxis domain={[50, 100]} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="grade" fill="var(--color-grade)" radius={5} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
