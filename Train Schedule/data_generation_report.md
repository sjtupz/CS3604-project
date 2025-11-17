
# Data Generation Documentation

## 1. Algorithm Description

The Python script `generate_ticket_data.py` was used to create the test data. The process is as follows:

- **Data Structure**: A denormalized, flat data structure is used, which is stored in a temporary table `temp_ticket_data`. This mirrors the expected API query result for maximum testing efficiency.
- **Date & Volume**: Data is generated for a 120-day period, targeting a total of ~700 records.
- **Train Generation**: For each of the 4 train types, the script creates a specified number of records, distributing them randomly across the date range.
- **Time Calculation**: Departure times are randomized between 06:00-23:00. Durations are randomized within the spec for each train type. Arrival times are calculated from these values, correctly handling overnight trips.
- **Pricing Logic**:
    - Prices for '一等座' and '二等座' follow a **Normal Distribution** to simulate realistic clustering around a mean value.
    - Prices for '硬卧' follow a **Uniform Distribution**.
    - A **Quantile-based rule** is enforced: there is a 30% chance for a ticket to be "high-priced" (above the 70th percentile) and a 70% chance to be "low-priced" (below the 70th percentile), ensuring price diversity.
- **Special Cases**: The script guarantees exactly one "no stock" train for each of the 4 train types, placing them on unique, random dates.

## 2. Data Validation Report

--- Data Generation Validation Report ---
Total Records Generated: 700

Distribution by Train Type:
  - G-Type: 175 records
  - D-Type: 175 records
  - K-Type: 175 records
  - Z-Type: 175 records

Price Analysis (Avg / Min / Max):
  - 一等座: 918 / 500 / 1496
  - 二等座: 552 / 300 / 795
  - 硬卧: 692 / 400 / 999

Special 'No Stock' Cases Found: 2

## 3. Deliverables

- **SQL Script**: `seed_tickets.sql` - A MySQL 8.0 compatible script with transactional, batched inserts.
- **Validation Script**: The generation script itself serves as the validation script. To re-run, execute `python scripts/generate_ticket_data.py`.
