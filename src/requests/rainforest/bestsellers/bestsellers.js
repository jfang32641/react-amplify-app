export const request = {
  method: 'get',
  url: 'https://api.rainforestapi.com/request',

  // `method` is the request method to be used when making the request

  // `baseURL` will be prepended to `url` unless `url` is absolute.
  // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
  // to methods of that instance.
  // baseURL: 'https://some-domain.com/api',


  // // `headers` are custom headers to be sent
  // headers: { 'X-Requested-With': 'XMLHttpRequest' },

  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  // NOTE: params that are null or undefined are not rendered in the URL.
  params: {
    api_key: "demo",
    type: "bestsellers",
    // category_id: 
    // url: "https://www.amazon.com/Best-Sellers-Computers-Accessories-Memory-Cards/zgbs/pc/516866"
  },

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', 'DELETE', and 'PATCH'
  // When no `transformRequest` is set, must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - Node only: Stream, Buffer
  // data: {
  //   firstName: 'Fred'
  // },

  // `responseType` indicates the type of data that the server will respond with
  // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
  //   browser only: 'blob'
  responseType: 'json', // default
}

export const createDemoBestsellersRequestWithUrl = () => {
  return {
    method: 'get',
    url: 'https://api.rainforestapi.com/request',
    params: {
      api_key: "demo",
      type: "bestsellers",
      url: "https://www.amazon.com/Best-Sellers-Computers-Accessories-Memory-Cards/zgbs/pc/516866"
    },
    responseType: 'json', // default
  }
}

export const createBestsellersRequestAmazonDomainAndCategoryId = (amazonDomain, categoryId) => {
  return {
    method: 'get',
    url: 'https://api.rainforestapi.com/request',
    params: {
      api_key: "0154B88F93664951A817749ECD19092F",
      type: "bestsellers",
      amazon_domain: amazonDomain,
      category_id: categoryId,
      // url: "https://www.amazon.com/Best-Sellers-Computers-Accessories-Memory-Cards/zgbs/pc/516866"
    },
    responseType: 'json', // default
  }
}

export const createBestsellersRequestWithUrl = (url) => {
  return {
    method: 'get',
    url: 'https://api.rainforestapi.com/request',
    params: {
      api_key: "0154B88F93664951A817749ECD19092F",
      type: "bestsellers",
      url: url,
      // url: "https://www.amazon.com/Best-Sellers-Computers-Accessories-Memory-Cards/zgbs/pc/516866"
    },
    responseType: 'json', // default
  }
}

