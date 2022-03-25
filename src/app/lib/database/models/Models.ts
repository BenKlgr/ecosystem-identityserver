import { DataTypes, Model, ModelCtor, Utils } from 'sequelize';
import DatabaseManager from '../DatabaseManager';

export let User: ModelCtor<Model>;
export let SigninEntry: ModelCtor<Model>;

export async function defineModels() {
  User = DatabaseManager.getConnection().define(
    'User',
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
    },
    { timestamps: false }
  );

  SigninEntry = DatabaseManager.getConnection().define(
    'SignInEntry',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: {
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
    },
    { timestamps: false }
  );

  User.hasMany(SigninEntry);
  SigninEntry.belongsTo(User);

  await User.sync();
  await SigninEntry.sync();
}
