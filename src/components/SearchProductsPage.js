import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import asinToGtinResponse from '../requests/rainforest/products/asinToGtinResponse.json'
import gtinToAsinResponse from '../requests/rainforest/products/gtinToAsinResponse.json'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import { Map, fromJS } from 'immutable'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import amazonDomains from '../requests/rainforest/domains.json'
import Button from 'react-bootstrap/Button'
import { AxiosRequestConfigBuilder } from '../requests/AxiosRequestConfigBuilder'
import { QueryParametersBuilder } from '../requests/QueryParametersBuilder'
import { makeHttpRequest } from '../requests/Http'
import Image from 'react-bootstrap/Image'
import Table from 'react-bootstrap/Table'
import ColumnSelector from './ColumnSelector'
import ProductTable from './ProductTable'
//https://www.rainforestapi.com/docs/product-data-api/results/asin-to-gtin
//https://www.rainforestapi.com/docs/product-data-api/reference/gtin-upc-ean-to-asin

const SearchProductsPage = props => {
  const [state, setState] = useState(
    fromJS({
      //asin -> gtin
      sourceAmazonDomain1: '',
      sourceAsin: '',
      asin_to_gtin_results: [],

      //gtin -> asin
      sourceAmazonDomain2: '',
      sourceGtin: '',
      targetAsin: {},

      //table
      columnNames: [],
      rows: [],
      table: {}
    })
  );

  useEffect(
    () => {
      console.log('SearchProductsPage state change', state.toJS())
      // return () => {
      //     second
      // }
    }, [state]
  );


  const handleStateChange = (event) => {
    setState(prevState => prevState.set(event.target.name, event.target.value));
    // const map1 = Map({ a: 1, b: 2, c: 3 });
    // const map2 = map1.set('b', 50);
    // setState(prevState => ({ ...prevState, [event.target.name]: event.target.value }));
  }

  const handleAsinToGtin = async (event) => {
    // console.log('handleClick1');
    const queryParameters = new QueryParametersBuilder()
      .setApiKey(process.env.REACT_APP_AMAZON_KEY)
      .setType('asin_to_gtin')
      .setAmazonDomain(state.get('sourceAmazonDomain1'))
      .setAsin(state.get('sourceAsin'))
      .build();

    const request = new AxiosRequestConfigBuilder()
      .setBaseUrl(process.env.REACT_APP_AMAZON_BASE_URL)
      .setUrl('/request')
      .setParams(queryParameters)
      .build()

    console.log('handleAsinToGtin', request);

    try {
      // const response = await makeHttpRequest(request);
      // setState(prevState => prevState.set('asin_to_gtin_results', response.data.asin_to_gtin_results));

      // const response = await makeHttpRequest(request);
      setState(prevState => prevState.set('asin_to_gtin_results', fromJS(asinToGtinResponse.asin_to_gtin_results)));

      // "asin_to_gtin_results": [
      //   {
      //     "value": "7085571244421",
      //     "format": "EAN-13"
      //   },
      //   {
      //     "value": "619659160395",
      //     "format": "UPC-A"
      //   }
      // ]
    } catch (error) {
      console.error(error);
    }
  }

  const handleGtinToAsin = async (event) => {
    const queryParameters = new QueryParametersBuilder()
      .setApiKey(process.env.REACT_APP_AMAZON_KEY)
      .setType('product')
      .setAmazonDomain(state.get('sourceAmazonDomain2'))
      .setGtin(state.get('sourceGtin'))
      .build();

    const request = new AxiosRequestConfigBuilder()
      .setBaseUrl(process.env.REACT_APP_AMAZON_BASE_URL)
      .setUrl('/request')
      .setParams(queryParameters)
      .build()

    console.log('handleClick2', request);

    try {
      // const response = await makeHttpRequest(request);
      // setState(prevState => prevState.set('targetAsin', gtinToAsinResponse.product.asin));
      console.log('gtinToAsinResponse', gtinToAsinResponse.product)
      setState(prevState => prevState.set('targetAsin', fromJS(gtinToAsinResponse)));
    } catch (error) {
      console.error(error);
    }
  }

  const handleCheckboxToggle = (event) => {
    const fullPath = event.target.name;

    // console.log('SearchProductsPage handleCheckboxToggle', event.target.name, event.target.checked);

    //checkbox checked, add column
    if (event.target.checked) {
      // console.log('SearchProductsPage table', event.target.name);

      //{} -> {columnName: [columnValue]}
      //get value from targetAsin
      let value = state.get('targetAsin').getIn(fullPath.split('.'));

      //table:{} -> table:{fullPath:value}
      value = convertValueToComponent(value);
      const newState = state.setIn(['table', fullPath], value);
      setState(newState);
    }
    //checkbox unchecked, remove column
    else {
      //table:{fullPath:value} -> table:{}
      const newState = state.deleteIn(['table', fullPath])
      setState(newState);
    }
  };

  //convert url to <a>, image url to <Image src=value>
  const convertValueToComponent = (value) => {
    const type = typeof value;
    // console.log('checkType', type);

    //value is string
    if (type === 'string') {
      //value is url
      if (isValidHttpUrl(value)) {
        //value is image url
        if (value.match(/\.(jpeg|jpg|gif|png)$/) != null) {
          return <Image src={value} fluid />
        }
        return <a href={value}>{value}</a>
      }
    }
    //boolean
    else if (type === 'boolean') {
      return value.toString();
    }
    return value;
  }

  const isValidHttpUrl = (string) => {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  return (
    <>
      {/* <Container> */}
      <Form className='p-4'>
        <h1>ASIN <i className="bi bi-caret-right-fill"></i> GTIN/EAN/UPC/ISBN</h1>
        <Row>
          <Col>
            <Form.Group
              className="mb-3"
            >
              <Form.Label>ASIN</Form.Label>
              <Form.Control
                name='sourceAsin'
                value={state.get('sourceAsin')}
                onChange={handleStateChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
            >
              <Form.Label>
                Amazon Domain
              </Form.Label>
              <Form.Select
                name='sourceAmazonDomain1'
                value={state.get('sourceAmazonDomain1')}
                onChange={handleStateChange}
              >
                <option value='' disabled>Choose a domain</option>
                {amazonDomains.map(
                  domain => <option value={domain}>{domain}</option>
                )}
              </Form.Select>
            </Form.Group>
            <Button onClick={handleAsinToGtin} className="mb-3">Search</Button>
          </Col>
          <Col>
            {

              state.get('asin_to_gtin_results') &&

              <Table
                responsive
                striped
                bordered
                hover
              >
                <thead>
                  <tr>
                    {
                      state.get('asin_to_gtin_results').map(
                        result => <td>{result.get('format')}</td>
                      )
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    <tr>
                      {
                        state.get('asin_to_gtin_results').map(
                          result => <td>{result.get('value')}</td>
                        )
                      }
                    </tr>
                  }
                </tbody>
              </Table>
            }
          </Col>
        </Row>

        <h1>GTIN/EAN/UPC/ISBN <i className="bi bi-caret-right-fill"></i> ASIN</h1>

        <Form.Group
          className="mb-3"
        >
          <Form.Label>GTIN/EAN/UPC/ISBN</Form.Label>
          <Form.Control
            name='sourceGtin'
            value={state.get('sourceGtin')}
            onChange={handleStateChange}
          />
        </Form.Group>
        <Form.Group
          className="mb-3"
        >
          <Form.Label>Amazon Domain</Form.Label>
          <Form.Select
            name='sourceAmazonDomain2'
            value={state.get('sourceAmazonDomain2')}
            onChange={handleStateChange}
          >
            <option value='' disabled>Choose a domain</option>
            {amazonDomains.map(
              domain => <option value={domain}>{domain}</option>
            )}
          </Form.Select>
        </Form.Group>
        <Button onClick={handleGtinToAsin} className="mb-3">
          Search
        </Button>


        <h3>Columns to include in table</h3>

        {
          state.getIn(['targetAsin', 'product']) &&
          <ProductTable
            columnNames={[...state.get('table').keys()]}
            rows={[[...state.get('table').values()]]}
          />
        }

        {/* {
          state.getIn(['targetAsin', 'product']) &&
          <ProductTable
            columnNames={[
              'GTIN/EAN/UPC/ISBN',
              'title',
              // 'asin',
              // 'rating',
              // 'ratings_total',
              // 'price',
              // 'is_prime',
              // 'is_sold_by_amazon',
              // 'is_fulfilled_by_amazon',
              // 'is_fulfilled_by_third_party',
              // 'is_sold_by_third_party',
              'link',
              'image']}
            rows={
              [
                [
                  state.get('sourceGtin'),
                  state.getIn(['targetAsin', 'product', 'title']),
                  <a href={state.getIn(['targetAsin', 'product', 'link'])}>{state.getIn(['targetAsin', 'product', 'link'])}</a>,
                  <Image src={state.getIn(['targetAsin', 'product', 'images', 0, 'link'])} fluid />
                ],
              ]
            }
          />
        } */}

        {
          state.getIn(['targetAsin', 'product']) &&
          <ColumnSelector
            currentKey='product'
            currentValue={state.getIn(['targetAsin', 'product']).toJS()}
            fullPath='product'
            handleCheckboxToggle={handleCheckboxToggle}
          />
        }
      </Form>
    </>
  )
}

SearchProductsPage.propTypes = {}

export default SearchProductsPage
