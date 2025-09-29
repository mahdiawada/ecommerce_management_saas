import config  from '../../config';
import { Pool } from 'pg';

export class ConnectionManager {
    public static pool: Pool;
    public static async getConnection() {
        if (!ConnectionManager.pool) {
            ConnectionManager.pool = new Pool({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
                port: config.db_port
            });
        }
        return ConnectionManager.pool;
    }
}