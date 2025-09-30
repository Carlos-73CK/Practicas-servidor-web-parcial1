/**
 * Entidad Usuario del dominio
 * Representa un usuario en el sistema de emprendimiento
 * Aplica principios de Domain-Driven Design
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly age: number,
    public readonly role: UserRole,
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validateUser();
  }

  /**
   * Validaciones de negocio para la entidad Usuario
   */
  private validateUser(): void {
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Email inválido');
    }
    
    if (!this.firstName || this.firstName.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!this.lastName || this.lastName.trim().length < 2) {
      throw new Error('El apellido debe tener al menos 2 caracteres');
    }
    
    if (this.age < 18 || this.age > 120) {
      throw new Error('La edad debe estar entre 18 y 120 años');
    }
  }

  /**
   * Validación de formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Verifica si el usuario es administrador
   */
  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * Crea una nueva instancia con campos actualizados
   */
  public updateWith(updates: Partial<Omit<User, 'id' | 'createdAt'>>): User {
    return new User(
      this.id,
      updates.email ?? this.email,
      updates.firstName ?? this.firstName,
      updates.lastName ?? this.lastName,
      updates.age ?? this.age,
      updates.role ?? this.role,
      updates.isActive ?? this.isActive,
      this.createdAt,
      new Date() // updatedAt siempre se actualiza
    );
  }

  /**
   * Convierte la entidad a objeto plano para serialización
   */
  public toJSON(): UserData {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      age: this.age,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Enumeración de roles de usuario
 */
export enum UserRole {
  ADMIN = 'admin',
  ENTREPRENEUR = 'entrepreneur',
  INVESTOR = 'investor',
  MENTOR = 'mentor',
  USER = 'user'
}

/**
 * Tipo para los datos del usuario (sin métodos)
 */
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tipo para crear un nuevo usuario (sin id, createdAt, updatedAt)
 */
export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  role: UserRole;
  isActive?: boolean;
}