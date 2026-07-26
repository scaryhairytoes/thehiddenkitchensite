/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> => {
  const safeParams = (params ?? Promise.resolve({})).then((p) => p ?? {}) as Promise<{ [key: string]: string | string[] }>
  const safeSearchParams = (searchParams ?? Promise.resolve({})).then((s) => s ?? {}) as Promise<{ [key: string]: string | string[] }>
  return generatePageMetadata({ config: configPromise, params: safeParams, searchParams: safeSearchParams })
}

const Page = ({ params, searchParams }: Args) => {
  const safeParams = (params ?? Promise.resolve({})).then((p) => p ?? {}) as Promise<{ segments: string[] }>
  const safeSearchParams = (searchParams ?? Promise.resolve({})).then((s) => s ?? {}) as Promise<{ [key: string]: string | string[] }>
  return RootPage({ config: configPromise, importMap, params: safeParams, searchParams: safeSearchParams })
}

export default Page
