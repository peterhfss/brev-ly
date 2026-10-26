import { deleteLinkById } from "@/app/functions/delete-link"
import { FastifyPluginAsyncZod, ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"

export const deleteLinkByIdRoute: FastifyPluginAsyncZod = async app => {
    app.withTypeProvider<ZodTypeProvider>().delete(
      '/links/:id',
      {
        schema: {
          summary: 'Delete link by ID',
          description:
            'Delete a link by its unique identifier. This action is irreversible.',
          tags: ['Links'],
          params: z.object({
            id: z.string(),
          }),
          response: {
            404: z
              .object({
                message: z.string(),
              })
              .describe('NOT FOUND'),
            204: z.null().describe('NO CONTENT'),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
  
        await deleteLinkById({ id })
  
        return reply.status(204).send(null)
      }
    )
  }