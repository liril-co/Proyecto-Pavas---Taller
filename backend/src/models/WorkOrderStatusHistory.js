module.exports = (sequelize, DataTypes) => {
  const WorkOrderStatusHistory = sequelize.define('WorkOrderStatusHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fromStatus: {
      type: DataTypes.ENUM('RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA'),
      allowNull: true,
    },
    toStatus: {
      type: DataTypes.ENUM('RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA'),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    changedByUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'work_order_status_histories',
    updatedAt: false,
  });

  WorkOrderStatusHistory.associate = (models) => {
    WorkOrderStatusHistory.belongsTo(models.WorkOrder, {
      foreignKey: 'workOrderId',
      as: 'workOrder',
    });
    WorkOrderStatusHistory.belongsTo(models.User, {
      foreignKey: 'changedByUserId',
      as: 'changedByUser',
      attributes: ['id', 'name', 'email'],
    });
  };

  return WorkOrderStatusHistory;
};
