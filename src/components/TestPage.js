import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { QueryParametersBuilder } from '../requests/QueryParametersBuilder'
import { AxiosRequestConfigBuilder } from '../requests/AxiosRequestConfigBuilder'
import productCsvFields from '../requests/rainforest/products/productCsvFields.json'
import { makeHttpRequest } from '../requests/Http'
import axios from 'axios'
// const papa = require('papaparse');
import Papa from 'papaparse'
import ProductTable from './ProductTable'
import csvResponse from '../requests/rainforest/products/csvResponse.json'
import Offcanvas from 'react-bootstrap/Offcanvas'
import ColumnSelectorOffcanvas from './ColumnSelectorOffCanvas'
import defaultSelectedColumns from '../requests/rainforest/products/defaultSelectedColumns.json'
import Immutable, { fromJS } from 'immutable'
import { convertValueToComponent } from '../utils/ComponentUtils'
import InputGroup from 'react-bootstrap/InputGroup'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Col from 'react-bootstrap/Col'
import amazonDomains from '../requests/rainforest/domains.json'
import { DataBuilder } from '../requests/DataBuilder'
import idTypes from '../requests/rainforest/idTypes.json'

const emptyInputGroup = {
    type: '',
    id: '',
    domain: '',
}

const TestPage = props => {
    const [response, setResponse] = useState({}); //api response
    const [columnNamesChecked, setColumnNamesChecked] = useState(Immutable.OrderedSet());
    const [rows, setRows] = useState(Immutable.List()); //rows representation of response.data.rows, but with 
    const [columnNameToIndex, setColumnNameToIndex] = useState(Immutable.OrderedMap()); //column name to index
    const [showCells, setShowCells] = useState(Immutable.List()); //showCells[i][j] = true means show cell[i][j]
    const [inputGroups, setInputGroups] = useState(
        fromJS(
            [
                emptyInputGroup
            ]
        )
    );

    useEffect(() => {
        console.log('rows', rows.toJS())
        //   return () => {
        //     second
        //   }
    }, [rows])

    useEffect(() => {
        console.log('columnNamesChecked', columnNamesChecked.toJS())
        //   return () => {
        //     second
        //   }
    }, [columnNamesChecked])

    useEffect(() => {
        console.log('inputGroups', inputGroups.toJS())
        //   return () => {
        //     second
        //   }
    }, [inputGroups])

    //HANDLER FOR WHEN USER CLICKS CREATE TABLE
    const createTable = async (event) => {

        // const queryParameters = new QueryParametersBuilder()
        //     // .setApiKey('0154B88F93664951A817749ECD19092F')
        //     .setType('product')
        //     .setAmazonDomain('amazon.com')
        //     .setGtin('810038852775')
        //     .setOutput('csv')
        //     // .setCsvFields(csvFields)
        //     .build();

        const dataBuilder = new DataBuilder()
        inputGroups.forEach(
            inputGroup => dataBuilder.addProduct(
                {
                    type: inputGroup.get('type'),
                    id: inputGroup.get('id'),
                    domain: inputGroup.get('domain'),
                }
            )
        )
        const data = dataBuilder.build();

        console.log('createTable data', data);

        const request = new AxiosRequestConfigBuilder()
            .setBaseUrl(process.env.REACT_APP_AMAZON_BASE_URL)
            .setMethod('post')
            // .setUrl('/request')
            .setData(data)
            // .setParams(queryParameters)
            .build();

        console.log('request', request);

        try {
            //MAKE HTTP REQUEST
            console.log('makeHttpRequest request', request);
            const response = await axios(request);
            console.log('makeHttpRequest response', response);
            setResponse(response);

            // COLUMN NAME: INDEX MAPPING
            // const newAllColumnNames = [];
            const columnNames = response.data.column_names;
            let newColumnNamesChecked = Immutable.OrderedSet(defaultSelectedColumns);
            let newColumnNameToIndex = Immutable.OrderedMap();

            columnNames.forEach(
                (columnName, index) => {
                    // newAllColumnNames.push(columnName);
                    // if (defaultSelectedColumnsSet.has(columnName)) {
                    //     newColumnNamesChecked = newColumnNamesChecked.set(columnName, index);
                    // }
                    newColumnNameToIndex = newColumnNameToIndex.set(columnName, index);
                }
            )

            //SET SHOW CELLS
            let newRows = Immutable.List();
            let newShowCells = Immutable.List();

            Object.entries(response.data.rows).forEach(
                ([key, rows]) => {
                    // console.log('KEY', key)
                    // console.log('ROWS', rows)
                    rows.forEach(
                        row => {
                            let newRow = Immutable.List();
                            let newShowCellsRow = Immutable.List();
                            row.forEach(
                                (cell, index) => {
                                    const columnName = columnNames[index];
                                    newRow = newRow.push(convertValueToComponent(cell));
        
                                    if (newColumnNamesChecked.has(columnName)) {
                                        console.log('hi columnName', columnName);
                                        newShowCellsRow = newShowCellsRow.push(true);
                                    } else {
                                        newShowCellsRow = newShowCellsRow.push(false);
                                    }
        
                                }
                            )
                            newRows = newRows.push(newRow);
                            newShowCells = newShowCells.push(newShowCellsRow);
                        }
                    )
                }
            )
            // response.data.rows.forEach(
            //     row => {
            //         let newRow = Immutable.List();
            //         let newShowCellsRow = Immutable.List();
            //         row.forEach(
            //             (cell, index) => {
            //                 const columnName = columnNames[index];
            //                 newRow = newRow.push(convertValueToComponent(cell));

            //                 if (newColumnNamesChecked.has(columnName)) {
            //                     // console.log('hi columnName', columnName);
            //                     newShowCellsRow = newShowCellsRow.push(true);
            //                 } else {
            //                     newShowCellsRow = newShowCellsRow.push(false);
            //                 }

            //             }
            //         )
            //         newRows = newRows.push(newRow);
            //         newShowCells = newShowCells.push(newShowCellsRow);
            //     }
            // )

            // console.log('newColumnNamesCheckedOrder', newColumnNamesCheckedOrder);
            // console.log('newAllColumnNames', newAllColumnNames);
            // console.log('newRows', newRows);
            // console.log('newShowCells', newShowCells);
            // console.log('newColumnNameToIndex', newColumnNameToIndex.toJS());
            // console.log('newColumnNamesChecked', newColumnNamesChecked.toJS());
            // console.log('newRows', newRows);

            // setColumnNamesCheckedOrder(newColumnNamesCheckedOrder)
            // setAllColumnNames(newAllColumnNames);
            setRows(newRows);
            setShowCells(newShowCells);
            setColumnNamesChecked(newColumnNamesChecked);
            setColumnNameToIndex(newColumnNameToIndex)
            // setRows(newRows);
        } catch (error) {
            console.error(error);
        }
    }

    //HANDLER FOR WHEN USER (DE)SELECTS COLUMN
    const handleColumnCheckboxToggle = (event) => {
        console.log('handleCheckboxToggle name', event.target.name);
        console.log('handleCheckboxToggle checked', event.target.checked);

        const columnName = event.target.name;
        const index = columnNameToIndex.get(columnName);
        console.log('handleCheckboxToggle index', index);

        let newColumnNamesChecked = columnNamesChecked;
        let newShowCells = showCells;

        //checkbox checked, add column
        if (event.target.checked) {
            //add checked column
            newColumnNamesChecked = columnNamesChecked.add(columnName);

            //ADD COLUMN TO EACH ROW
            newShowCells.forEach(
                (row, rowIndex) => {
                    const newRow = row.set(index, true);
                    newShowCells = newShowCells.set(rowIndex, newRow);
                }
            )
        }
        //checkbox unchecked, remove column
        else {
            //delete checked column
            newColumnNamesChecked = columnNamesChecked.delete(columnName);

            //REMOVE COLUMN FROM EACH ROW
            newShowCells.forEach(
                (row, rowIndex) => {
                    const newRow = row.set(index, false);
                    newShowCells = newShowCells.set(rowIndex, newRow);
                }
            )
        }

        // setColumnNamesCheckedOrder(newColumnNamesCheckedOrder);
        setShowCells(newShowCells);
        setColumnNamesChecked(newColumnNamesChecked);
    };



    // OFFCANVAS
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //HANDLER FOR WHEN USER MAKES A CHANGE TO IDTYPE, ID, OR DOMAIN
    const handleInputGroupChange = (event) => {
        console.log('handleInputGroupChange name', event.target.name)
        console.log('handleInputGroupChange value', event.target.value)

        const path = event.target.name.split('.');
        const newInputGroups = inputGroups.setIn(path, event.target.value);
        setInputGroups(newInputGroups);
    };

    //HANDLER FOR WHEN USER ADDS INPUT GROUP
    const addInputGroup = (event) => {
        // console.log('SearchMultipleProductsPage name', event.target.name, typeof event.target.name);
        const newInputGroup = fromJS(emptyInputGroup);
        const newInputGroups = inputGroups.push(newInputGroup);
        setInputGroups(newInputGroups)
    };

    //HANDLER FOR WHEN USER REMOVES INPUT GROUP
    const removeInputGroupAndRow = (event) => {
    };
    return (
        <>
            <Form className='p-1'>
                {
                    inputGroups.map(
                        (inputGroup, index) => (
                            <InputGroup className="mb-3">
                                <Form.Group as={Col} md="auto">
                                    <FloatingLabel
                                        label="ASIN/GTIN/EAN/UPC/ISBN"
                                    >
                                        <Form.Control
                                            name={`${index}.id`}
                                            value={inputGroups.getIn([index, 'id'])}
                                            onChange={handleInputGroupChange}
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group as={Col} md="auto">
                                    <FloatingLabel
                                        label="Type"
                                    >
                                        <Form.Select
                                            name={`${index}.type`}
                                            value={inputGroups.getIn([index, 'type'])}
                                            onChange={handleInputGroupChange}
                                        >
                                            <option value='' disabled></option>
                                            {
                                                idTypes.map(
                                                    idType => <option value={idType.value}>{idType.label}</option>
                                                )
                                            }
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group as={Col} md="auto">
                                    <FloatingLabel
                                        label="Domain"
                                    >
                                        <Form.Select
                                            name={`${index}.domain`}
                                            value={inputGroups.getIn([index, 'domain'])}
                                            onChange={handleInputGroupChange}
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
                    onClick={addInputGroup}
                // variant="outline-primary"
                >
                    {/* <i className="bi bi-plus-lg"></i> */}
                    Add Row
                </Button>

                <Button onClick={createTable}>
                    Create Table
                </Button>

                <Button variant="primary" onClick={handleShow}>
                    Columns
                </Button>

                <Offcanvas show={show} onHide={handleClose}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Columns</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {
                            response.data?.column_names?.map(
                                columnName => (
                                    <Form.Check
                                        name={columnName}
                                        onChange={handleColumnCheckboxToggle}
                                        checked={columnNamesChecked.has(columnName)}
                                        label={columnName}
                                    />
                                )
                            )
                        }
                    </Offcanvas.Body>
                </Offcanvas>

                <ProductTable
                    columnNames={response.data?.column_names?.filter(columnName => columnNamesChecked.has(columnName))}
                    rows={rows}
                    showCells={showCells}
                />
            </Form>
        </>
    )
}

TestPage.propTypes = {}

export default TestPage