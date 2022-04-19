import axios from 'axios';

export const makeHttpRequest = async (request) => {
    try {
        const response = await axios(request);
        console.log('makeHttpRequest request', request);
        console.log('makeHttpRequest response', response);
        return response;
    } catch (error) {
        console.error(error);
    }
}