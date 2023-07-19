/* eslint-disable react/no-children-prop */
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CmsPostData, CmsPostsIndex, getCmsPostData } from '../../../../models/hygraph';

async function fetchContent(slug: string): Promise<CmsPostData | CmsPostsIndex | undefined> {
    // FIXME: Add locale param!
    const content = await getCmsPostData(slug, "en");

    console.log("POST CONTENT IS:\n%o", content);

    return content;
}

export default async function Page(
    { params }: { params: { slug: string } }
) {
    let content = await fetchContent(params.slug) as CmsPostData;
    if (!content) content = {
        id: "?",
        slug: "?",
        locale: "?",
        title: "?",
        markdown: "?",
        date: "?",
    }
    return (
        <main className="w-screen h-screen flex items-center justify-around text-white">
            <div className="flex flex-col items-center">
                <h1>{content.title}</h1>
                <p>{content.date}</p>
                <ReactMarkdown children={content.markdown} remarkPlugins={[remarkGfm]} />
            </div>
        </main>
    )
}