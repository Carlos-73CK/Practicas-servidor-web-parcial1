import { IRepository } from '../interfaces/IRepository';
import { User, CreateUserData } from '../entities/User';

/**
 * Interfaz específica para el repositorio de usuarios
 * Extiende la interfaz genérica con operaciones específicas para usuarios
 */
export interface IUserRepository extends IRepository<User, CreateUserData> {
  findByEmail(email: string): Promise<User | null>;
  findByEstado(estado: string): Promise<User[]>;
  findActiveUsers(): Promise<User[]>;
}