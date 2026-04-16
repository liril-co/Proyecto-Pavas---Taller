module.exports = (sequelize, DataTypes) => {
  const WorkOrder = sequelize.define('WorkOrder', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    motoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La moto es obligatoria',
        },
      },
    },
    entryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    faultDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La descripción de la falla es obligatoria',
        },
      },
    },
    status: {
      type: DataTypes.ENUM('RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA'),
      allowNull: false,
      defaultValue: 'RECIBIDA',
      validate: {
        isIn: {
          args: [['RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA']],
          msg: 'Estado no válido',
        },
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: {
          args: [0],
          msg: 'El total no puede ser negativo',
        },
      },
    },
  }, {
    timestamps: true,
    tableName: 'work_orders',
  });

  WorkOrder.associate = (models) => {
    WorkOrder.belongsTo(models.Bike, {
      foreignKey: 'motoId',
      as: 'moto',
    });

    WorkOrder.hasMany(models.WorkOrderItem, {
      foreignKey: 'workOrderId',
      as: 'items',
      onDelete: 'CASCADE',
    });
  };

  return WorkOrder;
};
