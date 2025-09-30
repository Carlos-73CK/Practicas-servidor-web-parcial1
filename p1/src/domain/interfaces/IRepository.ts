/**
 * Interfaz que define el contrato para los repositorios usando callbacks
 * Implementa el patrón Repository con principio de inversión de dependencias
 */
export interface IRepository<T, TCreate = Omit<T, 'id'>> {
  // CREATE - Usando Callbacks
  create(item: TCreate, callback: (error: Error | null, result?: T) => void): void;
  
  // READ - Usando Async/Await
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  
  // UPDATE - Usando Promises
  update(id: string, updates: Partial<T>): Promise<T | null>;
  
  // DELETE - Usando Async/Await
  delete(id: string): Promise<boolean>;
}

/**
 * Callback type para operaciones CREATE
 */
export type CreateCallback<T> = (error: Error | null, result?: T) => void;

/**
 * Resultado de operaciones de modificación
 */
export interface UpdateResult<T> {
  success: boolean;
  data?: T;
  message: string;
}