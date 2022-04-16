import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import responseDataJson from '../bluecart sample/response_data.json';

function InputForm() {
    const [dataType, setDataType] = useState("product");
    const [itemId, setItemId] = useState("782866746");

    useEffect(() => {
        console.log(itemId);

        // return () => {
        //     second
        // }
    }, [itemId]);

    const handleItemIdChange = (event) => {
        event.preventDefault();
        setItemId(event.target.value);
    };

    const handleClick = async (event) => {
        console.log('handleClick');
        // console.log(event);
        const responseData = await makeRequest();
        console.log(responseData);
        const imageUris = responseData.product.images;
        console.log(imageUris);
        imageUris.forEach(
            async (imageUri) => {
                try {
                    console.log(imageUri.link);
                    saveAs(imageUri.link, imageUri.link);
                    // const imageBlob = await axios.get(imageUri.link, { responseType: 'blob' });
                    // fileDownload(imageBlob, 'image.jpg');
                } catch (error) {
                    // handle error
                    console.error(error);
                }
            }
        );

        // const downloadFile = async (url, path) => {
        //     try {
        //       const response = await axios({
        //         method: "GET",
        //         url: url,
        //         responseType: "stream",
        //       });
        //       // Do something with the response
        //     } catch (err) {
        //       // Handling errors
        //     }
        //   };
    };

    const makeRequest = async () => {
        // set up the request parameters
        const params = {
            api_key: "DD6FBCFBDB1C4C00925A105CE5DD9C0E",
            type: dataType,
            item_id: itemId
        }

        console.log({ params });
        // make the http GET request to BlueCart API
        // try {
        //     // const response = await axios.get('https://api.bluecartapi.com/request?api_key=DD6FBCFBDB1C4C00925A105CE5DD9C0E&type=product&item_id=782866746');
        //     const response = await axios.get('https://api.bluecartapi.com/request', { params });
        //     console.log(response);
        //     return response.data; 
        // } catch (error) {
        //     // handle error
        //     console.error(error);
        // }

        // console.log(response_data);
        return responseDataJson;
    }

    return (
        <Container>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Product ID"
                    value={itemId}
                    onChange={handleItemIdChange}
                />
                <Button onClick={handleClick}>Enter</Button>
            </InputGroup>
        </Container>
    )
}

InputForm.propTypes = {
    productId: PropTypes.string
}

export default InputForm
