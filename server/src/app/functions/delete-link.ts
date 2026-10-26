import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { NotFoundError } from "@/infra/http/routes/_errors";
import { Either, makeRight } from "@/infra/shared/either";
import { eq } from "drizzle-orm";
import { z } from "zod";

const deleteLinkSchema = z.object({
    id: z.string(),
})

type deleteLinkSchema = z.input<typeof deleteLinkSchema>

export async function deleteLinkById(inputLink: deleteLinkSchema): Promise<Either<never, null>>{
    const { id } = deleteLinkSchema.parse(inputLink)

    const link = await db.query.short_urls.findFirst({
        where: (links, { eq }) => eq(links.id, id),
      })
    
      if (!link) {
        throw new NotFoundError('Link não encontrado.')
      }
    
      await db.delete(schema.short_urls).where(eq(schema.short_urls.id, id))
    
      return makeRight(null)

}