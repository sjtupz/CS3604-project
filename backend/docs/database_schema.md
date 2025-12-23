# Database Schema Documentation

## Overview
This document describes the schema used for the 12306 Ticket Booking System backend. The system uses SQLite as the storage engine. The schema has been expanded to support comprehensive route and inventory management (RF Schema).

## Tables

### 1. `rf_cities`
Stores city information.
- `city_code` (TEXT, PK): Unique identifier (e.g., '310000').
- `name` (TEXT): City name (e.g., '上海').
- `province` (TEXT): Province name.
- `level` (TEXT): Administrative level.
- `pinyin` (TEXT): Pinyin representation.

### 2. `rf_stations`
Stores station information.
- `station_id` (INTEGER, PK, Auto-inc): Internal ID.
- `name` (TEXT): Station name (e.g., '上海虹桥').
- `code` (TEXT, Unique): Station code.
- `pinyin` (TEXT): Pinyin.
- `city_code` (TEXT, FK -> rf_cities): Associated city code.
- `city` (TEXT): Denormalized city name for easy querying.
- `ad_code` (TEXT): Administrative code.
- `lat` (REAL): Latitude.
- `lng` (REAL): Longitude.

### 3. `rf_trains`
Stores base train route definitions.
- `train_id` (INTEGER, PK, Auto-inc): Internal ID.
- `train_number` (TEXT): Train number (e.g., 'G101').
- `train_type` (TEXT): Type (G, D, Z, T, K).
- `origin_station_id` (INTEGER, FK -> rf_stations): Starting station.
- `destination_station_id` (INTEGER, FK -> rf_stations): Ending station.
- `distance_km` (REAL): Total distance.
- `duration_minutes` (INTEGER): Total duration.
- `stop_count` (INTEGER): Number of stops.

### 4. `rf_timetables`
Stores schedule/stop details for trains.
- `schedule_id` (INTEGER, PK, Auto-inc).
- `train_id` (INTEGER, FK -> rf_trains).
- `station_id` (INTEGER, FK -> rf_stations).
- `arrival_time` (TEXT): HH:mm or '-'.
- `departure_time` (TEXT): HH:mm or '-'.
- `stop_minutes` (INTEGER): Dwell time.
- `stop_order` (INTEGER): Order in sequence (1-based).

### 5. `rf_fares`
Stores base prices for seat types.
- `fare_id` (INTEGER, PK, Auto-inc).
- `train_id` (INTEGER, FK -> rf_trains).
- `seat_type` (TEXT): e.g., '二等座', '商务座'.
- `base_price` (REAL): Price in RMB.

### 6. `rf_inventories`
Stores daily inventory for train segments.
- `stock_id` (INTEGER, PK, Auto-inc).
- `train_id` (INTEGER, FK -> rf_trains).
- `travel_date` (TEXT): YYYY-MM-DD.
- `from_station_id` (INTEGER, FK -> rf_stations): Segment start.
- `to_station_id` (INTEGER, FK -> rf_stations): Segment end.
- `business_remaining` (INTEGER): Remaining Business Class seats.
- `first_remaining` (INTEGER): Remaining 1st Class seats.
- `second_remaining` (INTEGER): Remaining 2nd Class seats.
- `soft_sleeper_remaining` (INTEGER): Remaining Soft Sleeper.
- `hard_sleeper_remaining` (INTEGER): Remaining Hard Sleeper.
- `hard_seat_remaining` (INTEGER): Remaining Hard Seat.
- `no_seat_remaining` (INTEGER): Remaining No Seat.

## Indexes
- `idx_rf_inventories_query`: `(train_id, travel_date, from_station_id, to_station_id)` - Optimizes seat availability lookups.
- `idx_rf_trains_stations`: `(origin_station_id, destination_station_id)` - Optimizes route searching.
- `idx_rf_stations_city`: `(city)` - Optimizes city-based station searching.

## Legacy Tables (Maintained for Compatibility)
- `users`: User accounts.
- `passengers`: Passenger profiles.
- `orders`: Ticket orders.
- `train_tickets`: Simple flat table for legacy queries (if applicable).
