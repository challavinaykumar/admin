import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, Table } from "reactstrap"
import { ToastContainer } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"

import axios from "axios"

const Staff = () => {
  const [users, setusers] = useState([])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const Get = () => {
    var token = datas
    axios
      .post(
        URLS.GetPayments,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setusers(res.data.payments)
      })
  }

  useEffect(() => {
    Get()
  }, [])

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = users.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(users.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Payments"
          />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover bordered responsive>
                      <thead>
                        <tr className="text-center">
                          <th>S.No</th>
                          <th>Order Id</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Coupon Code</th>
                          <th>Transaction Id </th>
                          <th>Sub Total</th>
                          {/* <th>Gst</th> */}
                          <th>Advance Amount</th>
                          {/* <th>Remaining Amount</th> */}
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((data, key) => (
                          <tr key={key} className="text-center">
                            <th scope="row">
                              {(pageNumber - 1) * 5 + key + 6}
                            </th>
                            <td>{data.orderId}</td>
                            <td>{data.userName}</td>
                            <td>{data.userPhone}</td>
                            <td>{data.couponCode}</td>
                            <td>{data.transactionId}</td>
                            <td>{parseFloat(data.subTotal).toFixed(2)}</td>
                            {/* <td>{data.gst}%</td> */}
                            <td>{parseFloat(data.advancePayment).toFixed(2)}</td>
                            {/* <td>{data.remainingAmount}</td> */}
                            <td>
                              {typeof data.amount === "number"
                                ? parseFloat(data.totalPrice).toFixed(2)
                                : parseFloat(data.totalPrice).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Col sm="12">
                      <div
                        className="d-flex mt-3 mb-1"
                        style={{ float: "right" }}
                      >
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          pageCount={pageCount}
                          onPageChange={changePage}
                          containerClassName={"pagination"}
                          previousLinkClassName={"previousBttn"}
                          nextLinkClassName={"nextBttn"}
                          disabledClassName={"disabled"}
                          activeClassName={"active"}
                          total={lists.length}
                        />
                      </div>
                    </Col>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Staff
