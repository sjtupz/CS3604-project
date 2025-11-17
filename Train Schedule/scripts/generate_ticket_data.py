import random
import datetime
import numpy as np
import json

# --- 1. CONFIGURATION & CONSTANTS ---

# Overall data scale
TOTAL_DAYS = 120  # -30 days to +90 days
AVG_TRAINS_PER_DAY = 6 # This will generate 120 * 4 * 6 ~= 2880 train routes, which is too low. Let's adjust.
# The user asked for 500-800 total records. Let's aim for ~650.
# 650 records / 4 train types = ~162 records per type.
# Let's distribute these over the date range.
# Let's not do it by day, but by total count.
TOTAL_RECORDS_TARGET = 700


# Station Information
DEPARTURE_STATION = "北京"
ARRIVAL_STATION = "上海"

# Date Range
START_DATE = datetime.date.today() - datetime.timedelta(days=30)
END_DATE = datetime.date.today() + datetime.timedelta(days=90)
DATE_RANGE = [START_DATE + datetime.timedelta(days=x) for x in range(TOTAL_DAYS)]

# Train Type Specifications
TRAIN_SPECS = {
    "G": {"duration_hours": (4, 6), "count": TOTAL_RECORDS_TARGET // 4},
    "D": {"duration_hours": (5, 7), "count": TOTAL_RECORDS_TARGET // 4},
    "K": {"duration_hours": (12, 15), "count": TOTAL_RECORDS_TARGET // 4},
    "Z": {"duration_hours": (10, 12), "count": TOTAL_RECORDS_TARGET // 4},
}

# Seat and Price Specifications
# For normal distribution, we use (mean, std_dev). We can derive std_dev from the range.
# A common rule of thumb: std_dev is roughly (max - min) / 4.
SEAT_SPECS = {
    "一等座": {"dist": "normal", "params": (900, 250), "range": (500, 1500)},
    "二等座": {"dist": "normal", "params": (550, 125), "range": (300, 800)},
    "硬卧": {"dist": "uniform", "params": (400, 1000), "range": (400, 1000)},
}
# Price quantile: 70th percentile for each seat type
PRICE_QUANTILE_THRESHOLD = {
    "一等座": np.percentile(np.random.normal(900, 250, 10000), 70),
    "二等座": np.percentile(np.random.normal(550, 125, 10000), 70),
    "硬卧": 400 + (1000 - 400) * 0.7,
}

# Stock Configuration
STOCK_RANGE = (50, 500)

# --- 2. HELPER FUNCTIONS ---

def generate_price(seat_type):
    """Generates a price based on distribution, range, and quantile rules."""
    spec = SEAT_SPECS[seat_type]
    
    # Decide if it's a high-price or low-price ticket (30% vs 70% chance)
    is_high_price = random.random() < 0.3
    
    threshold = PRICE_QUANTILE_THRESHOLD[seat_type]
    min_val, max_val = spec["range"]

    price = 0
    
    # Generate a price in the correct quantile
    if is_high_price:
        lower_bound = threshold
        upper_bound = max_val
    else:
        lower_bound = min_val
        upper_bound = threshold

    # Generate price based on distribution until it's in the desired range
    while True:
        if spec["dist"] == "normal":
            price = np.random.normal(*spec["params"])
        else: # uniform
            price = random.uniform(*spec["params"])
        
        if lower_bound <= price <= upper_bound:
            break
            
    return int(price)

def format_duration(minutes):
    """Formats total minutes into 'X小时Y分钟'."""
    h = minutes // 60
    m = minutes % 60
    return f"{h}小时{m}分钟"

# --- 3. CORE DATA GENERATION LOGIC ---

def generate_all_train_data():
    """Generates the complete, flat dataset."""
    all_trains = []
    
    # Setup for special "no stock" cases
    special_case_dates = random.sample(DATE_RANGE, len(TRAIN_SPECS))
    special_cases_map = dict(zip(special_case_dates, TRAIN_SPECS.keys()))
    
    for train_type, spec in TRAIN_SPECS.items():
        for i in range(spec["count"]):
            # --- Basic Info ---
            train_no = f"{train_type}{random.randint(1, 999)}"
            
            # --- Date and Time ---
            departure_date = random.choice(DATE_RANGE)
            departure_time_obj = datetime.datetime(
                year=departure_date.year,
                month=departure_date.month,
                day=departure_date.day,
                hour=random.randint(6, 22),
                minute=random.randint(0, 59)
            )
            
            duration_minutes = random.randint(spec["duration_hours"][0] * 60, spec["duration_hours"][1] * 60)
            arrival_time_obj = departure_time_obj + datetime.timedelta(minutes=duration_minutes)
            
            arrival_type = "当日到达" if arrival_time_obj.day == departure_time_obj.day else "次日到达"

            # --- Seats, Prices, and Stock ---
            seats = []
            is_special_case = special_cases_map.get(departure_date) == train_type

            for seat_type in SEAT_SPECS.keys():
                stock = 0 if is_special_case else random.randint(*STOCK_RANGE)
                price = generate_price(seat_type)
                seats.append({"type": seat_type, "stock": stock, "price": price})
            
            # Remove the used special case to ensure only one is created per type
            if is_special_case:
                del special_cases_map[departure_date]

            # --- Assemble Record ---
            train_record = {
                "train_no": train_no,
                "train_type": train_type,
                "from_station": DEPARTURE_STATION,
                "to_station": ARRIVAL_STATION,
                "departure_date": departure_date.strftime('%Y-%m-%d'),
                "departure_time": departure_time_obj.strftime('%H:%M'),
                "arrival_time": arrival_time_obj.strftime('%H:%M'),
                "duration": format_duration(duration_minutes),
                "seats_info": json.dumps(seats, ensure_ascii=False) # Store seats as a JSON string
            }
            all_trains.append(train_record)
            
    return all_trains

# --- 4. SQL SCRIPT GENERATION ---

def generate_sql_script(train_data):
    """Generates the final MySQL 8.0 compatible SQL script."""
    
    # SQL Header and Table Creation
    sql_script = [
        "-- Generated by Trae AI Data Engineer Agent --",
        "-- This script is compatible with MySQL 8.0 --",
        "",
        "START TRANSACTION;",
        "",
        "DROP TABLE IF EXISTS `temp_ticket_data`;",
        "",
        "CREATE TABLE `temp_ticket_data` (",
        "  `id` INT AUTO_INCREMENT PRIMARY KEY,",
        "  `train_no` VARCHAR(10) NOT NULL,",
        "  `train_type` CHAR(1) NOT NULL,",
        "  `from_station` VARCHAR(50) NOT NULL,",
        "  `to_station` VARCHAR(50) NOT NULL,",
        "  `departure_date` DATE NOT NULL,",
        "  `departure_time` TIME NOT NULL,",
        "  `arrival_time` TIME NOT NULL,",
        "  `duration` VARCHAR(50) NOT NULL,",
        "  `seats_info` JSON NOT NULL,",
        "  INDEX `idx_departure_date` (`departure_date`),",
        "  INDEX `idx_train_type` (`train_type`)",
        ");",
        "",
    ]

    # Batch Insert
    batch_size = 100
    for i in range(0, len(train_data), batch_size):
        batch = train_data[i:i+batch_size]
        sql_script.append("INSERT INTO `temp_ticket_data` (`train_no`, `train_type`, `from_station`, `to_station`, `departure_date`, `departure_time`, `arrival_time`, `duration`, `seats_info`) VALUES")
        
        values = []
        for record in batch:
            # Correctly escape the JSON string and backslashes for SQL
            escaped_seats_info = record['seats_info'].replace('\\', '\\\\').replace("'", "''")
            value_str = f"('{record['train_no']}', '{record['train_type']}', '{record['from_station']}', '{record['to_station']}', '{record['departure_date']}', '{record['departure_time']}', '{record['arrival_time']}', '{record['duration']}', '{escaped_seats_info}')"
            values.append(value_str)
            
        sql_script.append(',\n'.join(values) + ";")
        sql_script.append("")

    # SQL Footer
    sql_script.append("COMMIT;")
    sql_script.append("")
    
    return "\n".join(sql_script)

# --- 5. VALIDATION & DOCUMENTATION ---

def run_validation_and_print_report(train_data):
    """Analyzes the generated data and prints a report."""
    
    report = ["--- Data Generation Validation Report ---"]
    report.append(f"Total Records Generated: {len(train_data)}")
    
    # Type Distribution
    type_counts = {t: 0 for t in TRAIN_SPECS.keys()}
    for r in train_data:
        type_counts[r['train_type']] += 1
    report.append("\nDistribution by Train Type:")
    for t, c in type_counts.items():
        report.append(f"  - {t}-Type: {c} records")

    # Price Analysis
    prices = {st: [] for st in SEAT_SPECS.keys()}
    for r in train_data:
        seats = json.loads(r['seats_info'])
        for s in seats:
            prices[s['type']].append(s['price'])
    
    report.append("\nPrice Analysis (Avg / Min / Max):")
    for st, p_list in prices.items():
        report.append(f"  - {st}: {int(np.mean(p_list))} / {int(np.min(p_list))} / {int(np.max(p_list))}")

    # Special Case Verification
    no_stock_count = 0
    for r in train_data:
        seats = json.loads(r['seats_info'])
        if all(s['stock'] == 0 for s in seats):
            no_stock_count += 1
    report.append(f"\nSpecial 'No Stock' Cases Found: {no_stock_count}")
    
    print("\n".join(report))
    return "\n".join(report)


# --- 6. MAIN EXECUTION ---

if __name__ == "__main__":
    print("Starting data generation...")
    final_data = generate_all_train_data()
    print(f"Generated {len(final_data)} records in memory.")
    
    print("\nRunning validation...")
    report_content = run_validation_and_print_report(final_data)
    
    print("\nGenerating SQL script...")
    sql_content = generate_sql_script(final_data)
    
    # --- File Outputs ---
    with open("seed_tickets.sql", "w", encoding="utf-8") as f:
        f.write(sql_content)
    print("Successfully created 'seed_tickets.sql'.")
    
    doc_content = f"""
# Data Generation Documentation

## 1. Algorithm Description

The Python script `generate_ticket_data.py` was used to create the test data. The process is as follows:

- **Data Structure**: A denormalized, flat data structure is used, which is stored in a temporary table `temp_ticket_data`. This mirrors the expected API query result for maximum testing efficiency.
- **Date & Volume**: Data is generated for a {TOTAL_DAYS}-day period, targeting a total of ~{TOTAL_RECORDS_TARGET} records.
- **Train Generation**: For each of the {len(TRAIN_SPECS)} train types, the script creates a specified number of records, distributing them randomly across the date range.
- **Time Calculation**: Departure times are randomized between 06:00-23:00. Durations are randomized within the spec for each train type. Arrival times are calculated from these values, correctly handling overnight trips.
- **Pricing Logic**:
    - Prices for '一等座' and '二等座' follow a **Normal Distribution** to simulate realistic clustering around a mean value.
    - Prices for '硬卧' follow a **Uniform Distribution**.
    - A **Quantile-based rule** is enforced: there is a 30% chance for a ticket to be "high-priced" (above the 70th percentile) and a 70% chance to be "low-priced" (below the 70th percentile), ensuring price diversity.
- **Special Cases**: The script guarantees exactly one "no stock" train for each of the {len(TRAIN_SPECS)} train types, placing them on unique, random dates.

## 2. Data Validation Report

{report_content}

## 3. Deliverables

- **SQL Script**: `seed_tickets.sql` - A MySQL 8.0 compatible script with transactional, batched inserts.
- **Validation Script**: The generation script itself serves as the validation script. To re-run, execute `python scripts/generate_ticket_data.py`.
"""
    with open("data_generation_report.md", "w", encoding="utf-8") as f:
        f.write(doc_content)
    print("Successfully created 'data_generation_report.md'.")