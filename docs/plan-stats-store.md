# 统计 Store 设计计划（待确认后执行）

## 目标

在 Svelte 的 store 层新增一个**统计 store**，基于 Dexie 中已同步的支付订单数据，为 dashboard 的卡片和折线图提供派生数据；数据源为现有的 `ordersStore`（`liveQuery(orderRepository.getAll())`），统计在内存中计算，避免重复请求。

## 数据约定

- **计入收入的订单**：仅 `transStatus === OrderTransactionStatus.CHARGED` 的订单。
- **金额字段**：使用 `chargedAmountCent`（已扣款金额，分）；展示时需除以 100 转为元。
- **时间字段**：`createdAt` 为 ISO 字符串，统计时按**本地日期**划分（当天 0:00 ~ 24:00、本周一 0:00 起等）；周以**周一**为第一天。
- **趋势**：本期 vs 上期同一时间段的金额变化百分比；若上期为 0 则显示「新增」或 N/A。

---

## 1. 卡片数据设计

### 卡片 1：今日

- **主指标**：今日总收入（元）、今日总订单数（仅 CHARGED）。
- **对比**：上周同一「周几」的同一时间段（今日 0:00 至当前时间 vs 上周同一天 0:00 至同一时刻）的金额趋势（百分比）。
- **Store 输出**：例如 `cardToday: { revenueCent, orderCount, trendPercent, trendLabel }`。

### 卡片 2：本周

- **主指标**：本周（周一 0:00 至当前时刻）总收入、总订单数。
- **对比**：上周同一「周几」截止的同一时间段（上周一 0:00 至上周末同一天同一时刻）的金额趋势。
- **Store 输出**：例如 `cardThisWeek: { revenueCent, orderCount, trendPercent, trendLabel }`。

### 卡片 3 / 4：建议（可选，可先留空）

- **卡片 3 建议**：本月总收入 + 本月订单数，同比上月同一时间段趋势。
- **卡片 4 建议**：平均客单价（总收入/订单数）或退款率（REFUNDED 金额/CHARGED 金额），或「本月 vs 上月」的订单数趋势。
- **实现**：先预留类型与占位（如 `null` 或空对象），后续再填。

---

## 2. 折线图数据设计

- **维度**：过去 7 天、30 天、90 天，**按天**汇总。
- **系列**：每天两条数据（或两个系列）：
  - 当日总收入金额（元或分，由组件决定展示单位）；
  - 当日订单数量（CHARGED）。
- **Store 输出**：按所选范围返回 `{ date: string (YYYY-MM-DD), revenueCent: number, orderCount: number }[]`；支持 7 / 30 / 90 三种范围切换（例如通过 `chartRangeDays: 7 | 30 | 90` 的 writable 或入参）。
- **与现有图表组件**：当前 `ChartAreaInteractive` 为 7d/30d/90d、desktop/mobile 双系列；改为 7/30/90 天 + 收入/订单数双系列对接 stats store。

---

## 3. Store 实现要点

- **文件**：新建 `src/store/stats.store.ts`（或 `statistics.store.ts`），与现有 `order.store.ts`、`alert.store.ts` 同级。
- **依赖**：基于 `ordersStore`（`$ordersStore`）做 `derived`；仅在浏览器侧有 `ordersStore` 时才有意义，需与 `order.store.ts` 一样做 `browser` 判断，非 browser 时导出空的只读 store 或占位值。
- **结构**：
  - 从 `ordersStore` 派生「已加载订单列表」；
  - 用纯函数根据列表 + 当前时间计算：今日统计、本周统计、趋势、按日汇总（7/15/30）；
  - 导出 `derived` store：如 `statsCardToday`、`statsCardThisWeek`、`statsCard3`、`statsCard4`、`statsChartData`；
  - 若图表范围需可切换：可增加 `chartRangeDays = writable<7 | 30 | 90>(7)`，`statsChartData` 再 derived 依赖该值。
- **类型**：在 `stats.store.ts` 或 `src/types/stats.ts` 中定义卡片、图表点的 TypeScript 类型并导出，供页面和图表组件使用。
- **性能**：当前为内存过滤 + 按日聚合；若后续订单量很大，可再考虑在 `order.repository` 中加按 `createdAt`/status 的索引查询，本阶段不必须。

---

## 4. 与现有组件的对接（实现阶段）

- **SectionCards**：改为接收 stats store 的卡片数据（或直接在该组件内 `import` stats store），替换硬编码的金额、订单数、趋势文案。
- **ChartAreaInteractive**：改为消费 `statsChartData` + `chartRangeDays`（7/15/30），系列改为「收入」「订单数」；若需双 Y 轴（金额 vs 数量），在图表组件内处理。
- **Dashboard 页**：无需传 `ordersStore` 给图表/卡片，仅订单表继续用 `ordersStore`；卡片和图表从 stats store 读即可。

---

## 5. 执行顺序建议

1. 在 `src/store/stats.store.ts` 中实现时间范围与聚合的纯函数（今日、本周、上周同区间、按日 7/30/90）。
2. 实现基于 `ordersStore` 的 derived 与可选 `chartRangeDays`，导出卡片 + 图表数据结构。
3. 定义并导出类型（卡片、图表点）。
4. 修改 `SectionCards`、`ChartAreaInteractive` 使用 stats store；卡片 3/4 暂不展示或占位。
5. 跑通 dashboard 页，确认数据与趋势计算正确。

---

## 待你确认的点

1. **周起始**：本周是否按「周一 0:00」起算？若需周日为一周开始，可改为周日 0:00。
2. **卡片 3/4**：是否采用「本月+同比上月」和「平均客单价/退款率」两个建议，还是先全部留空占位？
3. **图表时间范围**：确定为 7 / 30 / 90 天；store 与图表按此实现。

确认后按此计划在仓库中实现并接好组件。
