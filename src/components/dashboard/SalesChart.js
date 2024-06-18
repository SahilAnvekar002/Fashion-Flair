import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesChart = ({orders}) => {

  function countOrdersByMonth(orders) {
    const monthlyCounts = Array(12).fill(0); // Initialize an array to hold counts for each month

    orders.forEach(order => {
      const createdAt = new Date(order.createdAt); // Convert createdAt to a Date object
      const month = createdAt.getMonth(); // Get the month index (0 - 11)
      monthlyCounts[month]++; // Increment the count for that month
    });

    return monthlyCounts;
  }

  const chartoptions = {
    series: [
      {
        name: "Orders",
        data: countOrdersByMonth(orders),
      }
    ],
    options: {
      chart: {
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        strokeDashArray: 3,
        borderColor: "rgba(0,0,0,0.1)",
      },

      stroke: {
        curve: "smooth",
        width: 1,
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Aug",
          "Sept",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
  };
  return (
    <Card>
      {orders && <CardBody>
        <CardTitle tag="h5">Sales Summary</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Yearly Sales Report
        </CardSubtitle>
        <Chart
          type="area"
          width="100%"
          height="390"
          options={chartoptions.options}
          series={chartoptions.series}
        />
      </CardBody>}
    </Card>
  );
};

export default SalesChart;
