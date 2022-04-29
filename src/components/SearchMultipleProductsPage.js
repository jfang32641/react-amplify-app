import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import amazonDomains from '../requests/rainforest/domains.json'
import { fromJS, OrderedMap, OrderedSet } from 'immutable'
import InputGroup from 'react-bootstrap/InputGroup'
import ProductTable from './ProductTable'
import { QueryParametersBuilder } from '../requests/QueryParametersBuilder'
import { AxiosRequestConfigBuilder } from '../requests/AxiosRequestConfigBuilder'
import gtinToAsinResponse from '../requests/rainforest/products/gtinToAsinResponse.json'
import { makeHttpRequest } from '../requests/Http'
import axios from 'axios'
import productCsvFields from '../requests/rainforest/products/productCsvFields.json'
import Offcanvas from 'react-bootstrap/Offcanvas'
import ColumnSelector from './ColumnSelector'
import { convertValueToComponent } from '../utils/ComponentUtils'
import Immutable from 'immutable'
//add remove getrandom: swap and remove from start/end for O(1)
// const mapping = {
//     'price':
// }
const defaultColumnNames = [
    'gtin',
    'domain',
    'product.asin',
];

const SearchMultipleProductsPage = props => {
    const [state, setState] = useState(
        fromJS({
            inputGroups: [
                { //request is a function of gtin/domain
                    gtin: '',
                    domain: '',
                    result: {},
                    // result: {
                    //     status: 'fulfilled',
                    //     value: gtinToAsinResponse
                    // }
                    // result: {
                    //     status: 'rejected',
                    //     reason: {}
                    // }
                }
            ],
        })
    );

    useEffect(
        () => {
            console.log('SearchMultipleProductsPage state change', state.toJS())
            // return () => {
            //     second
            // }
        }, [state]
    );

    const [columnIterationOrder, setColumnIterationOrder] = [0, 1];
    const [rowIterationOrder, setRowIterationOrder] = [];

    const [table, setTable] = useState(
        fromJS(
            {
                columnNameToIndex: OrderedMap({
                    gtin: 0,
                    domain: 1
                }),
                columnNames: ['gtin', 'domain'],
                rows: []
            }
        )
    );

    useEffect(
        () => {

            console.log('SearchMultipleProductsPage table change', table)
            // return () => { 
            // }
        }, [table]
    );

    const [columns, setColumns] = useState(
        fromJS([
            // each list is a column
            // ['gtin', 'gtin0', 'gtin1', 'gtin2'],
            // ['domain', 'domain0', 'domain1', 'domain2'],
        ])
    );

    const handleChange = (event) => {
        // console.log('SearchMultipleProductsPage name', event.target.name, typeof event.target.name);
        // console.log('SearchMultipleProductsPage value', event.target.value);
        // console.log('-------------------------------');

        const path = event.target.name.split('.');
        const newState = state.setIn(path, event.target.value);
        setState(newState);
    };

    const addInputGroup = (event) => {
        // console.log('SearchMultipleProductsPage name', event.target.name, typeof event.target.name);
        const newInputGroup = fromJS({
            gtin: '',
            domain: '',
            result: {},
        });
        const newInputGroups = state.get('inputGroups').push(newInputGroup);
        const newState = state.set('inputGroups', newInputGroups);
        setState(newState);
    };

    const removeInputGroupAndRow = (event) => {
        // console.log('SearchMultipleProductsPage remove', event.currentTarget.name, event.currentTarget.value)
        const index = event.currentTarget.name;

        //delete entry from state
        const newInputGroups = state.get('inputGroups').delete(index);
        const newState = state.set('inputGroups', newInputGroups);
        setState(newState);

        //delete entry from table
        const newTable = table.deleteIn(['rows', index]);
        setTable(newTable);

        //delete row from columns
        // const newColumns = columns;
        // columns.forEach(
        //     column => {
        //         //add a dummy element to the end of each column
        //         column.push('dummy');
        //         //swap 
        //     }
        // )
    };

    const buildRequest = (index) => {
        // console.log('SearchMultipleProductsPage search', event.currentTarget.name);
        // const index = event.currentTarget.name;
        const gtin = state.getIn(['inputGroups', index, 'gtin']);
        const amazonDomain = state.getIn(['inputGroups', index, 'domain']);

        const queryParameters = new QueryParametersBuilder()
            .setApiKey(process.env.REACT_APP_AMAZON_KEY)
            .setType('product')
            .setAmazonDomain(amazonDomain)
            .setGtin(gtin)
            .build();

        const request = new AxiosRequestConfigBuilder()
            .setBaseUrl(process.env.REACT_APP_AMAZON_BASE_URL)
            .setUrl('/request')
            .setParams(queryParameters)
            .build()

        return request;
    };

    const createDummyPromise = () => {
        return Promise.resolve(gtinToAsinResponse);
    };

    //HANDLE WHEN USER CLICKS CREATE TABLE
    const createTable = async (event) => {

        //create request for each input group
        const promises = [];
        promises.push(createDummyPromise()); //bump

        state.get('inputGroups').forEach(
            (inputGroup, index) => (
                promises.push(axios(buildRequest(index)))
            )
        );

        console.log('SearchMultipleProductsPage createTable promises', promises);

        Promise.allSettled(promises).then(
            (results) => {

                let newState = state;
                let newTable = table;

                results.forEach(
                    (result, index) => {
                        //TODO, check columnName i.e. value.result.product.title
                        newState = newState.setIn(['inputGroups', index, 'result'], result);
                        const inputGroup = newState.getIn(['inputGroups', index]);
                        // console.log('inputGroup', inputGroup);

                        const columnNames = table.get('columnNames');
                        const newRow = columnNames.map(
                            //ADD MAPPING: E.G. title = value.result.product.title
                            columnName => inputGroup.getIn(columnName.split('.'))
                        );
                        // console.log('newRow', newRow);
                        // const newRow = [];
                        newTable = newTable.setIn(['rows', index], newRow);
                    }
                )
                //update state and table
                setState(newState);
                setTable(newTable);

                //update rows
                //columnNames.map?
                // columnName = newTable = newTable.setIn(['rows',index],)
                // state.get('inputGroups').map(
                //     inputGroup => (
                //         state.get('columnNames').map(columnName => inputGroup.get(columnName))
                //     )
                // )
            }
        )
    };

    //HANDLE WHEN USER CLICKS CHECKBOX IN COLUMN SELECTOR
    //ADD A COLUMN TO TABLE
    const handleCheckboxToggle = (event) => {
        const columnName = event.target.name;

        console.log('SearchMultipleProductsPage handleCheckboxToggle', event.target.name, event.target.checked);

        //checkbox checked, add column to table
        if (event.target.checked) {
            //add columnName to columnNAmes
            let newColumnNames = table.get('columnNames').push(columnName);
            console.log('newColumnNames', newColumnNames);

            //add columnName:index mapping
            const columnNameToIndex = table.get('columnNameToIndex');
            const newColumnNameToIndex = columnNameToIndex.set(columnName, columnNameToIndex.size);
            console.log('newColumnNameToIndex', newColumnNameToIndex);

            //add value to each row
            let newRows = Immutable.List()
            table.get('rows').forEach(
                (row, index) => {
                    // value = convertValueToComponent(value);
                    console.log('oldRow', row);
                    let value = state.getIn(`inputGroups.${index}.result.value.product.${columnName}`.split('.'));
                    value = convertValueToComponent(value);
                    const newRow = row.push(value);
                    console.log('newRow', newRow);
                    newRows = newRows.push(newRow);
                }
            )
            console.log('newRows', newRows);


            table.set('columnNames', newColumnNames);
            table.set('columnNameToIndex', newColumnNameToIndex);
            table.set('rows', newRows);
            const newTable = table.set('columnNameToIndex', newColumnNameToIndex);
            setTable(newTable);



            // //{} -> {columnName: [columnValue]}
            // //get value from targetAsin
            // let value = state.get('targetAsin').getIn(fullPath.split('.'));

            // //table:{} -> table:{fullPath:value}
            // value = convertValueToComponent(value);
            // const newState = state.setIn(['table', fullPath], value);
            // setState(newState);
        }
        //checkbox unchecked, remove column
        else {
            // delete columnName

            // let newColumnNames = table.get('columnNames').delete(columnName);
            // console.log('newColumnNames', newColumnNames);

            //delete columnName:index mapping
            const newColumnNameToIndex = table.get('columnNameToIndex').delete(columnName);
            console.log('newColumnNameToIndex', newColumnNameToIndex);
            const newTable = table.set('columnNameToIndex', newColumnNameToIndex);
            setTable(newTable);

            // const newState = state.deleteIn(['table', fullPath])
            // setState(newState);
        }
    };

    //OFFCANVAS
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Form className='p-4'>
                {
                    state.get('inputGroups').map(
                        (inputGroup, index) => (
                            <InputGroup className="mb-3">
                                <Form.Group as={Col}>
                                    <FloatingLabel
                                        label="GTIN/EAN/UPC/ISBN"
                                    >
                                        <Form.Control
                                            name={`inputGroups.${index}.gtin`}
                                            value={state.getIn(['inputGroups', index, 'gtin'])}
                                            onChange={handleChange}
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <FloatingLabel
                                        label="Domain"
                                    >
                                        <Form.Select
                                            name={`inputGroups.${index}.domain`}
                                            value={state.getIn(['inputGroups', index, 'domain'])}
                                            onChange={handleChange}
                                        >
                                            <option value='' disabled></option>
                                            {
                                                amazonDomains.map(
                                                    domain => <option value={domain}>{domain}</option>
                                                )
                                            }
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>

                                <Button
                                    name={index}
                                    onClick={removeInputGroupAndRow}
                                    variant="outline-danger"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </Button>
                            </InputGroup>
                        )
                    )
                }
                <Button
                    onClick={createTable}
                    variant="outline-success"
                >
                    Create Table
                </Button>
                <Button
                    onClick={addInputGroup}
                    variant="outline-primary"
                >
                    {/* <i className="bi bi-plus-lg"></i> */}
                    Add Row
                </Button>
                <Button variant="primary" onClick={handleShow}>
                    Add more columns
                </Button>

                <Offcanvas show={show} onHide={handleClose}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Columns</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <ColumnSelector
                            currentKey='product'
                            currentValue={gtinToAsinResponse.product}
                            // fullPath='product'
                            handleCheckboxToggle={handleCheckboxToggle}
                        />
                    </Offcanvas.Body>
                </Offcanvas>
            </Form>
            {
                // state.getIn(['targetAsin', 'product']) &&
                <ProductTable
                    columnNames={table.get('columnNames')}
                    rows={table.get('rows')}
                // columnNames={state.get('columnNames')}
                // rows={
                //     state.get('inputGroups').map(
                //         inputGroup => (
                //             state.get('columnNames').map(columnName => inputGroup.get(columnName))
                //         )
                //     )
                // }
                // columnNames={[...state.getIn(['inputGroups', '0'])?.keys()]}
                // rows={[[...state.getIn(['inputGroups'])?.values()]]}
                // columnNames={[...state.get('table').keys()]}
                // rows={[[...state.get('table').values()]]}
                />
            }
        </>
    )
}

SearchMultipleProductsPage.propTypes = {}

export default SearchMultipleProductsPage