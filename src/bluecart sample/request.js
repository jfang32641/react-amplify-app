const axios = require('axios');

// set up the request parameters
const params = {
  api_key: "DD6FBCFBDB1C4C00925A105CE5DD9C0E",
  type: "product",
  item_id: "782866746"
}

// make the http GET request to BlueCart API
axios.get('https://api.bluecartapi.com/request', { params })
  .then(response => {

    // print the JSON response from BlueCart API
    console.log(JSON.stringify(response.data, 0, 2));

  }).catch(error => {
    // catch and print the error
    console.log(error);
  })