import { SearchParams } from '../services/ticket.service';

export function buildTicketQuery(params: SearchParams) {
  const whereConditions: string[] = [];
  const whereParams: any[] = [];
  const orderParams: any[] = [];

  if (params.fromStation) {
    whereConditions.push(`from_station = ?`);
    whereParams.push(params.fromStation);
  }
  if (params.toStation) {
    whereConditions.push(`to_station = ?`);
    whereParams.push(params.toStation);
  }
  if (params.date) {
    whereConditions.push(`departure_date = ?`);
    whereParams.push(params.date);
  }
  if (params.trainTypes && params.trainTypes.length > 0) {
    const trainTypePlaceholders = params.trainTypes.map(() => '?').join(',');
    whereConditions.push(`train_type IN (${trainTypePlaceholders})`);
    whereParams.push(...params.trainTypes);
  }
  if (params.departureTimeRange) {
    whereConditions.push(`departure_time >= ? AND departure_time <= ?`);
    whereParams.push(params.departureTimeRange[0], params.departureTimeRange[1]);
  }
  if (params.arrivalTimeRange) {
    whereConditions.push(`arrival_time >= ? AND arrival_time <= ?`);
    whereParams.push(params.arrivalTimeRange[0], params.arrivalTimeRange[1]);
  }
  if (params.seatType) {
    whereConditions.push(`EXISTS (SELECT 1 FROM json_each(seats_info) WHERE json_extract(value, '$.type') = ?)`);
    whereParams.push(params.seatType);
  }
  if (params.onlyShowAvailable) {
    whereConditions.push(`EXISTS (SELECT 1 FROM json_each(seats_info) WHERE json_extract(value, '$.stock') > 0)`);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  let orderByClause = '';
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'departure_asc':
        orderByClause = 'ORDER BY departure_time ASC';
        break;
      case 'duration_asc':
        orderByClause = 'ORDER BY duration ASC';
        break;
      case 'price_asc':
        if (params.seatType) {
          orderByClause = `ORDER BY COALESCE((SELECT json_extract(value, '$.price') FROM json_each(seats_info) WHERE json_extract(value, '$.type') = ? LIMIT 1), 999999) ASC`;
          orderParams.push(params.seatType);
        } else {
          orderByClause = `ORDER BY (SELECT MIN(json_extract(value, '$.price')) FROM json_each(seats_info)) ASC`;
        }
        break;
      default:
        orderByClause = 'ORDER BY departure_time ASC';
    }
  } else {
    orderByClause = 'ORDER BY departure_time ASC';
  }

  return { whereClause, orderByClause, whereParams, orderParams };
}