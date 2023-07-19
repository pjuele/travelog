/* eslint-disable react/no-children-prop */
import { CmsPostData, CmsPostsIndex, getCmsPostsIndex } from '../../../models/hygraph';

async function fetchContent(): Promise<CmsPostsIndex> {
    const content = await getCmsPostsIndex("en") as CmsPostsIndex;
    console.log("POST LIST IS:\n%o", content);
    return content;
}

export default async function Page(
    { params }: { params: { slug: string } }
) {
    let content = await fetchContent();
    // if (!content) content = {    }
    return (
        <main className="w-screen h-screen flex items-center justify-around text-white">
            <div className="flex flex-col items-center">
                <h1>Posts</h1>
            </div>
        </main>
    )
}