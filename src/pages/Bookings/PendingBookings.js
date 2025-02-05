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
  const [userInCsv2, setuserInCsv2] = useState([])
  const [productCsv, setproductCsv] = useState([])

  const [form1, setform1] = useState([])

  function tog_small() {
    setmodal_small(!modal_small)
  }

  const getpopup = data => {
    setform1(data)
    tog_small()
  }

  const [users, setusers] = useState([])

  const [form, setform] = useState([])

  const history = useHistory()

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const Get = () => {
    var token = datas
    axios
      .post(
        URLS.GetPendingBookings,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        sessionStorage.removeItem("date")
        setusers(res.data.data)
        setuserInCsv(res.data.pendingBookingExcel)
        // setuserInCsv2(res.data.productsListExcell)

        // const apiData = res.data.productsListExcell;
        // const flattenedData = apiData.flatMap(order =>
        //   order.products.map(product => ({
        //     orderId: order.orderId,
        //     productName: product.productName,
        //     productQuantity: product.productQuantity,
        //   }))
        // );
        // setuserInCsv2(flattenedData);
        const apiData = res.data.productsListExcell
        const flattenedData = apiData.flatMap(order =>
          order.products.map(product => ({
            orderId: order.orderId,
            productName: product.productName,
            productQuantity: product.productQuantity,
          }))
        )
        setuserInCsv2(flattenedData)
      })
  }



  const custsearch = e => {
    const myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)

    const token = datas
    axios
      .post(
        URLS.GetPendingBookingsSearch + `${e.target.value}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          if (res.status === 200) {
            setusers(res.data.data)
            setuserInCsv(res.data.pendingBookingExcel)
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
  }, [])

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = users.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(users.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }
console.log(users)
  const Actinid1 = data => {
    sessionStorage.setItem("BookingId", data._id)
    // history.push("/ViewBooking")
    window.open("/ViewBooking", "_blank");
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
    // fromDate: "",
    singleDate: "",
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

  const GetOrderFiliter = () => {
    var token = datas
    const data = {
      // fromDate: filters.fromDate,
      singleDate: filters.singleDate,
    }

    axios
      .post(URLS.GetPendingBookings, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setusers(res.data.data)
        setuserInCsv(res.data.data)
        hidefilter()
        // setfilters({
        //   singleDate: "",
        // })
      })
  }

  // ================================================ 

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")

  const GetAllBanners = () => {
    var token = datas
    axios
      .post(
        URLS.GetCategory,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setCategories(res.data.categorys)
      })
  }

  useEffect(() => {
    GetAllBanners()
  }, [])

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    var token = datas
    const dataArray = {
      categoryId : event.target.value,
      singleDate: filters.singleDate,
    }
    axios
      .post(
        URLS.GetSelectProducts,dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        var orders=res.data?.data;
        const mappedProducts = orders.map((order) => {
          return order.products.map((product) => ({
            orderId: order.orderId, // Access the order's orderId
            productName: product.productName, // Access product's name
            productQuantity: product.productQuantity, // Access product's quantity
          }));
        });
        
        // Flatten the array of arrays using .flat() to make it a single array
        const flattenedProducts = mappedProducts.flat();

        setproductCsv(flattenedProducts);
       // setusers(res.data.data)
      // setproductCsv(res.data.data[0].products)

      })

    if (category) {
      triggerDownload(category);
    }
  };

  const triggerDownload = (category) => {
    console.log(`satish category ${category}`);
  };


    // ================================================ 

  const hidefilter = () => setfilter(false)

  // const csvReport = {
  //   filename: "Booking Report",
  //   data: userInCsv,
  // }

  const headers2 = [
    { label: "S.No", key: "sno" },
    { label: "Event Id", key: "orderId" },
    { label: "Event Date", key: "date" },
    { label: "Event Time", key: "time" },
    { label: "Name", key: "userName" },
    { label: "Phone", key: "userPhone" },
    { label: "Theater Name", key: "theatreName" },
    { label: "Occasion Name", key: "occasionName" },
    { label: "Total Price", key: "totalPrice" },
    { label: "Status", key: "status" },
  ];
  const productheaders = [
    { label: "S.No", key: "sno" },
    { label: "Event Id", key: "orderId" },
    { label: "Prduct Name", key: "productName" },
    { label: "Product Quantity", key: "productQuantity" },
  ];

  const csvData = userInCsv.map((elt, i) => ({
    sno: i + 1,
    orderId: elt.orderId,
    date: elt.date,
    time: elt.time,
    userName: elt.userName,
    userPhone: elt.userPhone,
    theatreName: elt.theatreName,
    occasionName: elt.occasionName,
    totalPrice: elt.totalPrice,
    status: elt.status,
  }));

  const productData = productCsv.map((elt, i) => ({
    sno: i + 1,
    orderId: elt.orderId,
    productName:elt.productName,
    productQuantity:elt.productQuantity
  }));
  
  const csvReport = {
    filename: "Booking_Report.csv",
    headers: headers2,
    data: csvData,
  };
  const productReport = {
    filename: "Products_Report.csv",
    headers: productheaders,
    data: productData,
  };


  const csvReport2 = {
    filename: "Booking Products",
    data: userInCsv2,
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
        "Event Id",
        "Event Date",
        "Event Time",
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

  const exportPDF2 = () => {
    const unit = "pt"
    const size = "A4" // Changed to A4 for standard size
    const orientation = "portrait"
    const doc = new jsPDF(orientation, unit, size)
    doc.setFontSize(15)

    const headers = [["S.No", "Order ID", "Product Name", "Product Quantity"]]

    const data = userInCsv2.map((product, i) => [
      i + 1,
      product.orderId,
      product.productName,
      product.productQuantity,
    ])

    let content = {
      startY: 50,
      head: headers,
      body: data,
    }

    doc.autoTable(content)
    doc.save("Products_Report.pdf")
  }
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0]

  const convertTo12HourFormat = time24 => {
    const [hours, minutes] = time24.split(":")
    let hours12 = hours % 12 || 12
    const period = hours < 12 ? "AM" : "PM"
    return `${hours12}:${minutes} ${period}`
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Pending Bookings"
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
                      {/* <Col lg="3">
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
                      </Col> */}
                      <Col lg="3">
                        <div className="mb-3">
                          <Label for="basicpill-declaration-input10">
                            Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            required
                            className="form-control"
                            id="basicpill-Declaration-input10"
                            onChange={e => {
                              handleChangeflt(e)
                            }}
                            name="singleDate"
                            value={filters.singleDate}
                          />
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
                    <Col className="d-flex align-items-center">
                      <CSVLink {...csvReport}>
                        <button className="btn btn-success me-2" type="button">
                          <i className="fas fa-file-excel"></i> Excel
                        </button>
                      </CSVLink>

                      <Button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={exportPDF}
                      >
                        <i className="fas fa-file-pdf"></i> Pdf
                      </Button>

                      <Button
                        className="btn btn-info me-2"
                        onClick={() => setfilter(!filter)}
                      >
                        <i className="fas fa-filter"></i> Filter
                      </Button>

                      {/* <Button
                        type="button"
                        className="btn btn-warning me-2"
                        onClick={exportPDF2}
                      >
                        <i className="fas fa-file-pdf"></i> Products
                      </Button> */}

<CSVLink {...productReport}>
                        <button className="btn btn-success me-2" type="button">
                          <i className="fas fa-file-excel"></i>Product Excel
                        </button>
                      </CSVLink>

                      <div className="d-flex flex-column w-25">
                        <select
                          id="category"
                          name="category"
                          className="form-select custom-select-width"
                          value={selectedCategory}
                          onChange={handleCategoryChange}
                        >
                          <option value="">Select </option>
                          {categories.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                     
                    </Col>

                    <Col md="4">
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
                        <tr>
                          <th>S.No</th>
                          <th>Event Id</th>
                          <th>Booking Date</th>
                          <th>Event Date</th>
                          <th>Event Time</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Theater Name</th>
                          <th>Occasion Name </th>
                          <th>Remaning Price</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((data, key) => (
                          <tr key={key}>
                            <th scope="row">
                              {(pageNumber - 1) * 5 + key + 6}
                            </th>
                            <td>{data.orderId}</td>
                            <td>{data.logCreatedDate.slice(0, 10)}</td>
                            <td>{data.date}</td>
                            <td>{data.time}</td>
                            {/* <td>{convertTo12HourFormat(data.time)}</td> */}
                            <td>{data.userName}</td>
                            <td>{data.userPhone}</td>
                            <td>{data.theatreName}</td>
                            <td>{data.occasionName}</td>
                            <td>{(parseFloat(data.totalPrice || 0) - parseFloat(data?.advancePayment || 0)).toFixed(2)}</td>
                            <td>{data.status}</td>
                            <td>
                              {Roles.pendingView ||
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
                                      <small>
                                        <i className="fas fa-eye"></i> View{" "}
                                      </small>
                                    </div>
                                  </Button>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles.pendingEdit ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Button
                                    onClick={() => {
                                      getpopup(data)
                                    }}
                                    className="m-1 btn-sm"
                                    color="success"
                                  >
                                    <div className="d-flex">
                                      <small>
                                        <i className="bx bx-edit px-1"></i>Edit
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
                      required
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
