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
import Immutable from 'immutable'

const defaultSelectedColumnsSet = new Set(defaultSelectedColumns);

const TestPage = props => {
    const [allColumnNames, setAllColumnNames] = useState([]);
    // const [columnNamesChecked, setColumnNamesChecked] = useState(new Set());
    const [columnNamesChecked, setColumnNamesChecked] = useState(Immutable.OrderedSet());
    const [columnNamesCheckedOrder, setColumnNamesCheckedOrder] = useState(Immutable.OrderedMap());
    const [rows, setRows] = useState(Immutable.List());
    const [columnNameToIndex, setColumnNameToIndex] = useState(new Map());
    const [response, setResponse] = useState({});
    // const [columns, setColumns] = useState(new Map());

    const [showCells, setShowCells] = useState(Immutable.List());

    useEffect(() => {
        console.log('columnNamesCheckedOrder', columnNamesCheckedOrder.toJS())
        //   return () => {
        //     second
        //   }
    }, [columnNamesCheckedOrder])

    useEffect(() => {
        console.log('columnNamesChecked', columnNamesChecked.toJS())
        //   return () => {
        //     second
        //   }
    }, [columnNamesChecked])




    const handleClick = async (event) => {
        const queryParameters = new QueryParametersBuilder()
            .setApiKey('0154B88F93664951A817749ECD19092F')
            .setType('product')
            .setAmazonDomain('amazon.com')
            .setGtin('810038852775')
            .setOutput('csv')
            // .setCsvFields(csvFields)
            .build();

        const request = new AxiosRequestConfigBuilder()
            .setBaseUrl(process.env.REACT_APP_AMAZON_BASE_URL)
            // .setMethod('post')
            // .setUrl('/request')
            .setParams(queryParameters)
            .build();

        console.log('request', request);

        try {
            //MAKE HTTP REQUEST
            console.log('makeHttpRequest request', request);
            const response = await axios(request);
            console.log('makeHttpRequest response', response);
            setResponse(response);

            //SET COLUMN NAMES
            //SET COLUMN NAME:INDEX MAPPING
            const newAllColumnNames = [];
            // const newColumnNamesChecked = new Set();
            let newColumnNamesChecked = Immutable.OrderedSet();
            let newColumnNamesCheckedOrder = Immutable.OrderedMap();

            const newColumnNameToIndex = new Map();
            let columnNameIndex = 0;
            let columnNameCheckedIndex = 0;

            response.data.column_names.forEach(
                (columnName) => {
                    newAllColumnNames.push(columnName);
                    newColumnNameToIndex.set(columnName, columnNameIndex++);
                    if (defaultSelectedColumnsSet.has(columnName)) {
                        newColumnNamesChecked = newColumnNamesChecked.add(columnName);
                        newColumnNamesCheckedOrder = newColumnNamesCheckedOrder.set(columnName, columnNameCheckedIndex++);
                    }
                }
            )


            //SET ROWS
            let newRows = Immutable.List();
            response.data.rows.forEach(
                row => {
                    let newRow = Immutable.List();
                    newColumnNamesChecked.forEach(
                        columnName => {
                            const rowIndex = newColumnNameToIndex.get(columnName);
                            const cell = row[rowIndex];
                            newRow = newRow.push(cell);
                        }
                    )
                    newRows = newRows.push(newRow);
                }
            )

            // console.log('newColumnNamesCheckedOrder', newColumnNamesCheckedOrder);
            // console.log('newAllColumnNames', newAllColumnNames);
            // console.log('newColumnNameToIndex', newColumnNameToIndex);
            // console.log('newColumnNamesChecked', newColumnNamesChecked);
            // console.log('newRows', newRows);

            setColumnNamesCheckedOrder(newColumnNamesCheckedOrder)
            setAllColumnNames(newAllColumnNames);
            setColumnNamesChecked(newColumnNamesChecked);
            setColumnNameToIndex(newColumnNameToIndex)
            setRows(newRows);
        } catch (error) {
            console.error(error);
        }
    }


    const findInsertIndex = (columnName) => {

    }

    const handleCheckboxToggle = (event) => {
        console.log('handleCheckboxToggle name', event.target.name);
        console.log('handleCheckboxToggle checked', event.target.checked);

        const columnName = event.target.name;

        let newColumnNamesCheckedOrder = columnNamesCheckedOrder;
        let newColumnNamesChecked = columnNamesChecked;
        let newRows = rows;

        //checkbox checked, add column
        if (event.target.checked) {
            //find the index to insert
            console.log('handleCheckboxToggle columnNameToIndex', columnNameToIndex)
            console.log('handleCheckboxToggle columnNamesChecked', columnNamesChecked)


            newColumnNamesChecked = columnNamesChecked.add(columnName);
            //ADD COLUMN TO EACH ROW
            newRows.forEach(
                (row, rowIndex) => {
                    // //get value from response.rows
                    // const columnIndex = columnNameToIndex.get(columnName);
                    // const value = response.data.rows[rowIndex][columnIndex]

                    // //push value to row
                    // row = row.push(value);

                    // //update newRows with row
                    // newRows = newRows.set(rowIndex, row);
                }
            )
        }
        //checkbox unchecked, remove column
        else {
            //swap
            const currentIndex = columnNamesCheckedOrder.get(columnName);
            console.log('columnNamesCheckedOrder currentIndex', currentIndex);
            const lastIndex = columnNamesCheckedOrder.get()
            newColumnNamesChecked = columnNamesChecked.delete(columnName);

            //REMOVE COLUMN
            newRows.forEach(
                (row, rowIndex) => {

                    //update newRows with rows
                    // newRows = newRows.set(rowIndex, row);
                }
            )
        }

        setColumnNamesCheckedOrder(newColumnNamesCheckedOrder);
        setRows(newRows);
        setColumnNamesChecked(newColumnNamesChecked);
    };

    // OFFCANVAS
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>

            <Button variant="primary" onClick={handleShow}>
                Columns
            </Button>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Columns</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {
                        allColumnNames.map(
                            columnName => (
                                <Form.Check
                                    name={columnName}
                                    onChange={handleCheckboxToggle}
                                    checked={columnNamesChecked.has(columnName)}
                                    label={columnName}
                                />
                            )
                        )
                    }
                </Offcanvas.Body>
            </Offcanvas>
            <Button onClick={handleClick}>Create Table</Button>
            <ProductTable
                // columnNames={columns}
                columnNames={columnNamesChecked}
                rows={rows}
            />
        </>
    )
}

TestPage.propTypes = {}

export default TestPage

    // const [file, setFile] = useState();
    // useEffect(() => {
    //     console.log('fileChange', file)
    //     //   return () => {
    //     //     second
    //     //   }
    // }, [file])

/* <div style={{ textAlign: "center" }}>
        <h1>REACTJS CSV IMPORT EXAMPLE </h1>
        <form>
            <input
                type={"file"}
                id={"csvFileInput"}
                accept={".csv"}
                onChange={handleOnChange}
            />

            <button
                onClick={(e) => {
                    handleOnSubmit(e);
                }}
            >
                IMPORT CSV
            </button>
        </form>
    </div> */

//upload csv
    // const fileReader = new FileReader();
    // const handleOnChange = (e) => {
    //     setFile(e.target.files[0]);
    // };
    // const handleOnSubmit = (e) => {
    //     e.preventDefault();

    //     if (file) {
    //         fileReader.onload = (event) => {
    //             const csvString = event.target.result;
    //             console.log('csvString', csvString);
    //             const results = Papa.parse(csvString);
    //             console.log('results', results);
    //             //TODO:HOW TO HANDLE ERROR?
    //         }
    //         fileReader.readAsText(file);
    //     }
    // };

    // const [table, setTable] = useState(
    //     fromJS(
    //         {
    //             columnNameToIndex: OrderedMap({
    //                 gtin: 0,
    //                 domain: 1
    //             }),
    //             columnNames: ['gtin', 'domain'],
    //             rows: []
    //         }
    //     )
    // );


    // const [file, setFile] = useState();
// useEffect(() => {
//     console.log('fileChange', file)
//     //   return () => {
//     //     second
//     //   }
// }, [file])

/* <div style={{ textAlign: "center" }}>
        <h1>REACTJS CSV IMPORT EXAMPLE </h1>
        <form>
            <input
                type={"file"}
                id={"csvFileInput"}
                accept={".csv"}
                onChange={handleOnChange}
            />

            <button
                onClick={(e) => {
                    handleOnSubmit(e);
                }}
            >
                IMPORT CSV
            </button>
        </form>
    </div> */

//upload csv
    // const fileReader = new FileReader();
    // const handleOnChange = (e) => {
    //     setFile(e.target.files[0]);
    // };
    // const handleOnSubmit = (e) => {
    //     e.preventDefault();

    //     if (file) {
    //         fileReader.onload = (event) => {
    //             const csvString = event.target.result;
    //             console.log('csvString', csvString);
    //             const results = Papa.parse(csvString);
    //             console.log('results', results);
    //             //TODO:HOW TO HANDLE ERROR?
    //         }
    //         fileReader.readAsText(file);
    //     }
    // };

    // const [table, setTable] = useState(
    //     fromJS(
    //         {
    //             columnNameToIndex: OrderedMap({
    //                 gtin: 0,
    //                 domain: 1
    //             }),
    //             columnNames: ['gtin', 'domain'],
    //             rows: []
    //         }
    //     )
    // );