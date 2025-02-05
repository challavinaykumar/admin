import React, { useEffect, useState } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Table,
  Label,
  Form,
  Modal,
} from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useHistory } from "react-router-dom"
import ReactPaginate from "react-paginate"
import { CSVLink } from "react-csv"
import { URLS } from "../../Url"
import axios from "axios"
import jsPDF from "jspdf"
import "jspdf-autotable"

const Staff = () => {
  const [modal_small, setmodal_small] = useState(false)

  const [userInCsv, setuserInCsv] = useState([])

  const [form1, setform1] = useState([])

  function tog_small() {
    setmodal_small(!modal_small)
  }

  const [users, setusers] = useState([])

  const [users1, setusers1] = useState([])
  const [users2, setusers2] = useState([])
  console.log(users2)

  const [form, setform] = useState([])

  const history = useHistory()

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const Get = () => {
    var token = datas
    axios
      .post(
        URLS.GetStaffBookings,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setusers(res.data.Data)
        setuserInCsv(res.data.staffEcxcell)
      })
  }

  const custsearch = e => {
    const myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)

    const token = datas
    axios
      .post(
        URLS.GetStaffBookingsSearch + `${e.target.value}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          if (res.status === 200) {
            setusers(res.data.Data)
            setuserInCsv(res.data.staffEcxcell)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  useEffect(() => {
    Get()
    GetSelect()
  }, [])

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = users.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(users.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const Actinid1 = data => {
    sessionStorage.setItem("BookingId", data._id)
    history.push("/ViewBooking")
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    Edit()
  }

  const handleChange1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
  }

  const Edit = () => {
    var token = datas
    var formid = form1._id
    const dataArray = {
      status: form1.status,
      cancellReason: form1.cancellReason,
    }
    axios
      .put(URLS.UpdateBookingsStatus + formid, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small(false)
            Get()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const [filter, setfilter] = useState(false)

  const [filters, setfilters] = useState({
    fromDate: "",
    toDate: "",
  })

  const handleChangeflt = e => {
    let myUser = { ...filters }
    myUser[e.target.name] = e.target.value
    setfilters(myUser)
  }

  const getfilter = e => {
    e.preventDefault()
    GetOrderFiliter()
  }

  // const GetOrderFiliter = () => {
  //   var token = datas
  //   const data = {
  //     fromDate: filters.fromDate,
  //     toDate: filters.toDate,
  //   }

  //   axios
  //     .post(URLS.GetPendingBookings, data, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then(res => {
  //       // setusers(res.data.Data)
  //       setusers(res.data.data)
  //       hidefilter()
  //       setfilters({
  //         fromDate: "",
  //         toDate: "",
  //       })
  //     })
  // }

  const GetOrderFiliter = () => {
    const token = datas
    const data = {
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      staffId: users2.staffId,
    }

    axios
      .post(URLS.GetStaffBookings, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          setusers(res.data.Data)
          setuserInCsv(res.data.staffEcxcell)
          hidefilter()
          setfilters({
            fromDate: "",
            toDate: "",
          })
        }
      })
  }

  const GetSelect = () => {
    var token = datas
    axios
      .post(
        URLS.GetStaff,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setusers1(res.data.staff)
      })
  }

  const handleStaddId = (e) => {
    const myUser = { ...users2 }
    myUser[e.target.name] = e.target.value
    setusers2(myUser)
    // setusers2({...users2}, [e.target.name] = e.target.value)
  }

  const hidefilter = () => setfilter(false)

  const csvReport = {
    filename: "Booking Report",
    data: userInCsv,
  }

  const exportPDF = () => {
    const unit = "pt"
    const size = "A2"
    const orientation = "portrait"
    const doc = new jsPDF(orientation, unit, size)
    doc.setFontSize(15)
    const headers = [
      [
        "S.No",
        "Booking Id",
        "Booking Date",
        "Booking Time",
        "Name",
        "Phone",
        "Theater Name",
        "Occasion Name",
        "Total Price",
        "Status",
      ],
    ]
    const data = users.map((elt, i) => [
      i + 1,
      elt.orderId,
      elt.date,
      elt.time,
      elt.userName,
      elt.userPhone,
      elt.theatreName,
      elt.occasionName,
      elt.totalPrice,
      elt.status,
    ])
    let content = {
      startY: 50,
      head: headers,
      body: data,
    }
    doc.autoTable(content)
    doc.save("Booking_Report.pdf")
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0]

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Staff Bookings"
          />
          {filter ? (
            <>
              <Card>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      getfilter(e)
                    }}
                  >
                    <Row>
                      <Col lg="3">
                        <div className="mb-3">
                          <Label for="basicpill-declaration-input10">
                            From Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            required
                            className="form-control"
                            id="basicpill-Declaration-input10"
                            onChange={e => {
                              handleChangeflt(e)
                            }}
                            name="fromDate"
                            value={filters.fromDate}
                          />
                        </div>
                      </Col>
                      <Col lg="3">
                        <div className="mb-3">
                          <Label for="basicpill-declaration-input10">
                            To Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            required
                            className="form-control"
                            id="basicpill-Declaration-input10"
                            onChange={e => {
                              handleChangeflt(e)
                            }}
                            name="toDate"
                            value={filters.toDate}
                          />
                        </div>
                      </Col>

                      <Col lg="3">
                        <div className="mb-3">
                          <Label for="basicpill-declaration-select">
                            Select Staff <span className="text-danger">*</span>
                          </Label>
                          <select
                            required
                            className="form-control"
                            id="basicpill-declaration-select"
                            name="staffId"
                            value={users2.staffId}
                            onChange={(e) => handleStaddId(e)}
                          >
                            <option value="">Select</option>
                            {users1.map((data, key) => {
                              return (
                                <option key={key} value={data._id}>
                                  {data.name}
                                </option>
                              )
                            })}
                          </select>
                        </div>
                      </Col>

                      <Col lg="3">
                        <div className="mt-4">
                          <Button type="submit" className="m-1" color="info">
                            <i className="fas fa-check-circle"></i> search
                          </Button>
                          <Button
                            onClick={hidefilter}
                            className="m-1"
                            color="danger"
                          >
                            <i className="fas fa-times-circle"></i> Cancel
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </>
          ) : (
            ""
          )}
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      <CSVLink {...csvReport}>
                        <button className="btn btn-success me-2" type="submit">
                          <i className="fas fa-file-excel"></i> Excel
                        </button>
                      </CSVLink>
                      <Button
                        type="button"
                        className="btn btn-danger "
                        onClick={exportPDF}
                      >
                        <i className="fas fa-file-pdf"></i> Pdf
                      </Button>
                      <Button
                        className="m-1"
                        onClick={() => {
                          setfilter(!filter)
                        }}
                        color="info"
                      >
                        <i className="fas fa-filter"></i> Filter
                      </Button>
                    </Col>
                    <Col>
                      <div style={{ float: "right" }}>
                        <Input
                          name="search"
                          value={form.search}
                          onChange={custsearch}
                          type="search"
                          placeholder="Search..."
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover bordered responsive>
                      <thead>
                        <tr className="text-center">
                          <th>S.No</th>
                          <th>Staff Name</th>
                          <th>Staff Phone No</th>
                          <th>Pending Bookings</th>
                          <th>Completed Bookings</th>
                          <th>Cancelled Bookings</th>
                          <th>Booking Id</th>
                          <th>Booking Date</th>
                          <th>Booking Time</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Theater Name</th>
                          <th>Occasion Name </th>
                          <th>Total Price</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((data, key) => (
                          <tr key={key} className="text-center">
                            <th>{(pageNumber - 1) * 5 + key + 6}</th>
                            <td>{data.staffName}</td>
                            <td>{data.staffPhone}</td>
                            <td>{data.PendingBookings}</td>
                            <td>{data.CompletedBookings}</td>
                            <td>{data.CancelledBookings}</td>
                            <td>{data.orderId}</td>
                            <td>{data.date}</td>
                            <td>{data.time}</td>
                            <td>{data.userName}</td>
                            <td>{data.userPhone}</td>
                            <td>{data.theatreName}</td>
                            <td>{data.occasionName}</td>
                            <td>{data.totalPrice}</td>
                            <td>{data.status}</td>
                            <td>
                              {Roles.staffBookingView ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Button
                                    onClick={() => {
                                      Actinid1(data)
                                    }}
                                    className="m-1 btn-sm"
                                    color="info"
                                  >
                                    <div className="d-flex">
                                      <small className="d-flex">
                                        <i className="fas fa-eye"></i> View{" "}
                                      </small>
                                    </div>
                                  </Button>{" "}
                                </>
                              ) : (
                                ""
                              )}
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
        <Modal
          size="md"
          isOpen={modal_small}
          toggle={() => {
            tog_small()
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              Edit Status
            </h5>
            <button
              onClick={() => {
                setmodal_small(false)
              }}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form
              onSubmit={e => {
                handleSubmit1(e)
              }}
            >
              <div className="mb-3">
                <Label>Status</Label>
                <span className="text-danger">*</span>
                <select
                  value={form1.status}
                  name="status"
                  required
                  onChange={e => {
                    handleChange1(e)
                  }}
                  className="form-select"
                >
                  <option value="">Select</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              {form1.status == "cancelled" ? (
                <>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Cancelled Reason <span className="text-danger">*</span>
                    </Label>
                    <textarea
                      type="text"
                      rows="3"
                      className="form-control "
                      id="basicpill-firstname-input1"
                      placeholder="Enter Cancelled Reason"
                      value={form1.cancellReason}
                      name="cancellReason"
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
              <div style={{ float: "right" }}>
                <Button
                  onClick={() => {
                    setmodal_small(false)
                  }}
                  color="danger"
                  type="button"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button className="m-1" color="primary" type="submit">
                  Submit <i className="fas fa-check-circle"></i>
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Staff
