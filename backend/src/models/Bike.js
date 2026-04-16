module.exports = (sequelize, DataTypes) => {
  const Bike = sequelize.define('Bike', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plate: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        msg: 'La placa ya existe en el sistema',
      },
      validate: {
        notEmpty: {
          msg: 'La placa es obligatoria',
        },
      },
    },
    brand: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La marca es obligatoria',
        },
      },
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El modelo es obligatorio',
        },
      },
    },
    cylinder: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El cliente es obligatorio',
        },
      },
    },
  }, {
    timestamps: true,
    tableName: 'bikes',
  });

  Bike.associate = (models) => {
    Bike.belongsTo(models.Client, {
      foreignKey: 'clientId',
      as: 'client',
    });

    Bike.hasMany(models.WorkOrder, {
      foreignKey: 'motoId',
      as: 'workOrders',
      onDelete: 'CASCADE',
    });
  };

  return Bike;
};
