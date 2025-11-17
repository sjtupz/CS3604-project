# 技术规格说明书：车次列表页 (Technical Specification: Train List Page)

---

## A. 数据库架构设计 (Database Schema)

为了精确计算任意两站之间的余票和票价，我们采用规范化的数据模型。

**SQLite DDL (建表语句):**

```sql
-- 车站表 (Stations)
-- 存储所有车站的基础信息
CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
    name TEXT NOT NULL UNIQUE,             -- 车站名称, e.g., '北京南'
    pinyin TEXT NOT NULL,                  -- 全拼, e.g., 'beijingnan'
    code TEXT NOT NULL UNIQUE,             -- 车站电报码, e.g., 'VNP'
    city TEXT NOT NULL                     -- 所在城市, e.g., '北京'
);

-- 车次表 (Trains)
-- 存储列车的基础信息
CREATE TABLE IF NOT EXISTS trains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_no TEXT NOT NULL UNIQUE,         -- 车次号, e.g., 'G108'
    type TEXT NOT NULL CHECK(type IN ('G', 'D', 'Z', 'K', 'T')) -- 车次类型
);

-- 列车时刻表 (Schedules)
-- 核心表：定义了每趟列车的经停路线和时间
CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_id INTEGER NOT NULL,             -- 外键，关联 trains(id)
    station_id INTEGER NOT NULL,           -- 外键，关联 stations(id)
    stop_order INTEGER NOT NULL,           -- 经停顺序，从 1 开始
    arrival_time TEXT,                     -- 到达时间 (HH:MM)，始发站为 NULL
    departure_time TEXT,                   -- 出发时间 (HH:MM)，终点站为 NULL
    price_from_start REAL NOT NULL,        -- 从始发站到本站的累计票价（用于计算区间价）
    FOREIGN KEY (train_id) REFERENCES trains(id),
    FOREIGN KEY (station_id) REFERENCES stations(id),
    UNIQUE(train_id, station_id),
    UNIQUE(train_id, stop_order)
);

-- 座位库存表 (SeatInventories)
-- 定义每趟列车拥有的座位
CREATE TABLE IF NOT EXISTS seat_inventories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_id INTEGER NOT NULL,             -- 外键，关联 trains(id)
    seat_type TEXT NOT NULL CHECK(seat_type IN ('一等座', '二等座', '软卧', '硬卧', '硬座', '无座')),
    carriage_no INTEGER NOT NULL,          -- 车厢号
    seat_no TEXT NOT NULL,                 -- 座位号, e.g., '08A'
    FOREIGN KEY (train_id) REFERENCES trains(id),
    UNIQUE(train_id, carriage_no, seat_no)
);

-- 预定记录表 (Bookings)
-- 记录每个座位在特定日期被占用的路段
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seat_inventory_id INTEGER NOT NULL,    -- 外键，关联 seat_inventories(id)
    booking_date TEXT NOT NULL,            -- 预定日期 (YYYY-MM-DD)
    from_station_id INTEGER NOT NULL,      -- 预定的起始站
    to_station_id INTEGER NOT NULL,        -- 预定的终点站
    FOREIGN KEY (seat_inventory_id) REFERENCES seat_inventories(id),
    FOREIGN KEY (from_station_id) REFERENCES stations(id),
    FOREIGN KEY (to_station_id) REFERENCES stations(id)
);
```

**数据工程师注意事项:**
*   **`stations` 表**: `name`, `pinyin`, `code`, `city` 均为必填。
*   **`schedules` 表**: `stop_order` 必须连续且从 1 开始。`price_from_start` 是计算任意两站票价的关键，票价 = `schedules(to).price_from_start - schedules(from).price_from_start`。
*   **`seat_inventories` 表**: 必须为每趟列车定义其拥有的所有座位。
*   **`bookings` 表**: 用于模拟座位占用情况，是计算余票的核心。

---

## B. API 接口契约 (API Contract)

*   **HTTP 方法与路径**: `GET /api/v1/tickets`

*   **请求参数 (Query Parameters)**:
    | 参数 | 类型 | 必填 | 描述与验证规则 |
    | :--- | :--- | :--- | :--- |
    | `fromStation` | string | **是** | 出发站的车站代码 (e.g., `VNP`)。必须为有效的车站代码。 |
    | `toStation` | string | **是** | 到达站的车站代码 (e.g., `SHH`)。必须为有效的车站代码。 |
    | `date` | string | **是** | 出发日期。格式必须为 `YYYY-MM-DD`，且不能早于今天。 |
    | `trainTypes` | string | 否 | 车次类型过滤，多个值用逗号分隔 (e.g., `G,D`)。值必须在 `['G', 'D', 'Z', 'K', 'T']` 中。 |
    | `sortBy` | string | 否 | 排序方式。值必须在 `['departure_asc', 'duration_asc', 'price_asc']` 之一。默认为 `departure_asc`。 |
    | `page` | number | 否 | 分页页码，从 1 开始。必须为正整数，默认为 `1`。 |
    | `pageSize` | number | 否 | 每页条数。必须为正整数，默认为 `10`。 |

*   **成功响应 (200 OK)**:
    ```json
    {
      "meta": {
        "totalItems": 128,
        "totalPages": 13,
        "currentPage": 1,
        "pageSize": 10
      },
      "data": [
        {
          "trainNo": "G108",
          "fromStation": "北京南",
          "toStation": "上海虹桥",
          "departureTime": "09:00",
          "arrivalTime": "13:29",
          "duration": "4小时29分钟",
          "arrivalType": "当日到达",
          "seats": [
            { "type": "商务座", "status": "候补", "price": 1873.00 },
            { "type": "一等座", "status": 15, "price": 933.00 },
            { "type": "二等座", "status": "有", "price": 553.00 },
            { "type": "软卧", "status": "-", "price": null }
          ]
        }
      ]
    }
    ```

*   **失败响应 (400 Bad Request)** - 参数验证失败:
    ```json
    {
      "error": {
        "code": "INVALID_INPUT",
        "message": "请求参数验证失败。",
        "details": [
          { "field": "date", "message": "日期格式不正确或早于当前日期。" }
        ]
      }
    }
    ```

---

## C. 后端代码骨架 (Backend Scaffolding Specs)

*   **Controller 层 (Express.js)**:
    ```typescript
    // file: src/controllers/ticket.controller.ts
    import { Request, Response, NextFunction } from 'express';
    import { TicketService } from '../services/ticket.service';

    export class TicketController {
      /**
       * @description 处理查询车票列表的请求
       */
      public static async getTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const queryParams = req.query; // 包含 fromStation, toStation, date 等
          // 1. 在此进行详细的输入验证 (Validation)
          // 2. 调用 Service 层
          const result = await TicketService.searchAndFilter(queryParams);
          // 3. 格式化并发送响应
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    }
    ```

*   **Service 层 (核心业务逻辑)**:
    ```typescript
    // file: src/services/ticket.service.ts

    // 定义查询参数的接口
    interface SearchParams {
      fromStation: string;
      toStation: string;
      date: string;
      trainTypes?: string[];
      sortBy?: 'departure_asc' | 'duration_asc' | 'price_asc';
      page?: number;
      pageSize?: number;
    }

    // 定义返回结果的接口
    interface SearchResult {
      meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
      };
      data: TicketInfo[];
    }

    interface TicketInfo {
      trainNo: string;
      fromStation: string;
      toStation: string;
      departureTime: string;
      arrivalTime: string;
      duration: string;
      arrivalType: '当日到达' | '次日到达';
      seats: Array<{
        type: string;
        status: '有' | '候补' | number | '-';
        price: number | null;
      }>;
    }

    export class TicketService {
      /**
       * @description 根据查询参数，搜索、筛选并计算余票，返回格式化的车票列表
       * @param params - 经过验证的查询参数
       * @returns - 包含分页信息和车票数据的Promise
       */
      public static async searchAndFilter(params: SearchParams): Promise<SearchResult> {
        // 核心逻辑实现：
        // 1. 根据 fromStation 和 toStation 代码，查询数据库获取 station_id 和 stop_order。
        // 2. 找出所有同时经过这两个站点的 train_id。
        // 3. 对每一个 train_id，遍历其所有 seat_inventory_id。
        // 4. 对每一个 seat，检查在 bookings 表中，该座位在给定 date 和指定区间（from_station_id 到 to_station_id）内是否已被预定。
        // 5. 聚合计算每种 seat_type 的余票数量，并根据规则转换为 '有', '候补', 或具体数字。
        // 6. 计算票价和历时。
        // 7. 应用 trainTypes 过滤和 sortBy 排序。
        // 8. 执行分页查询并构建最终的 SearchResult 对象。
        
        // 此处为伪代码，返回一个模拟结果
        return Promise.resolve({} as SearchResult);
      }
    }
    ```

---

## D. 前端状态模型 (Frontend State Model)

```typescript
// file: src/types/ticket.types.ts

/**
 * @description 单个坐席的详细信息
 */
export interface SeatInfo {
  type: string; // e.g., '二等座'
  status: '有' | '候补' | number | '-'; // '有'(>20), 15 (<=20), '候补'(0), '-'(无此席别)
  price: number | null;
}

/**
 * @description 单个车次票务的完整信息，对应列表中的一行
 */
export interface Ticket {
  trainNo: string;
  fromStation: string;
  toStation: string;
  departureTime: string; // "HH:mm"
  arrivalTime: string;   // "HH:mm"
  duration: string;      // "X小时Y分钟"
  arrivalType: '当日到达' | '次日到达';
  seats: SeatInfo[];
}

/**
 * @description API 返回的完整状态，用于前端全局 Store 或页面级 State
 */
export interface TicketsState {
  isLoading: boolean;
  error: string | null;
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  tickets: Ticket[];
}
```