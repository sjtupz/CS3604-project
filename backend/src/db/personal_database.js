// SQLite数据库连接配置
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径（测试环境使用内存数据库）
const DB_PATH = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : path.join(__dirname, '../../data/12306.db');

let db = null;
let initPromise = null;

// 获取数据库连接
const getDb = () => {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database.');
      }
    });
    // 初始化数据库（异步，但不阻塞）
    initPromise = initializeDatabase().catch(err => {
      console.error('Error initializing database:', err);
    });
    // 同步导出db实例供测试直接使用
    module.exports.db = db;
  }
  return db;
};

module.exports.getDb = getDb;


// 初始化数据库表结构（返回Promise）
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const database = getDb();
    
    // 用户表
    database.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT,
        real_name TEXT,
        country TEXT DEFAULT '中国',
        id_type TEXT,
        id_number TEXT,
        verification_status TEXT DEFAULT '未通过',
        phone_number TEXT,
        email TEXT,
        phone_verified INTEGER DEFAULT 0,
        discount_type TEXT DEFAULT '成人',
        student_qualification TEXT,
        gender TEXT DEFAULT 'male',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TRIGGER IF NOT EXISTS users_set_id AFTER INSERT ON users
      WHEN NEW.id IS NULL BEGIN
        UPDATE users SET id = NEW.rowid WHERE rowid = NEW.rowid;
      END;
    `, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      // 订单表
      database.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          order_number TEXT UNIQUE,
          train_number TEXT,
          passenger_name TEXT,
          booking_date DATE,
          travel_date DATE,
          train_info TEXT,
          passenger_info TEXT,
          seat_info TEXT,
          price REAL,
          status TEXT DEFAULT '未完成',
          refund_fee REAL,
          refund_date DATE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        // 乘车人表
        database.run(`
          CREATE TABLE IF NOT EXISTS passengers (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            id_type TEXT NOT NULL,
            id_number TEXT NOT NULL,
            phone TEXT,
            verification_status TEXT DEFAULT '未通过',
            discount_type TEXT DEFAULT '成人',
            expiry_date DATE,
            birth_date DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(user_id, id_number)
          )
        `, (err) => {
          if (err) {
            reject(err);
            return;
          }

          // 车票表 (train_tickets) - 用于双模式查询
          database.run(`
            CREATE TABLE IF NOT EXISTS train_tickets (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              train_no TEXT,
              train_type TEXT,
              start_station TEXT,
              end_station TEXT,
              start_time TEXT,
              end_time TEXT,
              duration TEXT,
              date TEXT,
              swz_num TEXT,
              yd_num TEXT,
              ed_num TEXT,
              rw_num TEXT,
              yw_num TEXT,
              yz_num TEXT,
              wz_num TEXT
            )
          `, (err) => {
            if (err) {
              console.error('Error creating train_tickets table:', err);
            }
          });
          
          // 检查并添加gender字段（如果不存在）
          database.all("PRAGMA table_info(users)", (err, columns) => {
            if (err) {
              console.error('Error checking table info:', err);
              resolve();
              return;
            }
            
            const hasGenderColumn = columns.some(col => col.name === 'gender');
            if (!hasGenderColumn) {
              database.run("ALTER TABLE users ADD COLUMN gender TEXT DEFAULT 'male'", (err) => {
                if (err) {
                  console.error('Error adding gender column:', err);
                }
              });
            }

            const hasPasswordColumn = columns.some(col => col.name === 'password');
            if (!hasPasswordColumn) {
              database.run("ALTER TABLE users ADD COLUMN password TEXT", (err) => {
                if (err) {
                  console.error('Error adding password column:', err);
                }
              });
            }

            // Login Codes Table
            database.run(`
              CREATE TABLE IF NOT EXISTS login_codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone TEXT,
                identifier TEXT,
                code TEXT,
                createdAt INTEGER,
                valid INTEGER DEFAULT 1
              )
            `, (err) => {
               if (err) console.error('Error creating login_codes table:', err);
               database.run(`
                 CREATE TABLE IF NOT EXISTS stations (
                   id INTEGER PRIMARY KEY,
                   name TEXT,
                   city TEXT,
                   province TEXT
                 )
               `, (err) => {
                 if (err) console.error('Error creating stations table:', err);
                 database.run(`
                   CREATE TABLE IF NOT EXISTS trains (
                     id INTEGER PRIMARY KEY,
                     trainNumber TEXT,
                     fromStation TEXT,
                     toStation TEXT,
                     date TEXT,
                     isHighSpeed INTEGER
                   )
                 `, (err) => {
                   if (err) console.error('Error creating trains table:', err);
                   insertTestUser(database, reject, resolve);
                 });
               });
            });
          });
        });
      });
    });
  });
};

const insertTestTrainData = (database, resolve) => {
  // Insert test train data for the failing test
  const trainData = [
    {
      train_no: 'G108',
      train_type: '高铁',
      start_station: '上海虹桥',
      end_station: '北京南',
      start_time: '09:00',
      end_time: '13:00',
      duration: '4h00m',
      date: '2025-12-25',
      swz_num: '10',
      yd_num: '20',
      ed_num: '30',
      rw_num: '5',
      yw_num: '10',
      yz_num: '50',
      wz_num: '100'
    }
  ];
  
  // Check if train data already exists
  database.get('SELECT id FROM train_tickets WHERE train_no = ? AND date = ?', ['G108', '2025-12-25'], (err, row) => {
    if (err) {
      console.error('Error checking train data:', err);
      resolve();
      return;
    }
    
    if (!row) {
      const stmt = database.prepare(`
        INSERT INTO train_tickets (
          train_no, train_type, start_station, end_station, start_time, end_time, duration, date,
          swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const data = trainData[0];
      stmt.run([
        data.train_no, data.train_type, data.start_station, data.end_station,
        data.start_time, data.end_time, data.duration, data.date,
        data.swz_num, data.yd_num, data.ed_num, data.rw_num, data.yw_num, data.yz_num, data.wz_num
      ], (err) => {
        if (err) {
          console.error('Error inserting train data:', err);
        } else {
          console.log('Test train data created successfully');
        }
        stmt.finalize();
        resolve();
      });
    } else {
      resolve();
    }
  });
};

const insertTestUser = (database, reject, resolve) => {
  database.get('SELECT id FROM users WHERE id = ?', ['test-user-id'], (err, row) => {
    if (err) {
      reject(err);
      return;
    }
    
    if (!row) {
      database.run(`
        INSERT INTO users (
          id, username, real_name, country, id_type, id_number,
          verification_status, phone_number, email, phone_verified,
          discount_type, gender
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'test-user-id',
        'zhangsan',
        '张三',
        '中国',
        '身份证',
        '110101199001011234',
        '已通过',
        '13800138000',
        'zhangsan@example.com',
        1,
        '成人',
        'male'
      ], (err) => {
        if (err) {
          console.error('Error inserting test user:', err);
          // 不阻止数据库初始化，只记录错误
        } else {
          console.log('Test user created successfully');
        }
        // Insert test train data
        insertTestTrainData(database, resolve);
      });
    } else {
      // 如果用户已存在但gender为空，更新gender
      database.run("UPDATE users SET gender = 'male' WHERE id = 'test-user-id' AND (gender IS NULL OR gender = '')", (err) => {
        if (err) {
          console.error('Error updating user gender:', err);
        }
        // Insert test train data
        insertTestTrainData(database, resolve);
      });
    }
  });
};

// 执行查询（返回Promise）
const query = (sql, params = []) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!db) getDb();
      await initPromise;
      const database = getDb();
      database.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 执行单行查询（返回Promise）
const get = (sql, params = []) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!db) getDb();
      await initPromise;
      const database = getDb();
      database.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 执行更新/插入/删除（返回Promise）
const run = (sql, params = []) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!db) getDb();
      await initPromise;
      const database = getDb();
      database.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 关闭数据库连接（返回Promise）
const close = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          reject(err);
        } else {
          db = null;
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  getDb,
  query,
  all: query,
  get,
  run,
  waitForInit: () => {
    if (!db) getDb();
    return initPromise;
  },
  close,
  initializeDatabase
};

// 预先暴露db实例（在测试环境为内存库）
module.exports.db = getDb();
