import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { NotFoundError } from "@/infra/http/routes/_errors"
import { Either, makeRight } from "@/infra/shared/either"
import { eq } from "drizzle-orm"
import { z } from "zod"

const increaseAccessCountInput = z.object({
    id: z.string(),
  })
  
  type IncreaseAccessCountInput = z.input<typeof increaseAccessCountInput>
  
  export async function increaseAccessCountLink(
    input: IncreaseAccessCountInput
  ): Promise<Either<never, null>> {
    const { id } = increaseAccessCountInput.parse(input)
  
    const link = await db.query.short_urls.findFirst({
      where: eq(schema.short_urls.id, id),
    })
  
    if (!link) {
      throw new NotFoundError('Link não encontrado.')
    }
  
    await db
      .update(schema.short_urls)
      .set({ accessCount: link.accessCount + 1 })
      .where(eq(schema.short_urls.id, id))
  
    return makeRight(null)
  }