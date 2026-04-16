module.exports = (sequelize, DataTypes) => {
  const WorkOrderItem = sequelize.define('WorkOrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('MANO_OBRA', 'REPUESTO'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['MANO_OBRA', 'REPUESTO']],
          msg: 'Tipo de ítem no válido',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La descripción es obligatoria',
        },
      },
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [1],
          msg: 'La cantidad debe ser mayor a 0',
        },
      },
    },
    unitValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'El valor unitario debe ser >= 0',
        },
      },
    },
  }, {
    timestamps: true,
    tableName: 'work_order_items',
  });

  WorkOrderItem.associate = (models) => {
    WorkOrderItem.belongsTo(models.WorkOrder, {
      foreignKey: 'workOrderId',
      as: 'workOrder',
    });
  };

  return WorkOrderItem;
};
