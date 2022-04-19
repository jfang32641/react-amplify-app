import axios from 'axios';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import responseDataJson from '../requests/bluecart/response_data.json';
import { createBestsellersRequestAmazonDomainAndCategoryId, createDemoBestsellersRequestWithUrl } from '../requests/rainforest/bestsellers/bestsellers';
import standardRootCategoriesResponse from '../requests/rainforest/categories/standardRootCategoriesResponse.json';
import bestsellersRootCategoriesResponse from '../requests/rainforest/bestsellers/bestsellersRootCategoriesResponse.json';
import bestsellersAppliancesResponse from '../requests/rainforest/bestsellers/bestsellersAppliancesResponse.json'
import bestsellersOfficeProductsResponse from '../requests/rainforest/bestsellers/bestsellersOfficeProductsResponse.json'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import { makeHttpRequest } from '../requests/Http';

function BestsellersPage() {
    const [dataType, setDataType] = useState("product");
    const [itemId, setItemId] = useState("782866746");

    useEffect(() => {
        console.log(itemId);
        // return () => {
        //     second
        // }
    }, [itemId]);

    const [bestsellers, setBestsellers] = useState([]);
    useEffect(() => {
        console.log('bestsellers changed', bestsellers);
        // return () => {
        //     second
        // }
    }, [bestsellers]);

    const [rootCategories, setRootCategories] = useState(bestsellersRootCategoriesResponse.categories);
    const [rootCategoryIndex, setRootCategoryIndex] = useState();
    useEffect(() => {
        console.log('rootCategoryIndex changed', rootCategoryIndex);
        // return () => {
        //     second
        // }
    }, [rootCategoryIndex]);

    //change itemId 
    const handleItemIdChange = (event) => {
        event.preventDefault();
        setItemId(event.target.value);
    };

    const handleClick = async (event) => {
        console.log('handleClick');
        // console.log(event);
        const responseData = await makeRequest();
        console.log(responseData);

        //pull imageUris from config, responseData[config.images]
        const imageUris = responseData.product.images;
        console.log(imageUris);
        downloadImages(imageUris);
    };

    //download images given list of uris
    const downloadImages = (imageUris) => {
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
    }



    //DUMMY: make request to bluecart
    const makeRequest = async () => {
        // set up the request parameters
        const params = {
            // api_key: "DD6FBCFBDB1C4C00925A105CE5DD9C0E",
            api_key: "demo",
            type: dataType,
            item_id: itemId
        }

        console.log({ params });
        // make the http GET request to BlueCart API
        try {
            // const response = await axios.get('https://api.bluecartapi.com/request?api_key=DD6FBCFBDB1C4C00925A105CE5DD9C0E&type=product&item_id=782866746');
            const response = await axios.get('https://api.bluecartapi.com/request', { params });
            console.log(response);
            return response.data;
        } catch (error) {
            // handle error
            console.error(error);
        }

        // console.log(response_data);
        return responseDataJson;
    }

    const handleBestsellersCategorySelect = async (event, index) => {
        console.log('handleBestsellersCategorySelect', index);
        setRootCategoryIndex(index);
        // console.log('rootCategories', rootCategories);
        // console.log('rootCategory', rootCategories[index]);

        try {
            const request = createBestsellersRequestAmazonDomainAndCategoryId(rootCategories[index].domain, rootCategories[index].id);
            // const response = await makeHttpRequest(request);
            // setBestsellers(response.data.bestsellers);

            console.log('handleBestsellersCategorySelect index mod 2', index % 2 === 0)
            if (index % 2 === 0) {
                setBestsellers(bestsellersAppliancesResponse.bestsellers);
            } else {
                console.log(bestsellersOfficeProductsResponse.bestsellers);
                setBestsellers(bestsellersOfficeProductsResponse.bestsellers);
            }
        } catch (error) {
            console.error(error);
        }

        // const bestsellers = await makeHttpRequest(request);
    }


    const getBestsellersDemo = async () => {
        try {
            const request = createDemoBestsellersRequestWithUrl();
            const response = await makeHttpRequest(request);
            setBestsellers(response.data.bestsellers);
            return response.data.bestsellers;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {/* <Container> */}
            <h1>Best Sellers by Category</h1>
            {/* <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Product ID"
                    value={itemId}
                    onChange={handleItemIdChange}
                />
                <Button onClick={handleClick}>Download Images</Button>
                <Button onClick={getBestsellers}>Demo Bestsellers</Button>
                {bestsellers.map(
                    bestseller => (
                        <div>
                            {JSON.stringify(bestseller, null, '\t')}
                        </div>
                    )
                )}
            </InputGroup> */}

            {/* <Row> */}
            {/* <Col> */}
            {/* <ButtonGroup
                        vertical
                    > */}
            {rootCategories.map(
                (rootCategory, index) => (
                    <Button variant="outline-dark" onClick={(e) => handleBestsellersCategorySelect(e, index)}>{rootCategory.name}</Button>
                )
            )}
            {/* </ButtonGroup> */}
            {/* {bestsellers.map(
                        bestseller => (
                            Object.entries(bestseller).map(
                                ([key, value]) => (
                                    // console.log(key);
                                    <div>{key} {JSON.stringify(value)}</div>
                                )
                            )
                        )
                    )} */}
            {/* </Col> */}
            {/* <Col> */}
            <Table
                responsive
                striped
                bordered
                hover
                variant="dark"
            >
                <thead>
                    <tr>
                        {/* {Array.from({ length: 12 }).map((_, index) => (
                                    <th key={index}>Table heading</th>
                                ))} */}
                        <td>rank</td>
                        <td>title</td>
                        <td>asin</td>
                        <td>price</td>
                        <td>price_lower</td>
                        <td>price_upper</td>
                        <td>rating</td>
                        <td>ratings_total</td>
                        <td>link</td>
                        <td>image</td>
                    </tr>
                </thead>
                <tbody>
                    {bestsellers.map(
                        bestseller => (
                            <tr>
                                <td>{bestseller.rank}</td>
                                <td>{bestseller.title}</td>
                                <td>{bestseller.asin}</td>
                                <td>{bestseller.price?.raw}</td>
                                <td>{bestseller.price_lower?.raw}</td>
                                <td>{bestseller.price_upper?.raw}</td>
                                <td>{bestseller.rating}</td>
                                <td>{bestseller.ratings_total}</td>
                                <td><a href={bestseller.link}>{bestseller.link}</a></td>
                                <td><Image src={bestseller.image} rounded /></td>
                            </tr>
                        )
                    )}
                </tbody>
            </Table>
            {/* </Col> */}
            {/* </Row> */}
            {/* </Container > */}
        </>
    )
}

BestsellersPage.propTypes = {
    productId: PropTypes.string
}

export default BestsellersPage
