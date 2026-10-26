import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { BadRequestError } from "@/infra/http/routes/_errors";
import { Either, makeRight } from "@/infra/shared/either";
import { z } from "zod";

const newLinkSchema = z.object({
    originalUrl: z.string(),
    shortCode: z.string().regex(/^[a-z0-9-]+$/, {
        message:
          'O link encurtado deve conter apenas letras minúsculas, números e hífens.',
      }),
})

type InputNewLink = z.input<typeof newLinkSchema>

type OutputNewLink = {
  linkId: string
}

export async function createLink(inputLink: InputNewLink):Promise<Either<never, OutputNewLink>>{
  const { originalUrl, shortCode } = newLinkSchema.parse(inputLink)

  const shortLinkCreated = await db.query.short_urls.findFirst({
    where:(links, {eq}) => eq(links.shortCode, shortCode)
  })

  if (shortLinkCreated) {
    throw new BadRequestError(
      'O link encurtado já possui cadastro. Por favor, informe outro!'
    )
  }

  const link = await db
  .insert(schema.short_urls)
  .values({
    originalUrl,
    shortCode,
  })
  .returning()

return makeRight({
  linkId: link[0].id,
})
}