'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('work_order_status_histories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      workOrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'work_orders',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      fromStatus: {
        type: Sequelize.ENUM('RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA'),
        allowNull: true,
      },
      toStatus: {
        type: Sequelize.ENUM('RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA'),
        allowNull: false,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      changedByUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Índice para optimizar consultas
    await queryInterface.addIndex(
      'work_order_status_histories',
      ['workOrderId', 'createdAt'],
      { name: 'work_order_id_created_at_index' }
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('work_order_status_histories');
  },
};
