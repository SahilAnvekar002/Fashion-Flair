import React from 'react'
import FullLayout from '@/src/layouts/FullLayout'
import { Row, Col } from "reactstrap";
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";

function ViewProducts({products}) {
    return (
        <FullLayout>
            <Row>
                {/* --------------------------------------------------------------------------------*/}
                {/* table-1*/}
                {/* --------------------------------------------------------------------------------*/}
                <Col lg="12">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Product Listing</CardTitle>
                            <CardSubtitle className="mb-2 text-muted" tag="h6">
                                Overview of all the products
                            </CardSubtitle>
                            <div className="table-responsive">
                                <Table className="text-nowrap mt-3 align-middle" borderless>
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Category</th>

                                            <th>Size</th>
                                            <th>Color</th>
                                            <th>Price(₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((tdata, index) => (
                                            <tr key={index} className="border-top">
                                                <td>
                                                    <div className="d-flex align-items-center p-2">
                                                        <div className="ms-3">
                                                            <h6 className="mb-0">{tdata.title}</h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{tdata.category}</td>
                                                <td>
                                                    {tdata.size}
                                                </td>
                                                <td>{tdata.color[0].toUpperCase()}{tdata.color.slice(1,)}</td>
                                                <td>{tdata.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                {/* --------------------------------------------------------------------------------*/}
                {/* table-2*/}
                {/* --------------------------------------------------------------------------------*/}

            </Row>
        </FullLayout>
    )
}

export async function getServerSideProps() {

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getallproducts`);
    const products = await res.json();

    return { props: { products } }
}

export default ViewProducts
