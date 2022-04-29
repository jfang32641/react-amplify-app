import { QueryParameters } from "./QueryParameters";

export class QueryParametersBuilder {
    constructor() {
        this.queryParameters = new QueryParameters();
    }

    //hack
    setParameter(key, value) {
        this.queryParameters[key] = value;
        return this;
    }

    setApiKey(apiKey) {
        this.queryParameters.api_key = apiKey;
        return this;
    }

    setType(type) {
        this.queryParameters.type = type;
        return this;
    }

    setAmazonDomain(amazonDomain) {
        this.queryParameters.amazon_domain = amazonDomain;
        return this;
    }

    setGtin(gtin) {
        this.queryParameters.gtin = gtin;
        return this;
    }

    setAsin(asin) {
        this.queryParameters.asin = asin;
        return this;
    }

    setPage(page) {
        this.queryParameters.page = page;
        return this;
    }

    setOutput(output) {
        this.queryParameters.output = output;
        return this;
    }

    setCsvFields(csvFields) {
        this.queryParameters.csvFields = csvFields;
        return this;
    }

    build() {
        return this.queryParameters;
    }
}

// var axios = require('axios');
// var data = '';

// var config = {
//   method: 'get',
//   url: 'https://api.rainforestapi.com/request?api_key=0154B88F93664951A817749ECD19092F&type=product&amazon_domain=amazon.com&gtin=810038852775',
//   headers: { },
//   data : data
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });
