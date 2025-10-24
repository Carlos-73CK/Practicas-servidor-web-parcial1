import { Resolver, Query } from '@nestjs/graphql';
import { ServiceHttp } from '../servicios/http.service';
import { CategoriaType, AreaType, EstadoReporteType, EtiquetaType } from '../types/catalogo.type';

@Resolver()
export class CatalogosResolver {
  constructor(private readonly rest: ServiceHttp) {}

  @Query(() => [CategoriaType], { description: 'Listado de categorías disponibles.' })
  async categorias(): Promise<CategoriaType[]> {
    return this.rest.getCategorias() as any;
  }

  @Query(() => [AreaType], { description: 'Listado de áreas registradas.' })
  async areas(): Promise<AreaType[]> {
    return this.rest.getAreas() as any;
  }

  @Query(() => [EstadoReporteType], { description: 'Estados posibles de un reporte.' })
  async estados(): Promise<EstadoReporteType[]> {
    return this.rest.getEstados() as any;
  }

  @Query(() => [EtiquetaType], { description: 'Etiquetas para clasificar reportes y comentarios.' })
  async etiquetas(): Promise<EtiquetaType[]> {
    return this.rest.getEtiquetas() as any;
  }
}
