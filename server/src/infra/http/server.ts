import { errorHandler } from "@/infra/http/errorHandler";
import { fastifyCors } from "@fastify/cors"
import { fastify } from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createLinkRoute } from "./routes/links/create-link";
import fastifySwagger from "@fastify/swagger";
import { fastifySwaggerUi } from '@fastify/swagger-ui'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler(errorHandler)

server.register(fastifyCors, { origin: '*'})


server.register(fastifySwagger,{
    openapi: {
        info: {
            title:'Brev.ly Server',
            version:'1.0.0',
        },
    },
    transform:jsonSchemaTransform
})

server.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})

server.register(createLinkRoute)

server.listen({port: 3333, host: '0.0.0.0' }).then(() => {
    console.log('HTTP server running!')
})

