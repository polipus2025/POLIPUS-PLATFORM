import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('agritrace360.db');

// Initialize local database for offline functionality
export const initializeDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        // GPS Boundaries table
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS gps_boundaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farm_id TEXT,
            boundary_points TEXT,
            area_hectares REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            synced INTEGER DEFAULT 0
          );
        `);

        // GPS Points table
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS gps_points (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            latitude REAL,
            longitude REAL,
            accuracy REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            metadata TEXT,
            synced INTEGER DEFAULT 0
          );
        `);

        // Commodities table
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS commodities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            qr_code TEXT UNIQUE,
            name TEXT,
            quantity REAL,
            quality_grade TEXT,
            farm_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            synced INTEGER DEFAULT 0
          );
        `);

        // Offline actions queue
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS offline_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action_type TEXT,
            data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            retry_count INTEGER DEFAULT 0
          );
        `);

        // User profile cache
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS user_cache (
            key TEXT PRIMARY KEY,
            value TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);
      },
      (error) => {
        console.error('Database initialization failed:', error);
        reject(error);
      },
      () => {
        console.log('Database initialized successfully');
        resolve();
      }
    );
  });
};

// GPS Boundaries operations
export const gpsDB = {
  saveBoundary: (farmId: string, boundaryPoints: any[], areaHectares: number): Promise<number> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO gps_boundaries (farm_id, boundary_points, area_hectares) VALUES (?, ?, ?)',
          [farmId, JSON.stringify(boundaryPoints), areaHectares],
          (_, result) => resolve(result.insertId!),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },

  getBoundaries: (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM gps_boundaries ORDER BY created_at DESC',
          [],
          (_, result) => {
            const boundaries = [];
            for (let i = 0; i < result.rows.length; i++) {
              const row = result.rows.item(i);
              boundaries.push({
                ...row,
                boundary_points: JSON.parse(row.boundary_points)
              });
            }
            resolve(boundaries);
          },
          (_, error) => { reject(error); return false; }
        );
      });
    });
  }
};

// GPS Points operations
export const gpsPointsDB = {
  savePoint: (latitude: number, longitude: number, accuracy: number, metadata: any = {}): Promise<number> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO gps_points (latitude, longitude, accuracy, metadata) VALUES (?, ?, ?, ?)',
          [latitude, longitude, accuracy, JSON.stringify(metadata)],
          (_, result) => resolve(result.insertId!),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },

  getPoints: (limit: number = 100): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM gps_points ORDER BY timestamp DESC LIMIT ?',
          [limit],
          (_, result) => {
            const points = [];
            for (let i = 0; i < result.rows.length; i++) {
              const row = result.rows.item(i);
              points.push({
                ...row,
                metadata: JSON.parse(row.metadata || '{}')
              });
            }
            resolve(points);
          },
          (_, error) => { reject(error); return false; }
        );
      });
    });
  }
};

// Commodities operations
export const commoditiesDB = {
  saveCommodity: (qrCode: string, name: string, quantity: number, qualityGrade: string, farmId: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT OR REPLACE INTO commodities (qr_code, name, quantity, quality_grade, farm_id) VALUES (?, ?, ?, ?, ?)',
          [qrCode, name, quantity, qualityGrade, farmId],
          (_, result) => resolve(result.insertId!),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },

  getCommodities: (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM commodities ORDER BY created_at DESC',
          [],
          (_, result) => {
            const commodities = [];
            for (let i = 0; i < result.rows.length; i++) {
              commodities.push(result.rows.item(i));
            }
            resolve(commodities);
          },
          (_, error) => { reject(error); return false; }
        );
      });
    });
  }
};

// Offline queue operations
export const offlineQueueDB = {
  addAction: (actionType: string, data: any): Promise<number> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO offline_queue (action_type, data) VALUES (?, ?)',
          [actionType, JSON.stringify(data)],
          (_, result) => resolve(result.insertId!),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },

  getPendingActions: (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM offline_queue ORDER BY created_at ASC',
          [],
          (_, result) => {
            const actions = [];
            for (let i = 0; i < result.rows.length; i++) {
              const row = result.rows.item(i);
              actions.push({
                ...row,
                data: JSON.parse(row.data)
              });
            }
            resolve(actions);
          },
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },

  removeAction: (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM offline_queue WHERE id = ?',
          [id],
          () => resolve(),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  }
};

export default db;