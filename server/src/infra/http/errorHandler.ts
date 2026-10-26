import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { BadRequestError, NotFoundError } from "./routes/_errors";

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, reply)=>{
    if (error instanceof ZodError){
        return reply.status(400).send({
            message: 'Validation error.',
            
        })
    }

    if (error instanceof BadRequestError){
        return reply.status(400).send({message: error.message})
    }

    if (error instanceof NotFoundError){
        return reply.status(404).send({message: error.message})
    }

    console.error(error)

    return reply.status(500).send({message: 'Internal server error.'})
}