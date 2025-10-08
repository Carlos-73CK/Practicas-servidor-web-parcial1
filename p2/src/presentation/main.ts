import chalk from 'chalk';
import { UserService } from '../application/UserService';
import { InMemoryUserRepository } from '../infrastructure/InMemoryUserRepository';
import { User, UserStatus, CreateUserData } from '../domain/entities/User';

/**
 * Archivo principal de pruebas para demostrar todos los paradigmas asíncronos
 * Implementa las operaciones CRUD usando callbacks, promises y async/await
 */
class Main {
  private userService: UserService;

  constructor() {
    // Inyección de dependencias
    const userRepository = new InMemoryUserRepository();
    this.userService = new UserService(userRepository);
  }

  /**
   * Ejecuta todas las pruebas del sistema
   */
  async run(): Promise<void> {
    console.log(chalk.blue.bold('🚀 INICIANDO PRUEBAS DEL SISTEMA DE USUARIOS'));
    console.log(chalk.blue('====================================================\n'));

    try {
      // 1. Mostrar datos iniciales
      await this.showInitialData();

      // 2. Probar CREATE con callbacks
      await this.testCreateWithCallbacks();

      // 3. Probar READ con async/await
      await this.testReadWithAsyncAwait();

      // 4. Probar UPDATE con promises
      await this.testUpdateWithPromises();

      // 5. Probar DELETE con async/await
      await this.testDeleteWithAsyncAwait();

      // 6. Mostrar estadísticas finales
      await this.showFinalStatistics();

      console.log(chalk.green.bold('\n✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE'));
      
    } catch (error) {
      console.error(chalk.red.bold('\n❌ ERROR EN LAS PRUEBAS:'), error);
    }
  }

  /**
   * Muestra los datos iniciales del sistema
   */
  private async showInitialData(): Promise<void> {
    console.log(chalk.yellow.bold('📊 DATOS INICIALES DEL SISTEMA'));
    console.log(chalk.yellow('----------------------------------------'));

    try {
      const users = await this.userService.getAllUsers();
      console.log(chalk.cyan(`📈 Total de usuarios registrados: ${users.length}`));
      
      const stats = await this.userService.getUserStatistics();
      console.log(chalk.cyan(`👥 Usuarios activos: ${stats.activos}`));
      console.log(chalk.cyan(`💤 Usuarios inactivos: ${stats.inactivos}`));
      
      console.log(chalk.cyan('\n📋 Distribución por estado:'));
      Object.entries(stats.porEstado).forEach(([estado, count]) => {
        console.log(chalk.white(`  • ${estado}: ${count} usuarios`));
      });

      console.log(chalk.green('\n✓ Datos iniciales mostrados correctamente\n'));
      
    } catch (error) {
      console.error(chalk.red('❌ Error mostrando datos iniciales:'), error);
    }
  }

  /**
   * Prueba operación CREATE usando CALLBACKS
   */
  private async testCreateWithCallbacks(): Promise<void> {
    console.log(chalk.yellow.bold('🔧 PRUEBA CREATE CON CALLBACKS'));
    console.log(chalk.yellow('----------------------------------'));

    const newUsers: CreateUserData[] = [
      {
        nombres: 'Roberto Mendoza Silva',
        email: 'roberto.mendoza@test.com',
        contraseña: 'roberto123456',
        estado: UserStatus.ACTIVO
      },
      {
        nombres: 'Valentina Jiménez Pérez',
        email: 'valentina.jimenez@test.com',
        contraseña: 'valentina123456',
        estado: UserStatus.ACTIVO
      },
      {
        nombres: 'Alejandro Ramírez Torres',
        email: 'alejandro.ramirez@test.com',
        contraseña: 'alejandro123456',
        estado: UserStatus.ACTIVO
      }
    ];

    for (const userData of newUsers) {
      await this.createUserWithCallback(userData);
    }

    // Intentar crear usuario con email duplicado para probar manejo de errores
    console.log(chalk.blue('\n🧪 Probando creación con email duplicado...'));
    await this.createUserWithCallback({
      nombres: 'Test Duplicado',
      email: 'maria.gonzalez@sistema.com', // Email que ya existe
      contraseña: 'test123456',
      estado: UserStatus.ACTIVO
    });

    console.log(chalk.green('\n✓ Pruebas de CREATE con callbacks completadas\n'));
  }

  /**
   * Crea un usuario usando callbacks
   */
  private createUserWithCallback(userData: CreateUserData): Promise<void> {
    return new Promise((resolve) => {
      console.log(chalk.blue(`📝 Creando usuario: ${userData.nombres}...`));
      
      this.userService.createUser(userData, (error, result) => {
        if (error) {
          console.log(chalk.red(`❌ Error: ${error.message}`));
        } else if (result) {
          console.log(chalk.green(`✅ Usuario creado exitosamente:`));
          console.log(chalk.white(`   ID: ${result.id_usuario}`));
          console.log(chalk.white(`   Nombres: ${result.getNombres()}`));
          console.log(chalk.white(`   Email: ${result.email}`));
          console.log(chalk.white(`   Estado: ${result.estado}`));
        }
        resolve();
      });
    });
  }

  /**
   * Prueba operaciones READ usando ASYNC/AWAIT
   */
  private async testReadWithAsyncAwait(): Promise<void> {
    console.log(chalk.yellow.bold('🔍 PRUEBA READ CON ASYNC/AWAIT'));
    console.log(chalk.yellow('-----------------------------------'));

    try {
      // Obtener todos los usuarios
      console.log(chalk.blue('📋 Obteniendo todos los usuarios...'));
      const allUsers = await this.userService.getAllUsers();
      console.log(chalk.green(`✅ Se encontraron ${allUsers.length} usuarios`));

      // Mostrar algunos usuarios (versión segura sin contraseñas)
      console.log(chalk.cyan('\n👥 Primeros 5 usuarios:'));
      allUsers.slice(0, 5).forEach((user, index) => {
        const safeData = user.toSafeJSON();
        console.log(chalk.white(`  ${index + 1}. ${safeData.nombres} (${safeData.email}) - ${safeData.estado}`));
      });

      // Buscar usuario por ID
      if (allUsers.length > 0) {
        const firstUser = allUsers[0]!;
        console.log(chalk.blue(`\n🔎 Buscando usuario por ID: ${firstUser.id_usuario}...`));
        const foundUser = await this.userService.getUserById(firstUser.id_usuario);
        
        if (foundUser) {
          console.log(chalk.green('✅ Usuario encontrado:'));
          console.log(chalk.white(`   Nombres: ${foundUser.getNombres()}`));
          console.log(chalk.white(`   Email: ${foundUser.email}`));
          console.log(chalk.white(`   Estado: ${foundUser.estado}`));
        }
      }

      // Buscar usuarios por estado
      console.log(chalk.blue('\n� Buscando usuarios activos...'));
      const activeUsers = await this.userService.getActiveUsers();
      console.log(chalk.green(`✅ Usuarios activos: ${activeUsers.length}`));

      console.log(chalk.blue('\n� Buscando usuarios inactivos...'));
      const inactiveUsers = await this.userService.getUsersByEstado(UserStatus.INACTIVO);
      console.log(chalk.green(`✅ Usuarios inactivos: ${inactiveUsers.length}`));

      // Probar búsqueda por email
      if (allUsers.length > 0) {
        const testEmail = allUsers[0]!.email;
        console.log(chalk.blue(`\n📧 Buscando usuario por email: ${testEmail}...`));
        const userByEmail = await this.userService.findUserByEmail(testEmail);
        
        if (userByEmail) {
          console.log(chalk.green('✅ Usuario encontrado por email'));
        }
      }

      // Probar búsqueda con ID inexistente
      console.log(chalk.blue('\n🧪 Probando búsqueda con ID inexistente...'));
      const nonExistentUser = await this.userService.getUserById('id-inexistente');
      
      if (!nonExistentUser) {
        console.log(chalk.yellow('⚠️  Usuario no encontrado (comportamiento esperado)'));
      }

      console.log(chalk.green('\n✓ Pruebas de READ con async/await completadas\n'));
      
    } catch (error) {
      console.error(chalk.red('❌ Error en pruebas READ:'), error);
    }
  }

  /**
   * Prueba operación UPDATE usando PROMISES
   */
  private async testUpdateWithPromises(): Promise<void> {
    console.log(chalk.yellow.bold('✏️  PRUEBA UPDATE CON PROMISES'));
    console.log(chalk.yellow('----------------------------------'));

    try {
      // Obtener un usuario para actualizar
      const users = await this.userService.getAllUsers();
      if (users.length === 0) {
        console.log(chalk.yellow('⚠️  No hay usuarios para actualizar'));
        return;
      }

      const userToUpdate = users.find(u => u.isActive());
      if (!userToUpdate) {
        console.log(chalk.yellow('⚠️  No se encontró usuario activo para actualizar'));
        return;
      }

      console.log(chalk.blue(`🔄 Actualizando usuario: ${userToUpdate.getNombres()}...`));
      console.log(chalk.white(`   Datos actuales: ${userToUpdate.email}, Estado: ${userToUpdate.estado}`));

      // Actualizar usando promises
      const updates = {
        nombres: userToUpdate.nombres + ' (Actualizado)',
        estado: UserStatus.ACTIVO
      };

      await this.updateUserWithPromises(userToUpdate.id_usuario, updates);

      // Probar actualización con ID inexistente
      console.log(chalk.blue('\n🧪 Probando actualización con ID inexistente...'));
      await this.updateUserWithPromises('id-inexistente', { nombres: 'Test' });

      // Probar actualización sin datos
      console.log(chalk.blue('\n🧪 Probando actualización sin datos...'));
      await this.updateUserWithPromises(userToUpdate.id_usuario, {});

      console.log(chalk.green('\n✓ Pruebas de UPDATE con promises completadas\n'));
      
    } catch (error) {
      console.error(chalk.red('❌ Error en pruebas UPDATE:'), error);
    }
  }

  /**
   * Actualiza un usuario usando promises
   */
  private updateUserWithPromises(id: string, updates: Partial<User>): Promise<void> {
    return new Promise((resolve) => {
      this.userService.updateUser(id, updates)
        .then(updatedUser => {
          if (updatedUser) {
            console.log(chalk.green('✅ Usuario actualizado exitosamente:'));
            console.log(chalk.white(`   ID: ${updatedUser.id_usuario}`));
            console.log(chalk.white(`   Nombres: ${updatedUser.getNombres()}`));
            console.log(chalk.white(`   Estado: ${updatedUser.estado}`));
          }
          resolve();
        })
        .catch(error => {
          console.log(chalk.red(`❌ Error en actualización: ${error.message}`));
          resolve();
        });
    });
  }

  /**
   * Prueba operación DELETE usando ASYNC/AWAIT
   */
  private async testDeleteWithAsyncAwait(): Promise<void> {
    console.log(chalk.yellow.bold('🗑️  PRUEBA DELETE CON ASYNC/AWAIT'));
    console.log(chalk.yellow('------------------------------------'));

    try {
      // Obtener usuarios para eliminar
      const users = await this.userService.getAllUsers();
      
      if (users.length === 0) {
        console.log(chalk.yellow('⚠️  No hay usuarios disponibles para eliminar'));
        return;
      }

      // Eliminar algunos usuarios (los últimos creados)
      const usersToDelete = users.slice(-2); // Los últimos 2 usuarios

      for (const user of usersToDelete) {
        console.log(chalk.blue(`🗑️  Eliminando usuario: ${user.getNombres()}...`));
        
        const deleted = await this.userService.deleteUser(user.id_usuario);
        
        if (deleted) {
          console.log(chalk.green(`✅ Usuario eliminado exitosamente`));
        } else {
          console.log(chalk.yellow(`⚠️  No se pudo eliminar el usuario`));
        }
      }

      // Probar eliminar usuario inexistente
      console.log(chalk.blue('\n🧪 Probando eliminación con ID inexistente...'));
      const deletedNonExistent = await this.userService.deleteUser('id-inexistente');
      
      if (!deletedNonExistent) {
        console.log(chalk.yellow('⚠️  Usuario no encontrado para eliminar (comportamiento esperado)'));
      }

      console.log(chalk.green('\n✓ Pruebas de DELETE con async/await completadas\n'));
      
    } catch (error) {
      console.error(chalk.red('❌ Error en pruebas DELETE:'), error);
    }
  }

  /**
   * Muestra estadísticas finales del sistema
   */
  private async showFinalStatistics(): Promise<void> {
    console.log(chalk.yellow.bold('📊 ESTADÍSTICAS FINALES DEL SISTEMA'));
    console.log(chalk.yellow('---------------------------------------'));

    try {
      const stats = await this.userService.getUserStatistics();
      
      console.log(chalk.cyan('📈 Resumen final:'));
      console.log(chalk.white(`   • Total de usuarios: ${stats.total}`));
      console.log(chalk.white(`   • Usuarios activos: ${stats.activos}`));
      console.log(chalk.white(`   • Usuarios inactivos: ${stats.inactivos}`));
      
      console.log(chalk.cyan('\n👥 Distribución por estado:'));
      Object.entries(stats.porEstado).forEach(([estado, count]) => {
        const emoji = this.getEstadoEmoji(estado);
        console.log(chalk.white(`   ${emoji} ${estado}: ${count} usuarios`));
      });

      // Mostrar algunos usuarios finales
      const finalUsers = await this.userService.getAllUsers();
      console.log(chalk.cyan(`\n📋 Usuarios finales (${finalUsers.length} total):`));
      
      finalUsers.slice(0, 3).forEach((user, index) => {
        const statusIcon = user.isActive() ? '🟢' : '🔴';
        console.log(chalk.white(`   ${index + 1}. ${statusIcon} ${user.getNombres()} - ${user.estado}`));
      });

      if (finalUsers.length > 3) {
        console.log(chalk.gray(`   ... y ${finalUsers.length - 3} usuarios más`));
      }

      console.log(chalk.green('\n✓ Estadísticas finales mostradas correctamente'));
      
    } catch (error) {
      console.error(chalk.red('❌ Error mostrando estadísticas finales:'), error);
    }
  }

  /**
   * Obtiene emoji para cada estado
   */
  private getEstadoEmoji(estado: string): string {
    const emojiMap: Record<string, string> = {
      [UserStatus.ACTIVO]: '�',
      [UserStatus.INACTIVO]: '�'
    };
    return emojiMap[estado] || '❓';
  }
}

/**
 * Función principal para ejecutar las pruebas
 */
async function main(): Promise<void> {
  const testRunner = new Main();
  await testRunner.run();
}

// Ejecutar las pruebas
main().catch(error => {
  console.error(chalk.red.bold('💥 ERROR CRÍTICO EN EL SISTEMA:'), error);
  process.exit(1);
});