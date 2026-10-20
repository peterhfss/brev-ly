import { FastifyReply, FastifyRequest } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";

export function errorHandler(error:unknown, request:FastifyRequest, reply:FastifyReply){
    if(hasZodFastifySchemaValidationErrors(error)){
        return reply.status(400).send({
            message:'Validation error',
            issues: error.validation,
        })
    }

    console.error(error)

    return reply.status(500).send({message: 'Internal server error'})
}