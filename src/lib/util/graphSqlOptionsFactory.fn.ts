export type QueryOptions = {
  method: string, // "POST" | "GET" | "PUT" | "DELETE",
  headers: { 'content-type': string; };
  body: string,
}

export function graphSqlOptionsFactory(query: string): QueryOptions {
    const headers = {
      'content-type': 'application/json',
      // 'Authorization': `Bearer ${HYGRAPH_PERMANENTAUTH_TOKEN}`
    };
    const requestBody = {
      query: query,
    };
    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    };
    return options;
  }