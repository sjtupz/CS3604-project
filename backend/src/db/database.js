// SQLite数据库连接配置
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径（测试环境使用内存数据库）
const DB_PATH = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : path.join(__dirname, '../../data/12306.db');

let db = null;

// 获取数据库连接
const getDb = () => {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database.');
        // 初始化数据库（异步，但不阻塞）
        initializeDatabase().catch(err => {
          console.error('Error initializing database:', err);
        });
      }
    });
  }
  return db;
};

// 初始化数据库表结构（返回Promise）
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const database = getDb();
    
    // 用户表
    database.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
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
      )
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
            
            // 插入测试用户（如果不存在）
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
                  resolve();
                });
              } else {
                // 如果用户已存在但gender为空，更新gender
                database.run("UPDATE users SET gender = 'male' WHERE id = 'test-user-id' AND (gender IS NULL OR gender = '')", (err) => {
                  if (err) {
                    console.error('Error updating user gender:', err);
                  }
                  resolve();
                });
              }
            });
          });
        });
      });
    });
  });
};

// 执行查询（返回Promise）
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const database = getDb();
    database.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// 执行单行查询（返回Promise）
const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const database = getDb();
    database.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// 执行更新（返回Promise）
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const database = getDb();
    database.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
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
  get,
  run,
  close,
  initializeDatabase
};

