import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, HttpException, NotFoundException, InternalServerErrorException, BadGatewayException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ServiceHttp {
  private readonly logger = new Logger(ServiceHttp.name);
  constructor(private readonly httpService: HttpService) {}

  private handle(error: AxiosError): never {
    const status = error.response?.status;
    const method = (error.config?.method || '').toUpperCase();
    const baseURL = error.config?.baseURL ?? '';
    const url = error.config?.url ?? '';
    const fullUrl = `${baseURL || ''}${url || ''}`;
    const data = error.response?.data;
    this.logger.error(`${error.message} code=${error.code} status=${status} ${method} ${fullUrl} body=${JSON.stringify(data)}`);

    // Mapeo más claro de errores HTTP → excepciones Nest/GraphQL
    if (status === 404) {
      throw new NotFoundException({
        message: 'Recurso no encontrado en el servicio REST',
        method,
        url: fullUrl,
        status,
        details: data,
      });
    }
    if (typeof status === 'number' && status >= 500) {
      throw new InternalServerErrorException({
        message: 'Error interno del servicio REST',
        method,
        url: fullUrl,
        status,
        details: data,
      });
    }
    if (typeof status !== 'number') {
      // Sin respuesta del backend o error de red/timeouts
      throw new BadGatewayException({
        message: 'No hay respuesta del servicio REST (timeout/red)',
        method,
        url: fullUrl,
        status: 502,
        details: { code: error.code, data },
      });
    }
    // Otros códigos (400-499 no 404)
    throw new HttpException(
      {
        message: 'Error al consumir el servicio REST',
        method,
        url: fullUrl,
        status,
        details: data,
      },
      status,
    );
  }

  // ---- Endpoints generales hacia práctica 4 (prefijo configurado en HttpModule baseURL) ----
  async getCategorias(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<any[]>('/categorias').pipe(
        catchError((error: AxiosError) => this.handle(error)),
      ),
    );
    return data;
  }

  async getAreas(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<any[]>('/areas').pipe(
        catchError((error: AxiosError) => this.handle(error)),
      ),
    );
    return data;
  }

  async getEstados(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<any[]>('/estados').pipe(
        catchError((error: AxiosError) => this.handle(error)),
      ),
    );
    return data;
  }

  async getEtiquetas(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<any[]>('/etiquetas').pipe(
        catchError((error: AxiosError) => this.handle(error)),
      ),
    );
    return data;
  }

  // ---- Taller 4 (practica4) endpoints ----
  async getReportes(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<any[]>('/reportes').pipe(
        catchError((error: AxiosError) => this.handle(error)),
      ),
    );
    return data;
  }

  async getReporte(id: number): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get<any>(`/reportes/${id}`).pipe(
        catchError((error: AxiosError) => this.handle(error)),
      ),
    );
    return data;
  }

  async getPromedioPuntuaciones(reporteId: number): Promise<{ reporteId: number; promedio: number }> {
    const { data } = await firstValueFrom(
      this.httpService.get<{ reporteId: number; promedio: number }>(`/puntuaciones/promedio/${reporteId}`).pipe(
        catchError((error: AxiosError) => this.handle(error)),
      ),
    );
    return data;
  }

  async getPuntuaciones(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<any[]>('/puntuaciones').pipe(
        catchError((error: AxiosError) => this.handle(error)),
      ),
    );
    return data;
  }

  async getComentarios(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<any[]>('/comentarios').pipe(
        catchError((error: AxiosError) => this.handle(error)),
      ),
    );
    return data;
  }

  async getArchivos(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<any[]>('/archivos').pipe(
        catchError((error: AxiosError) => this.handle(error)),
      ),
    );
    return data;
  }

  async getUsuarios(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<any[]>('/usuarios').pipe(
        catchError((error: AxiosError) => this.handle(error)),
      ),
    );
    return data;
  }

  async getRoles(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<any[]>('/roles').pipe(
        catchError((error: AxiosError) => this.handle(error)),
      ),
    );
    return data;
  }
}