import styled from "styled-components";
import Heading from "../../ui/Heading";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { StaysAfterDate } from "../../types";
import { useDarkMode } from "../../context/DarkModeContext";

const ChartBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

const NoData = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
  padding-top: 1.1rem;
`;

const startDataLight = [
  {
    duration: "1 night",
    value: 0,
    color: "#ef4444",
  },
  {
    duration: "2 nights",
    value: 0,
    color: "#f97316",
  },
  {
    duration: "3 nights",
    value: 0,
    color: "#eab308",
  },
  {
    duration: "4-5 nights",
    value: 0,
    color: "#84cc16",
  },
  {
    duration: "6-7 nights",
    value: 0,
    color: "#22c55e",
  },
  {
    duration: "8-14 nights",
    value: 0,
    color: "#14b8a6",
  },
  {
    duration: "15-21 nights",
    value: 0,
    color: "#3b82f6",
  },
  {
    duration: "21+ nights",
    value: 0,
    color: "#a855f7",
  },
];

const startDataDark = [
  {
    duration: "1 night",
    value: 0,
    color: "#b91c1c",
  },
  {
    duration: "2 nights",
    value: 0,
    color: "#c2410c",
  },
  {
    duration: "3 nights",
    value: 0,
    color: "#a16207",
  },
  {
    duration: "4-5 nights",
    value: 0,
    color: "#4d7c0f",
  },
  {
    duration: "6-7 nights",
    value: 0,
    color: "#15803d",
  },
  {
    duration: "8-14 nights",
    value: 0,
    color: "#0f766e",
  },
  {
    duration: "15-21 nights",
    value: 0,
    color: "#1d4ed8",
  },
  {
    duration: "21+ nights",
    value: 0,
    color: "#7e22ce",
  },
];

const DarkColor = {
  text: "#e5e7eb",
  background: "#18212f",
};

const LightColor = {
  text: "#374151",
  background: "#fff",
};

type startDataType = {
  duration: string;
  value: number;
  color: string;
}[];

/**
 * 根据入住天数返回对应的时长分类
 * 集中管理分类逻辑，便于维护和扩展
 */
// 声明式配置，更易维护
const DURATION_RANGES = [
  { min: 1, max: 1, label: "1 night" },
  { min: 2, max: 2, label: "2 nights" },
  { min: 3, max: 3, label: "3 nights" },
  { min: 4, max: 5, label: "4-5 nights" },
  { min: 6, max: 7, label: "6-7 nights" },
  { min: 8, max: 14, label: "8-14 nights" },
  { min: 15, max: 21, label: "15-21 nights" },
  { min: 22, max: Infinity, label: "21+ nights" },
];

function getDurationCategory(numNights: number): string | null {
  const range = DURATION_RANGES.find(
    (r) => numNights >= r.min && numNights <= r.max,
  );
  return range?.label ?? null;
}

/**
 * 优化思路：使用 Map 进行一次性计数
 *
 * 原方案：
 * - incArrayValue 每次调用都创建新数组，遍历 8 个元素
 * - reduce 中调用 N 次，总复杂度 O(N × 8)
 *
 * 优化后：
 * - 第一步：遍历 stays，用 Map 计数 O(N)
 * - 第二步：遍历 startData，合并计数 O(8)
 * - 总复杂度：O(N + 8) ≈ O(N)
 */
function prepareData(startData: startDataType, stays: StaysAfterDate[]) {
  //使用 Map 进行计数，Key 为 duration 字符串
  const countMap = new Map<string, number>();

  stays.forEach((stay) => {
    const numNights = stay.numNights ?? 0;
    const category = getDurationCategory(numNights);

    if (category) {
      // Map.get 返回 undefined 时用 0，然后 +1
      countMap.set(category, (countMap.get(category) ?? 0) + 1);
    }
  });

  //将 Map 计数合并到 startData，并过滤掉 value=0 的项
  const data = startData
    .map((item) => ({
      ...item,
      value: countMap.get(item.duration) ?? 0,
    }))
    .filter((item) => item.value > 0);

  return data;
}

interface DurationChartProps {
  confirmedStays: StaysAfterDate[];
}

function DurationChart({ confirmedStays }: DurationChartProps) {
  const { isDarkMode } = useDarkMode();

  if (!confirmedStays.length) {
    return (
      <ChartBox>
        <Heading as="h2">Stay duration summary</Heading>
        <NoData>No stay duration data for this period...</NoData>
      </ChartBox>
    );
  }

  const startData = isDarkMode ? startDataDark : startDataLight;
  const data = prepareData(startData, confirmedStays);
  const colors = isDarkMode ? DarkColor : LightColor;

  return (
    <ChartBox>
      <Heading as="h2">Stay duration summary</Heading>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            nameKey="duration"
            dataKey="value"
            innerRadius={85}
            outerRadius={110}
            cx="40%"
            cy="50%"
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell
                fill={entry.color}
                stroke={entry.color}
                key={entry.duration}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: colors.background }}
            itemStyle={{ color: colors.text }}
          />
          <Legend
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ width: "30%" }}
            layout="vertical"
            iconSize={15}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default DurationChart;
