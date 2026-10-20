import { errorHandler } from "@/handlers/errorHandler";
import { fastifyCors } from "@fastify/cors"
import { fastify } from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createLinkRoute } from "./routes/create-link";

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler(errorHandler)

server.register(fastifyCors, { origin: '*'})
server.register(createLinkRoute)

server.listen({port: 3333, host: '0.0.0.0' }).then(() => {
    console.log('HTTP server running!')
})

