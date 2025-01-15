// Write a function that accepts an array of URLs,
// makes parallel queries for each of them, and returns an
// an array of results in the order in which the queries are completed.

// Example input data:
// const urls = ['https://jsonplaceholder.typicode.com/posts/1', 
// 'https://jsonplaceholder.typicode.com/posts/2'];

// Expected result:
// [
// { data: { ... }, status: 200 },
// { data: { ... }, status: 200 }
// ] 
import axios from 'axios';

type RequestsResult = {
    data: any;
    status: number;
    error?: string;
};

async function fetchAll(urls: string[]): Promise<RequestsResult[]> {
    const promises = urls.map(async (url) => {
        try {
            const response = await axios.get(url);
            return { data: response.data, status: response.status };
        } catch (error) {
            let message = 'Unknown error';
            if (error instanceof Error) {
                message = error.message;
            }
            return { data: null, status: 500, error: message };
        }
    });

    const results = await Promise.all(promises);
    return results;
}

module.exports = { fetchAll };
