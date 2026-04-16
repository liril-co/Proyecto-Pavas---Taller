'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bikes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      plate: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      brand: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      cylinder: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('bikes', ['plate']);
    await queryInterface.addIndex('bikes', ['clientId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bikes');
  },
};
