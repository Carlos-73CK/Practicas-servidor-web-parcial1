import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../domain/interfaces/IUserRepository';
import { User, UserStatus, CreateUserData } from '../domain/entities/User';
import { CreateCallback } from '../domain/interfaces/IRepository';

/**
 * Implementación en memoria del repositorio de usuarios
 * Simula una base de datos usando un array
 * Implementa todos los paradigmas asíncronos requeridos
 */
export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  constructor() {
    this.initializeTestData();
  }

  /**
   * CREATE - Implementado con CALLBACKS
   * Simula latencia de red y validaciones
   */
  create(userData: CreateUserData, callback: CreateCallback<User>): void {
    // Simular latencia de red (500-1500ms)
    const latency = Math.random() * 1000 + 500;
    
    setTimeout(() => {
      try {
        // Validar que el email no exista
        const existingUser = this.users.find(user => user.email === userData.email);
        if (existingUser) {
          return callback(new Error(`El email ${userData.email} ya está registrado`));
        }

        // Crear nuevo usuario con ID único
        const newUser = new User(
          uuidv4(),
          userData.nombres,
          userData.email,
          userData.contraseña,
          userData.estado ?? UserStatus.ACTIVO
        );

        // Agregar a la "base de datos"
        this.users.push(newUser);
        
        // Callback exitoso
        callback(null, newUser);
        
      } catch (error) {
        // Manejo de errores de validación
        callback(error as Error);
      }
    }, latency);
  }

  /**
   * READ - Implementado con ASYNC/AWAIT
   * Buscar usuario por ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      // Simular operación asíncrona
      await this.simulateAsyncOperation();
      
      const user = this.users.find(user => user.id_usuario === id);
      return user || null;
      
    } catch (error) {
      throw new Error(`Error al buscar usuario por ID: ${error}`);
    }
  }

  /**
   * READ - Implementado con ASYNC/AWAIT
   * Obtener todos los usuarios
   */
  async findAll(): Promise<User[]> {
    try {
      // Simular operación asíncrona
      await this.simulateAsyncOperation();
      
      // Retornar copia del array para evitar mutaciones externas
      return [...this.users];
      
    } catch (error) {
      throw new Error(`Error al obtener todos los usuarios: ${error}`);
    }
  }

  /**
   * UPDATE - Implementado con PROMISES
   * Actualizar usuario existente
   */
  update(id: string, updates: Partial<User>): Promise<User | null> {
    return new Promise((resolve, reject) => {
      // Simular latencia de base de datos
      setTimeout(() => {
        try {
          const userIndex = this.users.findIndex(user => user.id_usuario === id);
          
          if (userIndex === -1) {
            reject(new Error(`Usuario con ID ${id} no encontrado`));
            return;
          }

          const currentUser = this.users[userIndex]!;
          
          // Crear usuario actualizado manteniendo la integridad
          const updatedUser = currentUser.updateWith(updates);
          
          // Reemplazar en el array
          this.users[userIndex] = updatedUser;
          
          resolve(updatedUser);
          
        } catch (error) {
          reject(new Error(`Error al actualizar usuario: ${error}`));
        }
      }, Math.random() * 500 + 200);
    });
  }

  /**
   * DELETE - Implementado con ASYNC/AWAIT
   * Eliminar usuario (eliminación física)
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Simular operación asíncrona
      await this.simulateAsyncOperation();
      
      const userIndex = this.users.findIndex(user => user.id_usuario === id);
      
      if (userIndex === -1) {
        return false; // Usuario no encontrado
      }

      // Eliminar usuario del array
      this.users.splice(userIndex, 1);
      return true;
      
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error}`);
    }
  }

  /**
   * Buscar usuario por email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      await this.simulateAsyncOperation();
      
      const user = this.users.find(user => user.email === email);
      return user || null;
      
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error}`);
    }
  }

  /**
   * Buscar usuarios por estado
   */
  async findByEstado(estado: string): Promise<User[]> {
    try {
      await this.simulateAsyncOperation();
      
      return this.users.filter(user => user.estado === estado);
      
    } catch (error) {
      throw new Error(`Error al buscar usuarios por estado: ${error}`);
    }
  }

  /**
   * Buscar usuarios activos
   */
  async findActiveUsers(): Promise<User[]> {
    try {
      await this.simulateAsyncOperation();
      
      return this.users.filter(user => user.isActive());
      
    } catch (error) {
      throw new Error(`Error al buscar usuarios activos: ${error}`);
    }
  }

  /**
   * Simula operación asíncrona con latencia variable
   */
  private simulateAsyncOperation(): Promise<void> {
    return new Promise((resolve) => {
      const latency = Math.random() * 300 + 100; // 100-400ms
      setTimeout(resolve, latency);
    });
  }

  /**
   * Inicializa datos de prueba (mínimo 10 registros realistas)
   */
  private initializeTestData(): void {
    const testUsers: CreateUserData[] = [
      {
        nombres: 'María González Admin',
        email: 'maria.gonzalez@sistema.com',
        contraseña: 'admin123456',
        estado: UserStatus.ACTIVO
      },
      {
        nombres: 'Carlos Martínez López',
        email: 'carlos.martinez@empresa.com',
        contraseña: 'carlos123456',
        estado: UserStatus.ACTIVO
      },
      {
        nombres: 'Ana Sofía Rodríguez',
        email: 'ana.rodriguez@negocio.com',
        contraseña: 'ana123456',
        estado: UserStatus.ACTIVO
      },
      {
        nombres: 'Luis Fernando Torres',
        email: 'luis.torres@consulta.com',
        contraseña: 'luis123456',
        estado: UserStatus.ACTIVO
      },
      {
        nombres: 'Sofía Elena López',
        email: 'sofia.lopez@startup.com',
        contraseña: 'sofia123456',
        estado: UserStatus.ACTIVO
      },
      {
        nombres: 'Diego Alejandro Herrera',
        email: 'diego.herrera@inversion.com',
        contraseña: 'diego123456',
        estado: UserStatus.ACTIVO
      },
      {
        nombres: 'Patricia Silva Morales',
        email: 'patricia.silva@mentor.com',
        contraseña: 'patricia123456',
        estado: UserStatus.ACTIVO
      },
      {
        nombres: 'Miguel Ángel Castro',
        email: 'miguel.castro@tech.com',
        contraseña: 'miguel123456',
        estado: UserStatus.ACTIVO
      },
      {
        nombres: 'Carmen Beatriz Ruiz',
        email: 'carmen.ruiz@usuario.com',
        contraseña: 'carmen123456',
        estado: UserStatus.ACTIVO
      },
      {
        nombres: 'Fernando José Ortiz',
        email: 'fernando.ortiz@empresa.com',
        contraseña: 'fernando123456',
        estado: UserStatus.ACTIVO
      },
      {
        nombres: 'Isabella Vargas Pérez',
        email: 'isabella.vargas@prueba.com',
        contraseña: 'isabella123456',
        estado: UserStatus.INACTIVO // Usuario inactivo para pruebas
      }
    ];

    // Crear usuarios sincrónicamente para datos iniciales
    testUsers.forEach(userData => {
      try {
        const user = new User(
          uuidv4(),
          userData.nombres,
          userData.email,
          userData.contraseña,
          userData.estado ?? UserStatus.ACTIVO
        );
        this.users.push(user);
      } catch (error) {
        console.error(`Error creando usuario de prueba: ${error}`);
      }
    });
  }
}