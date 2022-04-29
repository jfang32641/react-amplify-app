import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Offcanvas from 'react-bootstrap/Offcanvas'
import productCsvFields from '../requests/rainforest/products/productCsvFields.json'

const ColumnSelectorOffcanvas = props => {
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
                    {/* {
                        productCsvFields.map(
                            columnName => (
                                <Form.Check
                                    // name={props.fullPath}
                                    // onChange={props.handleCheckboxToggle}
                                    // label={`${props.currentKey}: ${props.currentValue}`}
                                    label={columnName}
                                />)
                        )
                    } */}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

ColumnSelectorOffcanvas.propTypes = {}

export default ColumnSelectorOffcanvas