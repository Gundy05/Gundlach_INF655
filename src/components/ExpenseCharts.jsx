import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../lib/utils";
import EmptyState from "./EmptyState";

function currencyTooltip(value, name) {
  return [formatCurrency(value), name];
}

function ExpenseCharts({ categoryData, monthlyData }) {
  return (
    <section className="charts-grid">
      <article className="content-card chart-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Category split</p>
            <h2>Where is the money going?</h2>
          </div>
        </div>

        {categoryData.length ? (
          <div className="chart-wrap">
            <ResponsiveContainer height={280} width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={categoryData}
                  dataKey="amount"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {categoryData.map((entry) => (
                    <Cell fill={entry.color} key={entry.category} />
                  ))}
                </Pie>
                <Tooltip formatter={currencyTooltip} />
              </PieChart>
            </ResponsiveContainer>

            <div className="legend-list">
              {categoryData.map((entry) => (
                <div className="legend-row" key={entry.category}>
                  <span className="legend-label">
                    <span className="legend-swatch" style={{ backgroundColor: entry.color }} />
                    {entry.category}
                  </span>
                  <strong>{formatCurrency(entry.amount)}</strong>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            message="Once you add expenses for this month, your category chart will appear here."
            title="No chart data yet"
          />
        )}
      </article>

      <article className="content-card chart-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Six-month trend</p>
            <h2>How has spending changed over time?</h2>
          </div>
        </div>

        {monthlyData.some((item) => item.amount > 0) ? (
          <div className="chart-wrap">
            <ResponsiveContainer height={280} width="100%">
              <BarChart data={monthlyData}>
                <XAxis
                  dataKey="label"
                  stroke="#4b5563"
                  tickFormatter={(label) => label.replace("\n", " ")}
                />
                <YAxis stroke="#4b5563" tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={currencyTooltip} labelFormatter={(label) => label.replace("\n", " ")} />
                <Bar dataKey="amount" fill="#0f766e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            message="A few months of expenses will turn this into a helpful trend chart."
            title="Trend chart is waiting on data"
          />
        )}
      </article>
    </section>
  );
}

export default ExpenseCharts;

