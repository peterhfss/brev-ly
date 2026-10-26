import { db } from "@/infra/db"
import { NotFoundError } from "@/infra/http/routes/_errors"
import { Either, makeRight } from "@/infra/shared/either"
import { z } from "zod"

const getOriginalUrlInput = z.object({
    shortUrl: z.string(),
  })
  
  type GetOriginalUrlInput = z.input<typeof getOriginalUrlInput>
  
  type GetOriginalUrlOutput = {
    id: string
    originalUrl: string
  }
  
  export async function getOriginalUrlByShortLink(
    input: GetOriginalUrlInput
  ): Promise<Either<never, GetOriginalUrlOutput>> {
    const { shortUrl } = getOriginalUrlInput.parse(input)
  
    const link = await db.query.short_urls.findFirst({
      where: (links, { eq }) => eq(links.shortCode, shortUrl),
    })
  
    if (!link) {
      throw new NotFoundError('Link não encontrado.')
    }
  
    return makeRight({
      id: link.id,
      originalUrl: link.originalUrl,
    })
  }