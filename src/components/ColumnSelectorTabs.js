import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

//pass to this as props: gtinToAsinResponse
const ColumnSelectorTabs = (props) => {
    const [showChildren, setShowChildren] = useState(false);
    // useEffect(() => {
    //     console.log('ColumnSelectorTabs props change', props)

    //     // deepIterate(props.json);
    //     //   return () => {
    //     //     second
    //     //   }
    // }, [props])

    useEffect(
        () => {
            console.log('ColumnSelectorTabs showChildren change', showChildren)

            // deepIterate(props.json);
            //   return () => {
            //     second
            //   }
        }, [showChildren]
    )


    const handleClick = (event) => {
        console.log('ColumnSelectorTabs handleClick', event.target.name, event.target.value);
        setShowChildren(!showChildren);
    };

    return (
        <>
            {
                //props.currentValue is primitive
                typeof props.currentValue !== 'object' ?
                    <Form.Check
                        name={props.fullPath}
                        onChange={props.handleCheckboxToggle}
                        // label={`${props.currentKey}: ${props.currentValue}`}
                        label={props.currentKey}
                    />
                    :
                    Array.isArray(props.currentValue) ?
                        //props.currentValue is array
                        <>
                            {/* <Button onClick={handleClick}>{props.currentKey}</Button> */}
                            <div>

                                <Button onClick={handleClick} variant='light'>
                                    {/* {props.currentKey} {showChildren ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-right-fill"></i>} */}
                                    <b>
                                        {props.currentKey} {showChildren ? <i className="bi bi-chevron-down"></i> : <i className="bi bi-chevron-right"></i>}
                                    </b>
                                </Button>
                            </div>
                            {showChildren &&
                                <ul>
                                    {
                                        props.currentValue.map(
                                            (value, index) => (
                                                <ColumnSelectorTabs
                                                    currentKey={index}
                                                    currentValue={value}
                                                    fullPath={`${props.fullPath}.${index}`}
                                                    handleCheckboxToggle={props.handleCheckboxToggle}
                                                />
                                            )
                                        )
                                    }
                                </ul>
                            }
                        </>
                        :
                        //props.currentValue is object
                        <>
                            {/* <Button onClick={handleClick}>{props.currentKey}</Button> */}
                            <div>
                                <Button onClick={handleClick} variant='light'>
                                    <b>
                                        {props.currentKey} {showChildren ? <i className="bi bi-chevron-down"></i> : <i className="bi bi-chevron-right"></i>}
                                    </b>
                                </Button>
                            </div>
                            {showChildren &&
                                <ul>
                                    {
                                        Object.entries(props.currentValue).map(
                                            ([key, value]) => (
                                                <ColumnSelectorTabs
                                                    currentKey={key}
                                                    currentValue={value}
                                                    fullPath={`${props.fullPath}.${key}`}
                                                    handleCheckboxToggle={props.handleCheckboxToggle}
                                                />
                                            )
                                        )
                                    }
                                </ul>
                            }
                        </>
            }
        </>
    )
}

ColumnSelectorTabs.propTypes = {
    currentKey: PropTypes.string,
    currentValue: PropTypes.any,
    fullPath: PropTypes.string,
    handleCheckboxToggle: PropTypes.func
}

export default ColumnSelectorTabs