import Head from 'next/head'
import Error from 'next/error'
import cx from 'classnames'
import { getImageUrl } from 'takeshape-routing'
import { graphqlFetch } from '../../lib/takeshape-api'
import Content from '../../components/content'
import baseTheme from '../../base.module.css'
import theme from './author.module.css'

export const authorQuery = slug => `
  query {
    authors: getAuthorList(filter: {term: {slug: "${slug}"}}) {
      total
      items {
        _id
        name
        photo {
          path
        }
        biography
        biographyHtml
        authored {
          title
        }
      }
    }
  }
`

export const authorSlugsQuery = `
  query {
    authors: getAuthorList {
      items {
        slug
      }
    }
  }
`

export async function unstable_getStaticProps({ params }) {
  const data = await graphqlFetch({ query: authorQuery(params.slug) })
  return { props: { data } }
}

export async function unstable_getStaticPaths() {
  const data = await graphqlFetch({ query: authorSlugsQuery })
  const authors = data.authors.items

  return authors.reduce(
    (pages, author) =>
      pages.concat({
        params: { slug: author.slug },
      }),
    []
  )
}

export default function Author({ data }) {
  if (!data || data.authors.total < 1) {
    return <Error statusCode={404} />
  }

  const { name, photo, biographyHtml } = data.authors.items[0]

  return (
    <>
      <Head>
        <title key="title">{name} / Author / Shape Blog</title>
        <meta
          key="description"
          name="description"
          content={`${name} is an author on Shape Blog`}
        ></meta>
      </Head>
      <header className={baseTheme.header}>
        <h1>{name}</h1>
      </header>
      <div className={theme.author}>
        <div className={cx(theme.container, baseTheme.container)}>
          <div className={theme.image}>
            <img src={getImageUrl(photo.path, { w: 350 })} alt={''} />
          </div>
          <Content bodyHtml={biographyHtml} />
        </div>
      </div>
    </>
  )
}
