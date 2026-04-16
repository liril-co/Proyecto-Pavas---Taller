'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE work_orders MODIFY COLUMN status ENUM('RECIBIDA','DIAGNOSTICO','EN_PROCESO','LISTA','ENTREGADA','CANCELADA') NOT NULL DEFAULT 'RECIBIDA'"
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE work_orders MODIFY COLUMN status ENUM('PENDIENTE','EN_PROGRESO','COMPLETADA','CANCELADA') NOT NULL DEFAULT 'PENDIENTE'"
    );
  },
};
