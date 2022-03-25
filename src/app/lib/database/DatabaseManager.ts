import { Sequelize } from 'sequelize';
import { connectionString } from '../../../config/database.secretconfig.json';
import { log } from '../../../util/Logger';
import { defineModels } from './models/Models';

export default class DatabaseManager {
  private static Connection: Sequelize;

  static async connectDatabase(): Promise<any> {
    this.Connection = new Sequelize(connectionString, { logging: false });
    try {
      await this.Connection.authenticate();
      log('Connected to the database', 'info');
      this.loadModels();
    } catch (error) {
      console.log(error);
      log(`Failed connecting to the database with '${connectionString}'`, 'error', false);
    }
  }

  static getConnection(): Sequelize {
    return DatabaseManager.Connection;
  }

  private static loadModels() {
    log('Loading Database models.');
    defineModels();
  }
}
