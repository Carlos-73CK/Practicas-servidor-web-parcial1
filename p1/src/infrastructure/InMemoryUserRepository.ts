import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../domain/interfaces/IUserRepository';
import { User, UserRole, CreateUserData } from '../domain/entities/User';
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
          userData.email,
          userData.firstName,
          userData.lastName,
          userData.age,
          userData.role,
          userData.isActive ?? true
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
      
      const user = this.users.find(user => user.id === id);
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
          const userIndex = this.users.findIndex(user => user.id === id);
          
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
      
      const userIndex = this.users.findIndex(user => user.id === id);
      
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
   * Buscar usuarios por rol
   */
  async findByRole(role: string): Promise<User[]> {
    try {
      await this.simulateAsyncOperation();
      
      return this.users.filter(user => user.role === role);
      
    } catch (error) {
      throw new Error(`Error al buscar usuarios por rol: ${error}`);
    }
  }

  /**
   * Buscar usuarios activos
   */
  async findActiveUsers(): Promise<User[]> {
    try {
      await this.simulateAsyncOperation();
      
      return this.users.filter(user => user.isActive);
      
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
        email: 'admin@emprendimiento.com',
        firstName: 'María',
        lastName: 'González',
        age: 35,
        role: UserRole.ADMIN
      },
      {
        email: 'carlos.martinez@startup.com',
        firstName: 'Carlos',
        lastName: 'Martínez',
        age: 28,
        role: UserRole.ENTREPRENEUR
      },
      {
        email: 'ana.rodriguez@ventures.com',
        firstName: 'Ana',
        lastName: 'Rodríguez',
        age: 42,
        role: UserRole.INVESTOR
      },
      {
        email: 'luis.torres@mentor.com',
        firstName: 'Luis',
        lastName: 'Torres',
        age: 50,
        role: UserRole.MENTOR
      },
      {
        email: 'sofia.lopez@innovacion.com',
        firstName: 'Sofía',
        lastName: 'López',
        age: 26,
        role: UserRole.ENTREPRENEUR
      },
      {
        email: 'diego.herrera@capital.com',
        firstName: 'Diego',
        lastName: 'Herrera',
        age: 38,
        role: UserRole.INVESTOR
      },
      {
        email: 'patricia.silva@coaching.com',
        firstName: 'Patricia',
        lastName: 'Silva',
        age: 45,
        role: UserRole.MENTOR
      },
      {
        email: 'miguel.castro@tech.com',
        firstName: 'Miguel',
        lastName: 'Castro',
        age: 31,
        role: UserRole.ENTREPRENEUR
      },
      {
        email: 'carmen.ruiz@user.com',
        firstName: 'Carmen',
        lastName: 'Ruiz',
        age: 29,
        role: UserRole.USER
      },
      {
        email: 'fernando.ortiz@business.com',
        firstName: 'Fernando',
        lastName: 'Ortiz',
        age: 33,
        role: UserRole.ENTREPRENEUR
      },
      {
        email: 'isabella.vargas@invest.com',
        firstName: 'Isabella',
        lastName: 'Vargas',
        age: 40,
        role: UserRole.INVESTOR,
        isActive: false // Usuario inactivo para pruebas
      }
    ];

    // Crear usuarios sincrónicamente para datos iniciales
    testUsers.forEach(userData => {
      try {
        const user = new User(
          uuidv4(),
          userData.email,
          userData.firstName,
          userData.lastName,
          userData.age,
          userData.role,
          userData.isActive ?? true
        );
        this.users.push(user);
      } catch (error) {
        console.error(`Error creando usuario de prueba: ${error}`);
      }
    });
  }
}