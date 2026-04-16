const AuthService = require('../services/AuthService');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body, req.user);
      return res.status(201).json({
        success: true,
        message: result.bootstrapAdmin
          ? 'Usuario ADMIN inicial creado correctamente'
          : 'Usuario creado correctamente',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body.email, req.body.password);
      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        const err = new Error('Refresh token requerido');
        err.statusCode = 400;
        throw err;
      }

      const result = await AuthService.refresh(refreshToken);
      return res.status(200).json({
        success: true,
        message: 'Token renovado correctamente',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        const err = new Error('Refresh token requerido');
        err.statusCode = 400;
        throw err;
      }

      await AuthService.logout(req.user.sub, refreshToken);
      return res.status(200).json({
        success: true,
        message: 'Sesión cerrada correctamente',
      });
    } catch (error) {
      return next(error);
    }
  }

  async me(req, res, next) {
    try {
      const user = await AuthService.me(req.user.sub);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }

  async listUsers(req, res, next) {
    try {
      const users = await AuthService.listUsers();
      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateUserByAdmin(req, res, next) {
    try {
      const user = await AuthService.updateUserByAdmin(req.params.id, req.body, req.user.sub);
      return res.status(200).json({
        success: true,
        message: 'Usuario actualizado correctamente',
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AuthController();
