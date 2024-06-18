import Head from "next/head";
import { Col, Row } from "reactstrap";
import SalesChart from "../../src/components/dashboard/SalesChart";
import Feeds from "../../src/components/dashboard/Feeds";
import ProjectTables from "../../src/components/dashboard/ProjectTable";
import TopCards from "../../src/components/dashboard/TopCards";
import FullLayout from "@/src/layouts/FullLayout";

export default function Home({orders, total, products, users}) {
  return (
    <FullLayout>
    <div>
      <Head>
        <title>Fashion Flair Admin</title>
        <meta name="description" content="Dashboard which allows admin to add and view products and other details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {/***Top Cards***/}
        <Row>
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-success text-success"
              title="Profit"
              subtitle="Total Earning"
              earning={`₹${total}`}
              icon="bi bi-wallet"
            />
          </Col>
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-danger text-danger"
              title="Orders"
              subtitle="Total Orders"
              earning={`${orders.length}`}
              icon="bi bi-coin"
            />
          </Col>
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-warning text-warning"
              title="Products"
              subtitle="Total Prodcuts"
              earning={`${products.length}`}
              icon="bi bi-basket3"
            />
          </Col>
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-info text-into"
              title="Users"
              subtitle="Total Users"
              earning={`${users.length}`}
              icon="bi bi-person"
            />
          </Col>
        </Row>
        {/***Sales & Feed***/}
        <Row>
          <Col sm="12" lg="6" xl="7" xxl="8" className="xl:max-w-[55vw]">
            <SalesChart orders={orders} />
          </Col>
          <Col sm="12" lg="6" xl="5" xxl="4" >
            <Feeds FeedData={users} />
          </Col>
        </Row>
        {/***Table ***/}
        <Row>
          <Col lg="12" sm="12">
            <ProjectTables tableData={orders} />
          </Col>
        </Row>
    
      </div>
    </div>
    </FullLayout>
  );
}

export async function getServerSideProps() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getallorders`);
  const orders = await res.json();

  let total = 0;

  for(let order of orders){
    total += order.amount;
  }

  const res2 = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getallproducts`);
  const products = await res2.json();
  const res3 = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getallusers`);
  const users = await res3.json();

  return { props: { orders, total, products, users } }
}