const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre es obligatorio' },
        len: { args: [3, 100], msg: 'El nombre debe tener entre 3 y 100 caracteres' },
      },
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: { msg: 'El email ya existe en el sistema' },
      validate: {
        isEmail: { msg: 'Email invalido' },
        notEmpty: { msg: 'El email es obligatorio' },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La contraseña es obligatoria' },
        len: { args: [6, 255], msg: 'La contraseña debe tener al menos 6 caracteres' },
      },
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'MECANICO'),
      allowNull: false,
      defaultValue: 'MECANICO',
      validate: {
        isIn: {
          args: [['ADMIN', 'MECANICO']],
          msg: 'Rol no valido',
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    timestamps: true,
    tableName: 'users',
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  });

  User.prototype.comparePassword = async function comparePassword(rawPassword) {
    return bcrypt.compare(rawPassword, this.password);
  };

  User.associate = (models) => {
    User.hasMany(models.RefreshToken, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return User;
};
