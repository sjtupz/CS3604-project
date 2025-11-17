/**
 * @fileoverview Controller for handling ticket-related requests.
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../services/ticket.service';
import { SearchParams } from '../services/ticket.service'; // Assuming interfaces are exported from service

// DTOs would typically be in their own files, e.g., src/dtos/ticket.dto.ts
// For simplicity, we define the expected query structure here.
interface GetTicketsQuery {
  fromStation: string;
  toStation: string;
  date: string;
  trainTypes?: string;
  sortBy?: 'departure_asc' | 'duration_asc' | 'price_asc';
  page?: string;
  pageSize?: string;
}

export class TicketController {
  /**
   * Handles the request to search and filter tickets.
   * Applies validation and calls the service layer.
   * @param req Express request object.
   * @param res Express response object.
   * @param next Express next function.
   */
  // @ExceptionDecorator() // Placeholder for a decorator that handles exceptions
  // @ValidationDecorator(GetTicketsDto) // Placeholder for a decorator that validates DTO
  public static async getTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Manually extract and validate parameters from the request query
      const { fromStation, toStation, date, trainTypes, sortBy, page, pageSize, depStart, depEnd, arrStart, arrEnd, filter_type, filter_seat, sort_by, seatType } = req.query;

      const STATION_MAP: Record<string, string> = {
        BEIJING: '北京',
        SHANGHAI: '上海',
        GUANGZHOU: '广州',
        SHENZHEN: '深圳',
        NANJING: '南京',
        HANGZHOU: '杭州',
        TIANJIN: '天津',
        CHENGDU: '成都',
        WUHAN: '武汉',
        XIAMEN: '厦门',
        CHONGQING: '重庆',
        SUZHOU: '苏州',
        NINGBO: '宁波',
        FUZHOU: '福州',
        CHANGSHA: '长沙',
        ZHENGZHOU: '郑州',
        DALIAN: '大连',
        SHENYANG: '沈阳',
        NANCHANG: '南昌',
        NANNING: '南宁',
        GUILIN: '桂林',
        GUIYANG: '贵阳',
        KUNMING: '昆明',
        TAIYUAN: '太原',
        SHIJIAZHUANG: '石家庄',
        HARBIN: '哈尔滨',
        CHANGCHUN: '长春',
        HUHEHAOTE: '呼和浩特',
        BAOTOU: '包头',
        LANZHOU: '兰州',
        XINING: '西宁',
        YINCHUAN: '银川',
        WULUMUQI: '乌鲁木齐',
      };
      const normalizeStation = (v: any) => {
        const s = String(v || '').trim();
        const upper = s.toUpperCase();
        return STATION_MAP[upper] || s;
      };

      // 2. Validate required parameters
      if (!fromStation || !toStation || !date) {
        res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Missing required query parameters: fromStation, toStation, date.' } });
        return;
      }

      // 3. Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(String(date))) {
          res.status(400).json({ error: { code: 'INVALID_DATE_FORMAT', message: 'Date must be in YYYY-MM-DD format.' } });
          return;
      }

      // 4. Construct the SearchParams object for the service layer
      const params: SearchParams = {
        fromStation: normalizeStation(fromStation),
        toStation: normalizeStation(toStation),
        date: String(date),
        trainTypes: (() => {
          if (typeof trainTypes === 'string') return trainTypes.split(',');
          if (typeof filter_type === 'string') return filter_type.split(',');
          return undefined;
        })(),
        sortBy: (() => {
          if (sortBy) return sortBy as any;
          if (typeof sort_by === 'string') {
            if (sort_by === '价格' || sort_by === 'price') return 'price_asc';
            if (sort_by === '出发时间' || sort_by === 'departure') return 'departure_asc';
            if (sort_by === '历时' || sort_by === 'duration') return 'duration_asc';
          }
          return undefined;
        })(),
        page: page ? parseInt(String(page), 10) : 1,
        pageSize: pageSize ? parseInt(String(pageSize), 10) : 10,
        departureTimeRange: depStart && depEnd ? [String(depStart), String(depEnd)] : undefined,
        arrivalTimeRange: arrStart && arrEnd ? [String(arrStart), String(arrEnd)] : undefined,
        seatType: (() => {
          if (typeof seatType === 'string') return seatType;
          if (typeof filter_seat === 'string') return filter_seat;
          return undefined;
        })(),
      };

      // 2. Call the service layer with validated parameters
      const result = await TicketService.searchAndFilter(params);

      // 3. Format and send the successful response
      res.status(200).json(result);
    } catch (error) {
      // 4. Pass errors to the centralized error-handling middleware
      next(error);
    }
  }

  public static async listWithAggregates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { from, to, date, filter_types, filter_stations_from, filter_stations_to, filter_seat_types, sort_by, page, pageSize, depStart, depEnd } = req.query;
      if (!from || !to || !date) {
        res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Missing required query parameters: from, to, date.' } });
        return;
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(String(date))) {
        res.status(400).json({ error: { code: 'INVALID_DATE_FORMAT', message: 'Date must be in YYYY-MM-DD format.' } });
        return;
      }
      const parseList = (v: any) => typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : undefined;
      const sortMap = (v: any) => {
        const s = String(v || '').toLowerCase();
        if (s === 'price' || s === '价格') return 'price_asc';
        if (s === 'departure' || s === '出发时间') return 'departure_asc';
        if (s === 'duration' || s === '历时') return 'duration_asc';
        return undefined;
      };
      const params = {
        from: String(from),
        to: String(to),
        date: String(date),
        filterTypes: parseList(filter_types),
        filterStationsFrom: parseList(filter_stations_from),
        filterStationsTo: parseList(filter_stations_to),
        filterSeatTypes: parseList(filter_seat_types),
        sortBy: sortMap(sort_by) as any,
        page: page ? parseInt(String(page), 10) : 1,
        pageSize: pageSize ? parseInt(String(pageSize), 10) : 10,
        departureTimeRange: (depStart && depEnd) ? [String(depStart), String(depEnd)] as [string,string] : undefined,
      };
      const result = await TicketService.searchAndAggregate(params);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}