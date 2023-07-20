/* eslint-disable react/no-children-prop */
import { request, gql } from 'graphql-request'
import { ValidLocales } from '../../lib/util/languageConstants';
import removeMd from "remove-markdown";

async function fetchContent(requestedSlug: string, requestedLocale: ValidLocales): Promise<any> {
    // TODO: handle error if process.env.HYGRAPH_URL is not there.
    const document = gql`
        query MyQuery {
            tlgPosts(orderBy: date_DESC) {
                localizations(includeCurrent: true, locales: es_UY) {
                id
                locale
                slug
                title
                markdown
                date
                }
            }
        }
    `
    const result = await request(process.env.HYGRAPH_URL as string, document);
    // console.log("GQL request RESULT:\n%o", result);
    return result;
}

export default async function Page(
    { params }: { params: { slug: string } }
) {
    const locale = "es_UY";
    let content = await fetchContent(params.slug, locale) as any; //CmsPostData;
    const posts = content.tlgPosts;
    // if (post) {
    return (
        <main className="w-screen h-screen flex">
            <section className="container">
                <div className="m-5 p-5 pb-20 bg-white text-black drop-shadow-xl">
                    <ol className="relative border-l border-gray-200 dark:border-gray-700">
                        {posts.map((postWithFluff: any, index: number) => {
                            console.log("YES FLUFF:\n%o", postWithFluff);
                            const post = postWithFluff.localizations[0];
                            console.log("NO FLUFF:\n%o", post);
                            return(
                                    <li key={index} className="mb-10 ml-4">
                                        <div className="absolute w-3 h-3 bg-green-500 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                        <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{(new Date(post.date).toLocaleString("es-UY"))}</time>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                                        <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{removeMd(post.markdown.substr(0,200).replace("\n", " | "))}</p>
                                        <a href={`/blog/${post.slug}`} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                                            {locale === "en" ? "Read more" : "Leer mas"}
                                            <svg className="w-3 h-3 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                            </svg>
                                        </a>
                                    </li>
                                )
                        })}
                    </ol>
                </div>
                <small className="text-white float-right mr-10">&copy; 2023 Travelog | Picoptrocs Creative</small>
            </section>
        </main>
    )
}