import FullLayout from '@/src/layouts/FullLayout'
import React from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import user from "@/src/assets/images/users/user2.jpg";
import Image from 'next/image';
function Orders({ orders }) {
    console.log(orders)
    return (
        <FullLayout>
            <Row>
                {/* --------------------------------------------------------------------------------*/}
                {/* table-1*/}
                {/* --------------------------------------------------------------------------------*/}
                <Col lg="12">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Order Listing</CardTitle>
                            <CardSubtitle className="mb-2 text-muted" tag="h6">
                                Overview of all the orders
                            </CardSubtitle>
                            <div className="table-responsive">
                                <Table className="text-nowrap mt-3 align-middle" borderless>
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Paymnet Mode</th>

                                            <th>Delivery Status</th>
                                            <th>Pincode</th>
                                            <th>Amount(₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((tdata, index) => (
                                            <tr key={index} className="border-top">
                                                <td>
                                                    <div className="d-flex align-items-center p-2">
                                                        <Image
                                                            src={user}
                                                            className="rounded-circle"
                                                            alt="avatar"
                                                            width="45"
                                                            height="45"
                                                        />
                                                        <div className="ms-3">
                                                            <h6 className="mb-0">{tdata.paymentDetails.email}</h6>
                                                            <span className="text-muted">{tdata.paymentDetails.contact}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{tdata.paymentDetails.method[0].toUpperCase()}{tdata.paymentDetails.method.slice(1,)}</td>
                                                <td>
                                                    {tdata.deliveryStatus === "Failed" ? (
                                                        <span className="p-2 bg-danger rounded-circle d-inline-block ms-3" />
                                                    ) : tdata.deliveryStatus === "Order processing" ? (
                                                        <span className="p-2 bg-warning rounded-circle d-inline-block ms-3" />
                                                    ) : (
                                                        <span className="p-2 bg-success rounded-circle d-inline-block ms-3" />
                                                    )}
                                                </td>
                                                <td>{tdata.pincode}</td>
                                                <td>{tdata.amount}</td>
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getallorders`);
    const orders = await res.json();

    return { props: { orders } }
}

export default Orders
