import FullLayout from '@/src/layouts/FullLayout'
import React, { useState } from 'react'
import {
    Card,
    Row,
    Col,
    CardTitle,
    CardBody,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
} from 'reactstrap';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddProduct() {

    const [productInfo, setProductInfo] = useState({
        title: "",
        desc: "",
        img: "",
        slug: "",
        color: "",
        size: "",
        category: "",
        price: "",
        availableQty: "",
    });

    const handleChange = (info) => {
        setProductInfo(info);
    }

    const addProduct = async (e) => {
        e.preventDefault();

        let slug = productInfo.title.split(" ").join("-") + "-" + productInfo.color[0].toUpperCase() + productInfo.color.slice(1,) + "-" + productInfo.size

        let newProductInfo = productInfo;
        newProductInfo.slug = slug;

        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/addproducts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify([newProductInfo])
        });
        const data = await res.json();

        setProductInfo({
            title: "",
            desc: "",
            img: "",
            slug: "",
            color: "",
            size: "",
            category: "",
            price: "",
            availableQty: "",
        })

        if(data.success){
            toast.success("Product added successfully" , {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              });
              return;
        }
        else{
            toast.error("Failed to add product" , {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              });
              return;
        }
    }

    return (
        <FullLayout>
            <Row className='my-8'>
                <ToastContainer
                    position="bottom-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <Col>
                    {/* --------------------------------------------------------------------------------*/}
                    {/* Card-1*/}
                    {/* --------------------------------------------------------------------------------*/}
                    <Card>
                        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                            Add a New Product
                        </CardTitle>
                        <CardBody>
                            <Form onSubmit={addProduct}>
                                <FormGroup>
                                    <Label for="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={productInfo.title}
                                        onChange={(e) => { handleChange({ ...productInfo, title: e.target.value }) }}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="desc">Description</Label>
                                    <Input
                                        id="desc"
                                        name="desc"
                                        type="textarea"
                                        className='resize-none h-[20vh]'
                                        value={productInfo.desc}
                                        onChange={(e) => { handleChange({ ...productInfo, desc: e.target.value }) }}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="image">Image</Label>
                                    <Input
                                        id="image"
                                        name="image"
                                        type="text"
                                        value={productInfo.img}
                                        onChange={(e) => { handleChange({ ...productInfo, img: e.target.value }) }}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="category">Category</Label>
                                    <Input
                                        id="category"
                                        name="category"
                                        type="text"
                                        value={productInfo.category}
                                        onChange={(e) => { handleChange({ ...productInfo, category: e.target.value }) }}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="size">Size</Label>
                                    <Input
                                        id="size"
                                        name="size"
                                        type="text"
                                        value={productInfo.size}
                                        onChange={(e) => { handleChange({ ...productInfo, size: e.target.value.toUpperCase() }) }}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="color">Color</Label>
                                    <Input
                                        id="color"
                                        name="color"
                                        type="text"
                                        value={productInfo.color}
                                        onChange={(e) => { handleChange({ ...productInfo, color: e.target.value.toLowerCase() }) }}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="price">Price</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={productInfo.price}
                                        onChange={(e) => { handleChange({ ...productInfo, price: e.target.value }) }}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="avalable">Available Quantity</Label>
                                    <Input
                                        id="avalable"
                                        name="avalable"
                                        type="number"
                                        value={productInfo.availableQty}
                                        onChange={(e) => { handleChange({ ...productInfo, availableQty: e.target.value }) }}
                                        required
                                    />
                                </FormGroup>

                                <Button color='primary'>Submit</Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </FullLayout>
    )
}

export default AddProduct
