import { db, pg } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { Either, makeRight } from "@/infra/shared/either"
import { uploadFile } from "@/infra/storage/upload-file"
import { stringify } from "csv-stringify"
import { ilike } from "drizzle-orm"
import { PassThrough, Transform } from "node:stream"
import { pipeline } from "node:stream/promises"
import { z } from "zod"

const exportLinksInput = z.object({
    searchQuery: z.string().optional(),
  })
  
  type ExportLinksInput = z.input<typeof exportLinksInput>
  
  type ExportLinksOutput = {
    reportUrl: string
  }
  
  export async function exportLinks(
    input: ExportLinksInput
  ): Promise<Either<never, ExportLinksOutput>> {
    const { searchQuery } = exportLinksInput.parse(input)
  
    const { sql, params } = db
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
      .toSQL()
  
    const cursor = pg.unsafe(sql, params as string[]).cursor(2)
  
    const csv = stringify({
      delimiter: ',',
      header: true,
      columns: [
        { key: 'id', header: 'ID' },
        { key: 'original_url', header: 'Original URL' },
        { key: 'short_url', header: 'Short URL' },
        { key: 'access_count', header: 'Access Count' },
        { key: 'created_at', header: 'Created at' },
      ],
    })
  
    const uploadToStorageStream = new PassThrough()
  
    const convertToCSVPipeline = pipeline(
      cursor,
      new Transform({
        objectMode: true,
        transform(chunks: unknown[], _, callback) {
          for (const chunk of chunks) {
            this.push(chunk)
          }
  
          callback()
        },
      }),
      csv,
      uploadToStorageStream
    )
  
    const uploadToStorage = uploadFile({
      contentType: 'text/csv',
      folder: 'reports',
      fileName: `${new Date().toISOString()}-links.csv`,
      contentStream: uploadToStorageStream,
    })
  
    const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline])
  
    return makeRight({ reportUrl: url })
  }