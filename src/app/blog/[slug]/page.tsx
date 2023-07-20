/* eslint-disable react/no-children-prop */
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { request, gql } from 'graphql-request'
import { ValidLocales } from '../../../lib/util/languageConstants';

async function fetchContent(requestedSlug: string, requestedLocale: ValidLocales): Promise<any> {
    // TODO: handle error if process.env.HYGRAPH_URL is not there.
    const document = gql`
        query MyQuery {
            tlgPost(where: {slug: "${requestedSlug}"}, locales: ${requestedLocale}) {
                id
                slug
                date
                title
                markdown
                locale
            }
        }
    `
    // const document = gql`
    //     query MyQuery {
    //         tlgPosts(orderBy: date_DESC) {
    //             localizations(includeCurrent: true, locales: es_UY) {
    //             id
    //             locale
    //             slug
    //             title
    //             date
    //             }
    //         }
    //     }
    // `
    const result = await request(process.env.HYGRAPH_URL as string, document);
    // console.log("GQL request RESULT:\n%o", result);
    return result;
}

export default async function Page(
    { params }: { params: { slug: string } }
) {
    let content = await fetchContent(params.slug, "es_UY") as any; //CmsPostData;
    const post = content.tlgPost;
    // if (post) {
    return (
        <main className="w-screen h-screen flex">
            <section className="container">
                <div className="m-5 p-5 pb-20 bg-white text-black drop-shadow-xl">
                    <h1>{post.title}</h1>
                    <p>{post.date}</p>
                    <ReactMarkdown children={post.markdown} remarkPlugins={[remarkGfm]} />
                </div>
                <small className="text-white float-right mr-10">&copy; 2023 Travelog | Picoptrocs Creative</small>
            </section>
        </main>
    )
}