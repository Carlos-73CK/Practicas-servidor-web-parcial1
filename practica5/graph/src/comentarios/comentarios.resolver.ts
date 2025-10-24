import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ServiceHttp } from '../servicios/http.service';
import { ComentarioType } from '../types/usuario-transaccional.type';

@Resolver()
export class ComentariosResolver {
  constructor(private readonly rest: ServiceHttp) {}

  @Query(() => [ComentarioType], {
    description: 'Comentarios, opcionalmente filtrados por reporteId (últimos primero en cliente).',
  })
  async comentarios(
    @Args('reporteId', { type: () => Int, nullable: true }) reporteId?: number,
  ): Promise<ComentarioType[]> {
    let items = (await this.rest.getComentarios()) as any[];
    if (reporteId) items = items.filter((c: any) => c.reporte?.id === reporteId || c.reporteId === reporteId);
    return items as any;
  }
}
