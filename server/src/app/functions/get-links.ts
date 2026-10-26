import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { Either, makeRight } from "@/infra/shared/either"
import { asc, count, desc, ilike } from "drizzle-orm"
import { z } from "zod"

const getLinksInput = z.object({
    searchQuery: z.string().optional(),
    sortBy: z.enum(['createdAt']).optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
    page: z.number().optional().default(1),
    pageSize: z.number().optional().default(10),
  })
  
  type GetLinksInput = z.input<typeof getLinksInput>
  
  type GetLinksOutput = {
    links: {
      id: string
      originalUrl: string
      shortUrl: string
      accessCount: number
      createdAt: Date
    }[]
    total: number
  }
  
  export async function getLinks(
    input: GetLinksInput
  ): Promise<Either<never, GetLinksOutput>> {
    const { page, pageSize, searchQuery, sortBy, sortDirection } =
      getLinksInput.parse(input)
  
    const [links, [{ total }]] = await Promise.all([
      db
        .select({
          id: schema.short_urls.id,
          originalUrl: schema.short_urls.originalUrl,
          shortUrl: schema.short_urls.shortCode,
          accessCount: schema.short_urls.accessCount,
          createdAt: schema.short_urls.createdAt,
        })
        .from(schema.short_urls)
        .where(
          searchQuery
            ? ilike(schema.short_urls.originalUrl, `%${searchQuery}%`)
            : undefined
        )
        .orderBy(fields => {
          if (sortBy && sortDirection === 'asc') {
            return asc(fields[sortBy])
          }
  
          if (sortBy && sortDirection === 'desc') {
            return desc(fields[sortBy])
          }
          return desc(fields.id)
        })
        .offset((page - 1) * pageSize)
        .limit(pageSize),
  
      db
        .select({ total: count(schema.short_urls.id) })
        .from(schema.short_urls)
        .where(
          searchQuery
            ? ilike(schema.short_urls.originalUrl, `%${searchQuery}%`)
            : undefined
        ),
    ])
  
    return makeRight({ links, total })
  }