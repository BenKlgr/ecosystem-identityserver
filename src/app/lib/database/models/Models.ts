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

  declare getSignInEntries: HasManyGetAssociationsMixin<SignInEntry>;

  public declare static associations: { signInEntries: Association<User, SignInEntry> };

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class SignInEntry extends Model<
  InferAttributes<SignInEntry, {}>,
  InferCreationAttributes<SignInEntry, {}>
> {
  declare id: CreationOptional<number>;

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

  SignInEntry.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    { sequelize, modelName: 'SignInEntry' }
  );

  User.hasMany(SignInEntry, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'signInEntries',
  });

  await sequelize.sync();
}
