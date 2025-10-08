/**
 * Entidad Usuario del dominio
 * Representa un usuario en el sistema
 * Aplica principios de Domain-Driven Design
 */
export class User {
  constructor(
    public readonly id_usuario: string,
    public readonly nombres: string,
    public readonly email: string,
    public readonly contraseña: string,
    public readonly estado: UserStatus = UserStatus.ACTIVO
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
    
    if (!this.nombres || this.nombres.trim().length < 2) {
      throw new Error('Los nombres deben tener al menos 2 caracteres');
    }
    
    if (!this.contraseña || this.contraseña.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
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
   * Obtiene los nombres del usuario
   */
  public getNombres(): string {
    return this.nombres;
  }

  /**
   * Verifica si el usuario está activo
   */
  public isActive(): boolean {
    return this.estado === UserStatus.ACTIVO;
  }

  /**
   * Crea una nueva instancia con campos actualizados
   */
  public updateWith(updates: Partial<Omit<User, 'id_usuario'>>): User {
    return new User(
      this.id_usuario,
      updates.nombres ?? this.nombres,
      updates.email ?? this.email,
      updates.contraseña ?? this.contraseña,
      updates.estado ?? this.estado
    );
  }

  /**
   * Convierte la entidad a objeto plano para serialización
   */
  public toJSON(): UserData {
    return {
      id_usuario: this.id_usuario,
      nombres: this.nombres,
      email: this.email,
      contraseña: this.contraseña,
      estado: this.estado
    };
  }

  /**
   * Obtiene una versión segura sin contraseña para mostrar
   */
  public toSafeJSON(): SafeUserData {
    return {
      id_usuario: this.id_usuario,
      nombres: this.nombres,
      email: this.email,
      estado: this.estado
    };
  }
}

/**
 * Enumeración de estados de usuario
 */
export enum UserStatus {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo'
}

/**
 * Tipo para los datos del usuario (sin métodos)
 */
export interface UserData {
  id_usuario: string;
  nombres: string;
  email: string;
  contraseña: string;
  estado: UserStatus;
}

/**
 * Tipo para mostrar datos del usuario sin contraseña
 */
export interface SafeUserData {
  id_usuario: string;
  nombres: string;
  email: string;
  estado: UserStatus;
}

/**
 * Tipo para crear un nuevo usuario (sin id_usuario)
 */
export interface CreateUserData {
  nombres: string;
  email: string;
  contraseña: string;
  estado?: UserStatus;
}