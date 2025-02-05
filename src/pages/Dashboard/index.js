import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, CardBody, Table } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { withTranslation } from "react-i18next"
import ReactApexChart from "react-apexcharts"
import { URLS } from "../../Url"
import axios from "axios"

const Dashboard = props => {
  const [dash, setdash] = useState([])

  const [series1, setseries1] = useState([])

  const [series2, setseries2] = useState([])

  const [cus, setcus] = useState([])

  useEffect(() => {
    getdashdata()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const getdashdata = () => {
    var token = datas

    axios
      .post(
        URLS.GetDashboard,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setdash(res.data)
        setseries1(res.data.monthlyAmount)
        setseries2(res.data.monthlybookings)
        setcus(res.data.latestBookings)
      })
  }

  const reports = [
    {
      title: "Theaters",
      iconClass: "bx-copy-alt",
      description: dash.theatres,
    },
    {
      title: "Services",
      iconClass: "bx-archive-in",
      description: dash.occasions,
    },
    {
      title: "Bookings",
      iconClass: "bx bx-receipt",
      description: dash.bookings,
    },
    {
      title: "Amount",
      iconClass: "bx bx-rupee",
      description: dash.amount,
    },
    {
      title: "Food Saled Amount",
      iconClass: "bx-purchase-tag-alt",
      description: dash.posAmount,
    },
  ]

  const series = [
    {
      name: "Monthly Bookings",
      data: series2,
    },
    {
      name: "Monthly Amount",
      data: series1,
    },
  ]

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "34%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },

    colors: ["#300843", "#f1b44c", "#300843"],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      title: {
        text: " (data)",
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val
        },
      },
    },
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={"Carnival Castle Admin"}
            breadcrumbItem={props.t("Dashboard")}
          />
          <Row>
            <Col xl="12">
              <Row>
                {reports.map((report, key) => (
                  <Col md="3" key={"_col_" + key}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                              {report.title}
                            </p>
                            <h4 className="mb-0">{report.description}</h4>
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i
                                className={
                                  "bx " + report.iconClass + " font-size-24"
                                }
                              ></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Card>
                <CardBody>
                  <ReactApexChart
                    options={options}
                    series={series}
                    type="bar"
                    height={350}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="table-rep-plugin mt-2 table-responsive">
                    <h5>Latest Bookings</h5>
                    <Table hover className="table table-bordered mb-4">
                      <thead>
                        <tr className="text-center">
                          <th>SlNo</th>
                          <th>Booking Date / Time</th>
                          <th>Name </th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>Status </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cus.map((data, key) => (
                          <tr className="text-center" key={key}>
                            <td>{key + 1}</td>
                            <td>{data.date}-{data.time}</td>
                            <td>{data.userName}</td>
                            <td>{data.userPhone}</td>
                            <td>{data.userEmail}</td>
                            <td>
                              <span className="badge bg-primary">
                                {data.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>{" "}
    </React.Fragment>
  )
}

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
}

export default withTranslation()(Dashboard)
