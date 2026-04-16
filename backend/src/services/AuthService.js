const jwt = require('jsonwebtoken');
const db = require('../models');

class AuthService {
  signToken(user, expiresIn = null) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || '15m' }
    );
  }

  async createRefreshToken(userId) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

    const refreshToken = jwt.sign(
      { sub: userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await db.RefreshToken.create({
      userId,
      token: refreshToken,
      expiresAt,
    });

    return refreshToken;
  }

  async register(payload, currentUser) {
    const usersCount = await db.User.count();

    if (usersCount > 0) {
      if (!currentUser || currentUser.role !== 'ADMIN') {
        const err = new Error('Solo un usuario ADMIN puede crear nuevos usuarios');
        err.statusCode = 403;
        throw err;
      }
    }

    const role = usersCount === 0 ? 'ADMIN' : (payload.role || 'MECANICO');

    const user = await db.User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role,
      isActive: true,
    });

    const accessToken = this.signToken(user, '15m');
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
      bootstrapAdmin: usersCount === 0,
    };
  }

  async login(email, password) {
    const user = await db.User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      const err = new Error('Credenciales invalidas');
      err.statusCode = 401;
      throw err;
    }

    if (!user.isActive) {
      const err = new Error('Usuario inactivo');
      err.statusCode = 403;
      throw err;
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      const err = new Error('Credenciales invalidas');
      err.statusCode = 401;
      throw err;
    }

    const accessToken = this.signToken(user, '15m');
    const refreshToken = await this.createRefreshToken(user.id);
    user.password = undefined;

    return { user, accessToken, refreshToken };
  }

  async refresh(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const userId = decoded.sub;

      // Verificar que el refresh token existe y no ha sido revocado
      const storedToken = await db.RefreshToken.findOne({
        where: {
          userId,
          token: refreshToken,
          revokedAt: null,
        },
      });

      if (!storedToken || new Date() > storedToken.expiresAt) {
        const err = new Error('Refresh token inválido o expirado');
        err.statusCode = 401;
        throw err;
      }

      const user = await db.User.findByPk(userId);
      if (!user || !user.isActive) {
        const err = new Error('Usuario no encontrado o inactivo');
        err.statusCode = 401;
        throw err;
      }

      const newAccessToken = this.signToken(user, '15m');
      return { user, accessToken: newAccessToken };
    } catch (error) {
      if (error.statusCode) throw error;
      const err = new Error('Refresh token inválido');
      err.statusCode = 401;
      throw err;
    }
  }

  async logout(userId, refreshToken) {
    // Revocar el refresh token
    const token = await db.RefreshToken.findOne({
      where: {
        userId,
        token: refreshToken,
      },
    });

    if (token) {
      await token.update({ revokedAt: new Date() });
    }

    return { success: true };
  }

  async me(userId) {
    const user = await db.User.findByPk(userId);
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }

  async listUsers() {
    return db.User.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async updateUserByAdmin(id, payload, currentUserId) {
    const user = await db.User.findByPk(id);
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.statusCode = 404;
      throw err;
    }

    if (Number(currentUserId) === Number(id) && payload.isActive === false) {
      const err = new Error('No puedes desactivar tu propio usuario');
      err.statusCode = 400;
      throw err;
    }

    const updateData = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.role !== undefined) updateData.role = payload.role;
    if (payload.isActive !== undefined) updateData.isActive = payload.isActive;
    if (payload.password) updateData.password = payload.password;

    await user.update(updateData);
    return db.User.findByPk(id);
  }
}

module.exports = new AuthService();
