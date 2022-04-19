import { AxiosRequestConfig } from "./AxiosRequestConfig";
// import { AxiosRequestConfig } from "axios";
//https://axios-http.com/docs/req_config

export class AxiosRequestConfigBuilder {
    constructor() {
        this.requestConfig = new AxiosRequestConfig();
    }

    //hack
    setParameter(key, value) {
        this.requestConfig[key] = value;
        return this;
    }

    setBaseUrl(baseUrl) {
        this.requestConfig.baseURL = baseUrl;
        return this;
    }

    setUrl(url) {
        this.requestConfig.url = url;
        return this;
    }

    setMethod(method) {
        this.requestConfig.method = method;
        return this;
    }

    setHeaders(headers) {
        this.requestConfig.headers = headers;
        return this;
    }

    setParams(params) {
        this.requestConfig.params = params;
        return this;
    }

    setData(data) {
        this.requestConfig.data = data;
        return this;
    }

    setResponseType(responseType) {
        this.requestConfig.responseType = responseType;
        return this;
    }

    build() {
        return this.requestConfig;
    }
}

// export interface AxiosRequestConfig<D = any> {
//     url?: string;
//     method?: Method;
//     baseURL?: string;
//     transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
//     transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
//     headers?: AxiosRequestHeaders;
//     params?: any;
//     paramsSerializer?: (params: any) => string;
//     data?: D;
//     timeout?: number;
//     timeoutErrorMessage?: string;
//     withCredentials?: boolean;
//     adapter?: AxiosAdapter;
//     auth?: AxiosBasicCredentials;
//     responseType?: ResponseType;
//     responseEncoding?: responseEncoding | string;
//     xsrfCookieName?: string;
//     xsrfHeaderName?: string;
//     onUploadProgress?: (progressEvent: any) => void;
//     onDownloadProgress?: (progressEvent: any) => void;
//     maxContentLength?: number;
//     validateStatus?: ((status: number) => boolean) | null;
//     maxBodyLength?: number;
//     maxRedirects?: number;
//     socketPath?: string | null;
//     httpAgent?: any;
//     httpsAgent?: any;
//     proxy?: AxiosProxyConfig | false;
//     cancelToken?: CancelToken;
//     decompress?: boolean;
//     transitional?: TransitionalOptions;
//     signal?: AbortSignal;
//     insecureHTTPParser?: boolean;
//   }


// sample = {
//     url: '/user',
//     method: 'get', // default
//     baseURL: 'https://some-domain.com/api',
//     transformRequest: [function (data, headers) {
//         return data;
//     }],
//     transformResponse: [function (data) {
//         return data;
//     }],
//     headers: { 'X-Requested-With': 'XMLHttpRequest' },
//     params: {
//         ID: 12345
//     },
//     paramsSerializer: function (params) {
//         return Qs.stringify(params, { arrayFormat: 'brackets' })
//     },
//     data: {
//         firstName: 'Fred'
//     },
//     data: 'Country=Brasil&City=Belo Horizonte',
//     timeout: 1000, // default is `0` (no timeout)
//     withCredentials: false, // default
//     adapter: function (config) {
//         /* ... */
//     },
//     auth: {
//         username: 'janedoe',
//         password: 's00pers3cret'
//     },
//     responseType: 'json', // default
//     responseEncoding: 'utf8', // default
//     xsrfCookieName: 'XSRF-TOKEN', // default
//     xsrfHeaderName: 'X-XSRF-TOKEN', // default
//     onUploadProgress: function (progressEvent) {
//         // Do whatever you want with the native progress event
//     },
//     onDownloadProgress: function (progressEvent) {
//         // Do whatever you want with the native progress event
//     },
//     maxContentLength: 2000,
//     maxBodyLength: 2000,
//     validateStatus: function (status) {
//         return status >= 200 && status < 300; // default
//     },
//     maxRedirects: 5, // default
//     socketPath: null, // default
//     httpAgent: new http.Agent({ keepAlive: true }),
//     httpsAgent: new https.Agent({ keepAlive: true }),

//     proxy: {
//         protocol: 'https',
//         host: '127.0.0.1',
//         port: 9000,
//         auth: {
//             username: 'mikeymike',
//             password: 'rapunz3l'
//         }
//     },
//     cancelToken: new CancelToken(function (cancel) {
//     }),
//     decompress: true // default
// }