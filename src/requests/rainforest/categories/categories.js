export const request = {
    method: 'get',
    url: 'https://api.rainforestapi.com/categories',

    // // `headers` are custom headers to be sent
    // headers: { 'X-Requested-With': 'XMLHttpRequest' },

    // `params` are the URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    // NOTE: params that are null or undefined are not rendered in the URL.
    params: {
        api_key: '0154B88F93664951A817749ECD19092F',
        // parent_id: '2619526011',
        domain: 'amazon.com' //country
    },
    responseType: 'json', // default
}

export const createBestsellersRootCategoriesRequest = (domain) => {
    return {
        method: 'get',
        url: 'https://api.rainforestapi.com/categories',
        params: {
            api_key: "0154B88F93664951A817749ECD19092F",
            type: "bestsellers",
            domain: domain,
        },
        responseType: 'json',
    }
}

