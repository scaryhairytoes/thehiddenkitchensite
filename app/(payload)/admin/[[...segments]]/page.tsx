import type { Metadata } from 'next'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params?: Promise<{
    segments?: string[]
  }>
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  const safeParams = (params ?? Promise.resolve({})).then((p) => p ?? {})
  const safeSearchParams = (searchParams ?? Promise.resolve({})).then((s) => s ?? {})
  return generatePageMetadata({
    config,
    params: safeParams as Promise<{ [key: string]: string | string[] }>,
    searchParams: safeSearchParams as Promise<{ [key: string]: string | string[] }>,
  })
}

const Page = async ({ params, searchParams }: Args) => {
  const safeParams = (params ?? Promise.resolve({})).then((p) => p ?? {})
  const safeSearchParams = (searchParams ?? Promise.resolve({})).then((s) => s ?? {})
  return RootPage({
    config,
    importMap,
    params: safeParams as Promise<{ segments: string[] }>,
    searchParams: safeSearchParams as Promise<{ [key: string]: string | string[] }>,
  })
}

export default Page