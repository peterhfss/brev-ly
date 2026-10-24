import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
    server.post(
        '/links',
        {
            schema: {
                summary: 'Create a link',
                body: z.object({

                })
            }
        }
    } )
}