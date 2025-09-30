import { IUserRepository } from '../domain/interfaces/IUserRepository';
import { User, CreateUserData, UserRole } from '../domain/entities/User';
import { CreateCallback } from '../domain/interfaces/IRepository';

/**
 * Servicio de aplicación para gestión de usuarios
 * Orquesta las operaciones del dominio y coordina con los repositorios
 * Implementa el principio de responsabilidad única (SRP)
 */
export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * CREATE - Crear nuevo usuario usando callbacks
   * Valida y delega la creación al repositorio
   */
  createUser(userData: CreateUserData, callback: CreateCallback<User>): void {
    try {
      // Validaciones de negocio adicionales
      this.validateCreateUserData(userData);
      
      // Delegar al repositorio
      this.userRepository.create(userData, (error, result) => {
        if (error) {
          callback(new Error(`Error en servicio al crear usuario: ${error.message}`));
          return;
        }
        
        if (!result) {
          callback(new Error('Error inesperado: usuario no creado'));
          return;
        }
        
        callback(null, result);
      });
      
    } catch (error) {
      callback(error as Error);
    }
  }

  /**
   * READ - Obtener usuario por ID usando async/await
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID de usuario requerido');
      }
      
      return await this.userRepository.findById(id);
      
    } catch (error) {
      throw new Error(`Error en servicio al obtener usuario: ${(error as Error).message}`);
    }
  }

  /**
   * READ - Obtener todos los usuarios usando async/await
   */
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw new Error(`Error en servicio al obtener usuarios: ${(error as Error).message}`);
    }
  }

  /**
   * READ - Obtener usuarios activos
   */
  async getActiveUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findActiveUsers();
    } catch (error) {
      throw new Error(`Error en servicio al obtener usuarios activos: ${(error as Error).message}`);
    }
  }

  /**
   * READ - Obtener usuarios por rol
   */
  async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      return await this.userRepository.findByRole(role);
    } catch (error) {
      throw new Error(`Error en servicio al obtener usuarios por rol: ${(error as Error).message}`);
    }
  }

  /**
   * UPDATE - Actualizar usuario usando promises
   */
  updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    return new Promise((resolve, reject) => {
      try {
        // Validaciones de negocio
        if (!id || id.trim() === '') {
          reject(new Error('ID de usuario requerido para actualización'));
          return;
        }

        if (!updates || Object.keys(updates).length === 0) {
          reject(new Error('Datos de actualización requeridos'));
          return;
        }

        // Delegar al repositorio
        this.userRepository.update(id, updates)
          .then(result => {
            if (!result) {
              reject(new Error('Usuario no encontrado para actualización'));
              return;
            }
            resolve(result);
          })
          .catch(error => {
            reject(new Error(`Error en servicio al actualizar usuario: ${error.message}`));
          });
          
      } catch (error) {
        reject(new Error(`Error en validación de actualización: ${(error as Error).message}`));
      }
    });
  }

  /**
   * DELETE - Eliminar usuario usando async/await
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID de usuario requerido para eliminación');
      }

      // Verificar que el usuario existe antes de eliminar
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        return false; // Usuario no encontrado
      }

      // Validación de negocio: no eliminar administradores
      if (existingUser.isAdmin()) {
        throw new Error('No se puede eliminar usuarios administradores');
      }

      return await this.userRepository.delete(id);
      
    } catch (error) {
      throw new Error(`Error en servicio al eliminar usuario: ${(error as Error).message}`);
    }
  }

  /**
   * Buscar usuario por email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      if (!email || email.trim() === '') {
        throw new Error('Email requerido para búsqueda');
      }
      
      return await this.userRepository.findByEmail(email);
      
    } catch (error) {
      throw new Error(`Error en servicio al buscar usuario por email: ${(error as Error).message}`);
    }
  }

  /**
   * Validaciones específicas para datos de creación
   */
  private validateCreateUserData(userData: CreateUserData): void {
    if (!userData) {
      throw new Error('Datos de usuario requeridos');
    }

    if (!userData.email || userData.email.trim() === '') {
      throw new Error('Email es requerido');
    }

    if (!userData.firstName || userData.firstName.trim() === '') {
      throw new Error('Nombre es requerido');
    }

    if (!userData.lastName || userData.lastName.trim() === '') {
      throw new Error('Apellido es requerido');
    }

    if (!userData.role) {
      throw new Error('Rol de usuario es requerido');
    }

    // Validar que el rol sea válido
    if (!Object.values(UserRole).includes(userData.role)) {
      throw new Error(`Rol inválido: ${userData.role}`);
    }
  }

  /**
   * Obtener estadísticas de usuarios
   */
  async getUserStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
  }> {
    try {
      const allUsers = await this.getAllUsers();
      const activeUsers = allUsers.filter(user => user.isActive);
      
      const byRole = allUsers.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: allUsers.length,
        active: activeUsers.length,
        inactive: allUsers.length - activeUsers.length,
        byRole
      };
      
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas: ${(error as Error).message}`);
    }
  }
}