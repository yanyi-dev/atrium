import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import { useDarkMode } from "../../context/DarkModeContext";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { eachDayOfInterval, format, subDays } from "date-fns";

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function SalesChart({ bookings, numDays }) {
  const { isDarkMode } = useDarkMode();

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });
  /*
  const data = allDates.map((date) => {
    return {
      label: format(date, "MMM dd"),
      totalSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => acc + cur.totalPrice, 0),
      extrasSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => acc + cur.extrasPrice, 0),
    };
  });
*/

  /**
 优化方案：可以先用一个 Map（哈希表） 对 bookings 进行一次性遍历，将日期作为 Key，金额作为 Value 存起来。这样在生成 allDates 时，只需要 $O(1)$ 的时间去查找，总复杂度降为 $O(N)
 也就是说我采用了 ‘空间换时间’ 的策略进行了重构。我先利用 Map 对象 对订单进行了一次性线性遍历（$O(N)$），以日期字符串为 Key 进行预聚合并建立索引。
 */

  // 1. 初始化一个 Map 对象。Map 在频繁增删查改时性能优于普通对象 {}。
  const bookingsMap = new Map();

  // 遍历后端返回的原始订单数组（假设有 N 条订单）。
  bookings.forEach((booking) => {
    // 将 ISO 字符串格式的创建时间转为 Date 对象，再统一格式化为 "2025-12-23" 这种纯日期字符串。
    // 关键：必须去掉时分秒，否则同一天的订单会因为秒数不同而无法聚合。
    const dateKey = format(new Date(booking.created_at), "yyyy-MM-dd");

    // 尝试从 Map 中读取该日期已有的统计结果。
    // 如果这是该日期处理的第一笔订单，则初始化一个零值对象作为回退。
    const currentData = bookingsMap.get(dateKey) || {
      totalSales: 0,
      extrasSales: 0,
    };

    // 更新 Map：保留原有的 Key，但将当前订单的金额累加进对应的分类中。
    bookingsMap.set(dateKey, {
      totalSales: currentData.totalSales + booking.totalPrice,
      extrasSales: currentData.extrasSales + booking.extrasPrice,
    });
  });

  // 遍历我们预先生成的连续日期数组 allDates（假设有 D 天）。
  const data = allDates.map((date) => {
    // 为当前循环的这一天生成同样的 Key（如 "2025-12-23"）。
    const dateKey = format(date, "yyyy-MM-dd");

    // 核心优化：直接去 Map 里拿数据。这在算法上是 O(1) 的复杂度。
    // 不需要再用 .filter() 去遍历整个 bookings 数组了。
    const dayData = bookingsMap.get(dateKey);

    // 返回 Recharts 组件渲染每一柱/点所需的标准对象。
    return {
      // 格式化图表底部显示的标签，如 "Dec 23"。
      label: format(date, "MMM dd"),

      // 逻辑判定：如果 Map 里有这一天的数据，就用累加后的值；
      // 如果没有（说明当天没订单），则必须返回 0，否则图表会出现断裂。
      totalSales: dayData ? dayData.totalSales : 0,
      extrasSales: dayData ? dayData.extrasSales : 0,
    };
  });

  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };
  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales from {format(allDates.at(0), "MMM dd yyyy")} &mdash;{" "}
        {format(allDates.at(-1), "MMM dd yyyy")}{" "}
      </Heading>

      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="$"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total sales"
            unit="$"
          />
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={2}
            name="Extras sales"
            unit="$"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
