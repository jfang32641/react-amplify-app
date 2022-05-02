import { Data } from "./Data";

export class DataBuilder {
    constructor() {
        this.data = new Data();
    }

    //hack
    setParameter(key, value) {
        this.data[key] = value;
        return this;
    }

    addProduct(product) {
        //create new list
        if (!this.data.products) {
            this.data.products = [];
        }
        this.data.products.push(product);
        return this;
    }

    setApiKey(apiKey) {
        this.data.api_key = apiKey;
        return this;
    }

    build() {
        return this.data;
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
