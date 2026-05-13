import { EXPENSE_CATEGORIES } from "../data/categories";
import FormField from "./FormField";

function ExpenseFilters({ filters, onChange, onReset }) {
  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Find expenses faster</p>
          <h2>Search, filter, and narrow the list.</h2>
        </div>
        <button className="ghost-button" onClick={onReset} type="button">
          Clear filters
        </button>
      </div>

      <div className="filter-grid">
        <FormField label="Search">
          <input
            className="field-input"
            name="search"
            onChange={onChange}
            placeholder="Search by description or category"
            type="text"
            value={filters.search}
          />
        </FormField>

        <FormField label="Category">
          <select
            className="field-input"
            name="category"
            onChange={onChange}
            value={filters.category}
          >
            <option value="All">All categories</option>
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="From date">
          <input
            className="field-input"
            name="dateFrom"
            onChange={onChange}
            type="date"
            value={filters.dateFrom}
          />
        </FormField>

        <FormField label="To date">
          <input
            className="field-input"
            name="dateTo"
            onChange={onChange}
            type="date"
            value={filters.dateTo}
          />
        </FormField>

        <FormField label="Minimum amount">
          <input
            className="field-input"
            min="0"
            name="minAmount"
            onChange={onChange}
            placeholder="0.00"
            step="0.01"
            type="number"
            value={filters.minAmount}
          />
        </FormField>

        <FormField label="Maximum amount">
          <input
            className="field-input"
            min="0"
            name="maxAmount"
            onChange={onChange}
            placeholder="999.99"
            step="0.01"
            type="number"
            value={filters.maxAmount}
          />
        </FormField>
      </div>

      <label className="checkbox-row">
        <input
          checked={filters.recurringOnly}
          name="recurringOnly"
          onChange={onChange}
          type="checkbox"
        />
        <span>Show only recurring expenses</span>
      </label>
    </section>
  );
}

export default ExpenseFilters;

