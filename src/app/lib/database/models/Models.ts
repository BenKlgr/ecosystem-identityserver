import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Utils,
} from '@sequelize/core';
import DatabaseManager from '../DatabaseManager';

export class User extends Model<
  InferAttributes<User, {}>,
  InferCreationAttributes<User, {}>
> {
  declare id: CreationOptional<number>;

  declare username: string;
  declare email: string;
  declare password: string;

  declare firstname: string;
  declare lastname: string;
  declare birthday: Date;

  declare getTokenUseHistroyEntries: HasManyGetAssociationsMixin<TokenUseHistory>;

  public declare static associations: {
    tokenUseHistoryEntries: Association<User, TokenUseHistory>;
  };

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class TokenUseHistory extends Model<
  InferAttributes<TokenUseHistory, {}>,
  InferCreationAttributes<TokenUseHistory, {}>
> {
  declare id: CreationOptional<number>;

  declare token: string;

  declare timestamp: Date;
  declare location: string;
  declare address: string;
  declare agent: string;

  declare userId: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export async function defineModels() {
  const sequelize = DatabaseManager.getConnection();
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'User' }
  );

  TokenUseHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: Utils.now,
      },
      location: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      agent: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'TokenUseHistory' }
  );

  User.hasMany(TokenUseHistory, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'tokenUseHistoryEntries',
  });

  await sequelize.sync();
}
