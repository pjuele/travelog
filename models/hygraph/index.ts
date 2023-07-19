// For Hygraph fetching:
import { QueryOptions, graphSqlOptionsFactory } from "../../util/graphSqlOptionsFactory.fn";
import { ValidLocales } from "../../util/languageConstants"


// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
export type CmsPostData = {
    id: string,
    slug: string;
    date: string;
    title: string,
    markdown: string,
    locale: string,
}

export type CmsPostIndexItem = {
    id: string,
    locale: string,
    slug: string;
    title: string,
    date: string;
}

export type CmsPostsIndex = CmsPostIndexItem[];


// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
export async function getCmsPostsIndex(
    requestedLocale: ValidLocales = "en"
): Promise<CmsPostsIndex | CmsPostData | undefined> {
    const graphqlQuery = `
        query MyQuery {
            tlgPosts(orderBy: date_DESC) {
            localizations(includeCurrent: true, locales: ${requestedLocale}) {
                id
                locale
                slug
                title
                date
            }
            }
        }
    `;
    const cmsDataSource = new CmsDataSource(graphqlQuery);
    await cmsDataSource.fetchData();
    let result;
    if (cmsDataSource.content)
    // TODO: lots of things. check for type, remove unneeded types... this is not OK
        result = (cmsDataSource.content as CmsPostsIndex).map((post: any) => post.localizations[0]);
    else result = [];
    return result;
}


// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
export async function getCmsPostData(
    requestedSlug: string,
    requestedLocale: ValidLocales = "en"
): Promise<CmsPostData | CmsPostsIndex | undefined> {
    const graphqlQuery = `
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
    `;
    const cmsDataSource = new CmsDataSource(graphqlQuery);
    await cmsDataSource.fetchData();
    // const { tlgPost as CmsPostData } = cmsDataSource.content
    // return tlgPost;
    return undefined;
}


// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
export class CmsDataSource {
    queryOptions: QueryOptions | undefined;
    content: CmsPostData | CmsPostsIndex | undefined;
    ok: boolean;

    constructor(graphqlQuery: string) {
        // console.log("REQUESTED QUERY WILL BE: \n%o\n", graphqlQuery);
        this.queryOptions = graphSqlOptionsFactory(graphqlQuery)
        this.content = undefined;
        this.ok = false;
    }

    async fetchData() {
        try {
            if (!this.queryOptions) {
                this.ok = false;
            }
            const response = await (
                await fetch(
                    process.env.HYGRAPH_URL as string,
                    this.queryOptions
                )
            ).json();
            // console.log("RESPONSE DATA IS:\n%o", response.data);

            if (!response.data) return {};
            this.content = response.data;
            this.ok = true;
        }
        catch (err: any) {
            console.error('ERROR DURING CMS FETCH REQUEST: ', err.message);
            this.ok = false;
        }
    }
}
