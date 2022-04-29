import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Table from 'react-bootstrap/Table'

const ProductTable = (props) => {
    useEffect(
        () => {
            console.log('ProductTable props change', props)
            // console.log('ProductTable props columnNames', props.columnNames?.toJS())
            // console.log('ProductTable props rows', props.rows?.toJS())
        }, [props]
    )

    return (
        <Table
            responsive
            striped
            bordered
            hover
            size="sm"
        >
            <thead>
                <tr>
                    {
                        props.columnNames?.map(
                            columnName => <td>{columnName}</td>
                        )
                    }
                </tr>
            </thead>
            <tbody>
                {
                    props.rows?.map(
                        (row, rowIndex) => (
                            <tr>
                                {
                                    row?.map(
                                        (cell, columnIndex) => (
                                            props.showCells.get(rowIndex).get(columnIndex) && <td>{cell}</td>
                                        )
                                    )
                                }
                            </tr>
                        )
                    )
                }
            </tbody>
        </Table>
    )

}

ProductTable.propTypes = {
    columnNames: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.arrayOf(PropTypes.any),
    table: PropTypes.object
}

/* <Table
responsive
striped
bordered
hover
>
<thead>
    <tr>
        {
            props.columnNames.map(
                columnName => <td>{columnName}</td>
            )
        }
    </tr>
</thead>
<tbody>
    <tr>
        {
            props.rows.map(
                row => row.map(
                    cell => (
                        <td>
                            {cell}
                        </td>
                    )
                )
            )
        }

    </tr>
</tbody>
</Table> */

/* <td>{state.get('sourceGtin')}</td>
<td>{state.getIn(['targetAsin', 'product', 'title'])}</td>
<td>{state.getIn(['targetAsin', 'product', 'asin'])}</td>
<td>{state.getIn(['targetAsin', 'product', 'rating'])}</td>
<td>{state.getIn(['targetAsin', 'product', 'ratings_total'])}</td>
<td>{state.getIn(['targetAsin', 'product', 'buybox_winner', 'price', 'raw'])}</td>
<td>{state.getIn(['targetAsin', 'product', 'buybox_winner', 'is_prime'])?.toString()}</td>
<td>{state.getIn(['targetAsin', 'product', 'buybox_winner', 'fulfillment', 'is_sold_by_amazon'])?.toString()}</td>
<td>{state.getIn(['targetAsin', 'product', 'buybox_winner', 'fulfillment', 'is_fulfilled_by_amazon'])?.toString()}</td>
<td>{state.getIn(['targetAsin', 'product', 'buybox_winner', 'fulfillment', 'is_fulfilled_by_third_party'])?.toString()}</td>
<td>{state.getIn(['targetAsin', 'product', 'buybox_winner', 'fulfillment', 'is_sold_by_third_party'])?.toString()}</td>
<td><a href={state.getIn(['targetAsin', 'product', 'link'])}>{state.getIn(['targetAsin', 'product', 'link'])}</a></td>
<td><Image src={state.getIn(['targetAsin', 'product', 'images', 0, 'link'])} fluid /></td> */

export default ProductTable