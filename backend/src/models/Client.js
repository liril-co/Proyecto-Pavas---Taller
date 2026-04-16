module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre del cliente es obligatorio',
        },
        len: {
          args: [3, 100],
          msg: 'El nombre debe tener entre 3 y 100 caracteres',
        },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El teléfono es obligatorio',
        },
        isNumeric: {
          msg: 'El teléfono debe contener solo números',
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Email debe ser válido',
        },
      },
    },
  }, {
    timestamps: true,
    tableName: 'clients',
  });

  Client.associate = (models) => {
    Client.hasMany(models.Bike, {
      foreignKey: 'clientId',
      as: 'bikes',
      onDelete: 'CASCADE',
    });
  };

  return Client;
};
