import { createLink } from "@/app/functions/create-link"
import { unwrapEither } from "@/infra/shared/either"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
    server.post(
        '/links',
        {
            schema: {
                summary: 'Create a link',
                body: z.object({
                    originalUrl: z.string(),
                    shortCode: z.string().regex(/^[a-z0-9-]+$/, {
                        message:
                          'O shortUrl deve conter apenas letras minúsculas, números e hífens.',
                      }),
                }),
                response: {
                    201: z.object({linkId: z.string()}),
                    409: z
                        .object({message: z.string()
                        .describe('Link already exists')
                    })
                }
            }
        },
        async (request, reply) => {
            const { originalUrl, shortCode } = request.body
      
            const result = await createLink({ originalUrl, shortCode })
      
            const { linkId } = unwrapEither(result)
      
            return reply.status(201).send({ linkId })
          }
        )
}


