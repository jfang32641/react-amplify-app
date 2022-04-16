import requests

# set up the request parameters
params = {
  'api_key': 'DD6FBCFBDB1C4C00925A105CE5DD9C0E',
  'type': 'product',
  'item_id': '782866746'
}

# make the http GET request to BlueCart API
api_result = requests.get('https://api.bluecartapi.com/request', params)

# print the JSON response from BlueCart API
print(json.dumps(api_result.json()))