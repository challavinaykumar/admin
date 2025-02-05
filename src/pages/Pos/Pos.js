import React, { useState, useEffect, useRef } from "react"
import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  Form,
  Label,
  CardBody,
  CardTitle,
  Modal,
  Button,
} from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useReactToPrint } from "react-to-print"
import { useHistory } from "react-router-dom"
import { Link } from "react-router-dom"
import { URLS } from "../../Url"
import axios from "axios"

const EcommerceCheckout = () => {
  const [modal_small, setmodal_small] = useState(false)
  const [modal_small2, setmodal_small2] = useState(false)
  const [btnshows, setbtnshows] = useState(false)

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [activeTab, setactiveTab] = useState("1")

  function tog_small2() {
    setmodal_small2(!modal_small2)
  }
  const modalclose = () => {
    setmodal_small2(false)
    setproducts([])
    setform({ bookingId: "" })
    setform2({ couponAmount: "" })
  }

  const history = useHistory()

  const componentRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const printsecctions = () => {
    handlePrint()
    setmodal_small2(!modal_small2)
    setproducts([])
    setform({ bookingId: "" })
    setform2({ couponAmount: "" })
  }

  const [products, setproducts] = useState([])
  const [products1, setproducts1] = useState([])
  const [ordercount, setordercount] = useState(1)

  const caramout = products.map(
    data => parseFloat(data.price) * parseFloat(data.quantity)
  )

  const subamount = caramout.reduce((acc, value) => {
    if (!isNaN(value)) {
      return acc + value
    } else {
      return acc
    }
  }, 0)
  const [sumtax, setsumtax] = useState(0)
  const taxvalue = (subamount * sumtax) / 100 
  console.log(taxvalue)

  const getAlltaxes = () => {
    var token = datas
    axios
      .post(
        URLS.GetPriceSettings,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setsumtax(res.data.charges.foodGst)
      })
  }

  function removeCartItem(_id) {
    var filtered = products.filter(function (item) {
      return item._id !== _id
    })

    setproducts(filtered)
  }

  useEffect(() => {
    setordercount(products.map(product => 1))
  }, [products])

  const countUP = (index, quantity) => {
    setexctra({
      cashPrice: "",
    })

    let myUser = [...products]
    myUser[index].quantity = parseFloat(quantity) + 1
    setproducts(myUser)
    const bodydata = {
      quantity: parseFloat(myUser[index].quantity),
    }
    var token = datas
    axios
      .post(URLS.CheckStock + myUser[index]._id, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            var _data = res
          }
        },
        error => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Please try again.")
          }
        }
      )
  }

  const quantityChange = (e, index) => {
    setexctra({
      cashPrice: "",
    })
    let myUser = [...products]
    myUser[index][e.target.name] = e.target.value
    setproducts(myUser)
    const bodydata = {
      quantity: e.target.value,
    }
    var token = datas
    axios
      .post(URLS.CheckStock + myUser[index]._id, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            var _data = res
          }
        },
        error => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Please try again.")
          }
        }
      )
  }

  const countDown = async (index, quantity) => {
    setexctra({
      cashPrice: "",
    })
    let myUser = [...products]
    myUser[index].quantity = Math.max(parseFloat(quantity) - 1, 1)
    setproducts(myUser)
    setordercount(prevCounts =>
      prevCounts.map((count, i) =>
        i === index ? Math.max(count - 1, 1) : count
      )
    )
    const bodydata = {
      quantity: parseFloat(myUser[index].quantity),
    }
    var token = datas
    axios
      .post(URLS.CheckStock + myUser[index]._id, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            var _data = res
          }
        },
        error => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Please try again.")
          }
        }
      )
  }

  const [category, setcategory] = useState([])
  const [category1, setcategory1] = useState([])
  const [subcategory, setsubcategory] = useState([])
  const [form, setform] = useState({ bookingId: "" })
  const [form2, setform2] = useState([])
  const [invoice, setinvoice] = useState([])
  const [monytypes, setmonytypes] = useState([])
  const [exctra, setexctra] = useState([])
  const [balnceamss, setbalnceamss] = useState([])
  const [totalamounts, settotalamounts] = useState([])

  useEffect(() => {
    const totamount =  parseFloat(subamount) + parseFloat((taxvalue).toFixed(2)) -
      parseFloat(form2.couponAmount == "" || form2.couponAmount == undefined? 0: form2.couponAmount)
    settotalamounts(parseFloat(totamount).toFixed(2))
  }, [subamount])

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  const handleChangeAmount = e => {
    let myUser = { ...monytypes }
    myUser[e.target.name] = e.target.value
    setmonytypes(myUser)
  }

  const handleChangeexctra = e => {
    let myUser = { ...exctra }
    myUser[e.target.name] = e.target.value
    setexctra(myUser)
    const balnceam = totalamounts - e.target.value
    setbalnceamss(parseFloat(balnceam).toFixed(2))
  }

  // get all function
  const getAllCategories = () => {
    var token = datas
    axios
      .post(
        URLS.GetFoodCategory,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setcategory(res.data.Foodcategories)
        setcategory1(res.data.Foodcategories[0])
        const bodydata = res.data.Foodcategories[0]._id
        axios
          .post(
            URLS.GetStockByCategory,
            { categoryId: bodydata },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then(res => {
            setsubcategory(res.data.stockResult)
          })
      })
  }

  const [activeCategory, setActiveCategory] = useState(null)

  const [subsearch, setsubsearch] = useState([])

  const getAllSubcategories = async data => {
    const bodydata = { categoryId: data._id }

    var token = datas
    axios
      .post(URLS.GetStockByCategory, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setsubcategory(res.data.stockResult)
        setcategory1([])
        setActiveCategory(data)
        setsubsearch(data)
      })
  }

  // get all search function
  const getAllsearch = e => {
    const bodydata = { categoryId: subsearch._id || category1._id }
    var token = datas
    axios
      .post(URLS.GetStockByCategorySearch + e.target.value, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setsubcategory(res.data.stockResult)
      })
  }

  useEffect(() => {
    getAllCategories()
    getAlltaxes()
  }, [])

  const getData = (data, key) => {
    setexctra({
      cashPrice: "",
    })

    setproducts(prevProducts => {
      const existingProductNames = prevProducts.map(
        value => value.subCategoryName
      )
      if (existingProductNames.includes(data.subCategoryName)) {
        toast.error("Product is already added")
        return prevProducts
      } else {
        console.log(prevProducts)
        var resdata = {
          _id: data._id,
          image: data.image,
          subCategoryName: data.subCategoryName,
          price: data.price,
          tax: data.tax,
          quantity: 1,
        }
        return [...prevProducts, resdata]
      }
    })
  }

  const addProducts = e => {
    e.preventDefault()
    setbtnshows(true)
    const productData = products.map((data, index) => ({
      productId: data._id,
      productName: data.subCategory,
      quantity: data.quantity,
      tax: data.tax,
      price: parseFloat(data.price).toFixed(2),
      totalprice: data.quantity * parseFloat(data.price).toFixed(2),
    }))

    const bodydata = {
      bookingId: sessionStorage.getItem("BookID"),
      subAmount: subamount,
      couponAmount:form2.length == 0 ? 0 : parseFloat(form2.couponAmount).toFixed(2) || 0,
      gst: parseFloat(taxvalue).toFixed(2),
      totalAmount:
        totalamounts.length == 0
          ? parseFloat(parseFloat(subamount) + parseFloat(taxvalue).toFixed(2)).toFixed(2)
          : totalamounts,
      products: productData,
      moneyType: monytypes.moneyType || "Cash",
      cashPrice:
        monytypes.moneyType == "Cash" ? subamount : exctra.cashPrice || 0,
      onlinePrice:
        monytypes.moneyType == "Card"
          ? subamount
          : balnceamss.length == 0
          ? 0
          : balnceamss,
    }

    var token = datas

    axios
      .post(URLS.AddPos, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res?.data?.message)
            setinvoice(res?.data?.order)
            setproducts1(res?.data?.order?.products)
            setmodal_small(false)
            sessionStorage.setItem("orderid", res.data._id)
            setmodal_small2(true)
            setbtnshows(false)
            getAllCategories()
          }
        },
        error => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.error(error.response.data.message)
            setbtnshows(false)
          } else {
            toast.error("An error occurred. Please try again.")
          }
        }
      )
  }

  const [Bookings, setBookings] = useState([])

  // useEffect(() => {
  //   Get()
  // }, [])

  // const Get = () => {
  //   var token = datas
  //   axios
  //     .post(
  //       URLS.GetPendingBookings,
  //       {},
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     )
  //     .then(res => {
  //       setBookings(res.data.data)
  //     })
  // }

  const [date, setDate] = useState(sessionStorage.getItem("bookingdate"))

  const handleChanges = e => {
    setDate(e.target.value)
    console.log(e.target.value)

    var token = datas
    axios
      .post(
        URLS.GetPendingBookings,
        { singleDate: e.target.value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setBookings(res.data.data)
      })
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0]

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Pos" />
          <Row>
            <Col>
              <Button
                onClick={() => history.goBack()}
                className="mb-3  m-1 "
                style={{ float: "right" }}
                color="primary"
              >
                <i className="far fa-arrow-alt-circle-left"></i> Back
              </Button>
            </Col>
          </Row>

          <div className="checkout-tabs">
            <Row>
              <Col md="8">
                <Row>
                  <Col md="2 p-1">
                    <Nav className="flex-column" pills>
                      {category.map((data, key) => (
                        <NavItem
                          key={key}
                          onClick={() => {
                            getAllSubcategories(data)
                          }}
                        >
                          <NavLink
                            className={`navcardshadow ${
                              activeCategory === data || category1 === data
                                ? "active"
                                : ""
                            }`}
                          >
                            <img
                              style={{ height: "45px", width: "45px" }}
                              src={URLS.Base + data.image}
                            />
                            <p className="font-weight-bold">{data.name}</p>
                          </NavLink>
                        </NavItem>
                      ))}
                    </Nav>
                  </Col>
                  <Col md="10">
                    <div className="mb-3">
                      <Row>
                        <Col md="6">
                          <Input
                            onChange={getAllsearch}
                            type="text"
                            className="rounded-pill"
                            placeholder="Search..."
                          />
                        </Col>
                        <Col md="6"></Col>
                      </Row>
                    </div>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <div>
                          <Row
                            style={{
                              maxHeight: "700px",
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            {subcategory.length == 0 ? (
                              <Container>
                                <Card>
                                  <CardBody>
                                    <div className="text-center">
                                      <h5>No Data...</h5>
                                    </div>
                                  </CardBody>
                                </Card>
                              </Container>
                            ) : (
                              <>
                                {subcategory.map((data, key) => (
                                  <Col key={key} md="4">
                                    <Card>
                                      <div className="text-center ">
                                        <img
                                          className="rounded-top"
                                          src={URLS.Base + data.image}
                                          style={{
                                            height: "150px",
                                            width: "100%",
                                          }}
                                        />
                                      </div>{" "}
                                      <CardBody style={{ padding: "10px" }}>
                                        <h6 style={{ fontSize: "14px" }}>
                                          {data.subCategoryName.length > 15
                                            ? data.subCategoryName.substring(
                                                0,
                                                15
                                              ) + "..."
                                            : data.subCategoryName}
                                        </h6>
                                        <Row className="mt-2">
                                          <Col>
                                            {" "}
                                            <h6 className="mt-2">
                                              ₹ {data.price}
                                            </h6>
                                          </Col>
                                          <Col className="text-end">
                                            {" "}
                                            <h6 className="mt-2 text-muted">
                                              {/* {data.quantity} items */}
                                              {data.finalQuantity} items
                                            </h6>
                                          </Col>
                                          <Col className="mt-2" md="12">
                                            {data.quantity == "0" ? (
                                              <Button
                                                disabled
                                                className="btn-sm w-100"
                                                onClick={() => {
                                                  getData(data, key)
                                                }}
                                                style={{ width: "110px" }}
                                                color="danger"
                                              >
                                                Out of Stock
                                              </Button>
                                            ) : (
                                              <Button
                                                className="btn-sm w-100"
                                                onClick={() => {
                                                  getData(data, key)
                                                }}
                                                style={{ width: "100px" }}
                                                color="primary"
                                              >
                                                Add +
                                              </Button>
                                            )}
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                ))}
                              </>
                            )}
                          </Row>
                        </div>
                      </TabPane>
                    </TabContent>
                  </Col>
                </Row>
              </Col>
              <Col md="4">
                <Card>
                  <CardBody>
                    <Form
                      onSubmit={e => {
                        addProducts(e)
                      }}
                    >
                      <div>
                        <CardTitle className="mb-3">Order Summary</CardTitle>
                        <div>
                          <div>
                            <div className="mb-2 row">
                              <div
                                className="col-md-12 pb-2"
                                style={{ padding: "1px" }}
                              >
                                <label>Check Availability</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={date}
                                  name="date"
                                  readOnly
                                  // onChange={e => handleChanges(e)}
                                />
                              </div>
                              <div
                                style={{ padding: "1px" }}
                                className="col-12"
                              >
                                <Label>Booking Id </Label>
                                <span className="text-danger">*</span>
                                <input
                                  required
                                  type="text"
                                  className="form-control"
                                  value={
                                    sessionStorage.getItem("orderid") +
                                    " - " +
                                    sessionStorage.getItem("theatername")
                                  }
                                  name="date"
                                  readOnly
                                  // onChange={e => handleChanges(e)}
                                />
                                {/* <select
                                  value={form.bookingId}
                                  name="bookingId"
                                  required
                                  onChange={e => {
                                    handleChange(e)
                                  }}
                                  className="form-select"
                                >
                                  <option value="">Select</option>
                                  {Bookings.map((data, key) => {
                                    return (
                                      <option key={key} value={data._id}>
                                        {data.orderId + " - " + data.userName}
                                      </option>
                                    )
                                  })}
                                </select> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            overflowX: "hidden",
                          }}
                        >
                          <Table className="table align-middle mb-0 table-nowrap">
                            <tbody>
                              {products.map((product, index) => (
                                <tr key={product._id}>
                                  <td>
                                    <img
                                      src={URLS.Base + product.image}
                                      alt="product-img"
                                      title="product-img"
                                      className="avatar-md"
                                    />
                                  </td>
                                  <td>
                                    <h5 className="font-size-14 text-truncate">
                                      {/* {product.subCategory} */}
                                      {product.subCategoryName.length > 10
                                        ? product.subCategoryName.substring(
                                            0,
                                            10
                                          ) + "..."
                                        : product.subCategoryName}
                                    </h5>
                                    <p className="mb-0">
                                      Price :{" "}
                                      <span className="fw-medium">
                                        ₹{" "}
                                        {parseFloat(
                                          product.price * product.quantity
                                        ).toFixed(2)}
                                      </span>
                                    </p>
                                    <div style={{ width: "120px" }}>
                                      <div className="input-group mt-2">
                                        <div className="input-group-append">
                                          <button
                                            type="button"
                                            className="btn-primary rounded-left"
                                            onClick={() =>
                                              countDown(index, product.quantity)
                                            }
                                          >
                                            -
                                          </button>
                                        </div>
                                        <Input
                                          style={{ height: "26px" }}
                                          className="text-center"
                                          type="number"
                                          value={products[index].quantity}
                                          name="quantity"
                                          onChange={e => {
                                            quantityChange(e, index)
                                          }}
                                        />
                                        <div className="input-group-prepend">
                                          <button
                                            type="button"
                                            className="btn-primary rounded-right"
                                            onClick={() =>
                                              countUP(index, product.quantity)
                                            }
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <Link
                                      to="#"
                                      onClick={() =>
                                        removeCartItem(product._id)
                                      }
                                      className="action-icon text-danger"
                                    >
                                      {" "}
                                      <i className="mdi mdi-trash-can font-size-18" />
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                      <div className="table-responsive">
                        <Table className="table mb-0">
                          <tbody>
                            <tr>
                              <td>Subtotal:</td>
                              <td className="text-end">
                                ₹ {parseFloat(subamount).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td> Tax ({sumtax}%): </td>
                              <td className="text-end">₹ {taxvalue.toFixed(2)}</td>
                            </tr>

                            <tr>
                              <th>Total :</th>
                              <th className="text-end">₹ {totalamounts} </th>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                      <div>
                        <Row className="mt-3">
                          <Col md="4">
                            <div className="form-check">
                              <input
                                type="radio"
                                onChange={e => {
                                  handleChangeAmount(e)
                                }}
                                id="Cash"
                                className="form-check-input"
                                value="Cash"
                                name="moneyType"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Cash"
                              >
                                Cash
                              </label>
                            </div>
                          </Col>
                          <Col md="4">
                            <div className="form-check">
                              <input
                                type="radio"
                                onChange={e => {
                                  handleChangeAmount(e)
                                }}
                                id="Online"
                                className="form-check-input"
                                value="Card"
                                name="moneyType"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Online"
                              >
                                Online
                              </label>
                            </div>
                          </Col>
                          <Col md="4">
                            <div className="form-check">
                              <input
                                type="radio"
                                onChange={e => {
                                  handleChangeAmount(e)
                                }}
                                id="Split"
                                className="form-check-input"
                                value="Split"
                                name="moneyType"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Split"
                              >
                                Split
                              </label>
                            </div>
                          </Col>
                        </Row>
                        {monytypes.moneyType == "Split" ? (
                          <Row className="mt-3">
                            <Col>
                              <Input
                                onChange={e => {
                                  handleChangeexctra(e)
                                }}
                                max={totalamounts}
                                value={exctra.cashPrice}
                                required
                                name="cashPrice"
                                type="number"
                                placeholder="Enter Cash Amount"
                              />
                            </Col>
                            <Col>
                              <Input
                                value={balnceamss}
                                disabled
                                name="onlinePrice"
                                type="number"
                                placeholder="Enter Online Amount"
                              />
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        <Button
                          type="submit"
                          style={{ width: "100%" }}
                          color="primary"
                          className="mt-3"
                          disabled={btnshows}
                        >
                          Print <i className="bx bx-check-circle" />
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
        <ToastContainer />
        <Modal
          isOpen={modal_small2}
          toggle={() => {
            tog_small2()
          }}
        >
          <div className="modal-body">
            <div className="">
              <Button onClick={printsecctions} className="m-2" color="success">
                <i className="bx bx-printer"></i> Proceed If thermal printer is
                ready
              </Button>
              <Button
                onClick={() => {
                  modalclose()
                }}
                className="m-2"
                color="danger"
              >
                <i className="bx bx-left-arrow-alt"></i> Cancel
              </Button>
              <hr />
            </div>
            <Row>
              <Col md="2"></Col>
              <Col md="8">
                <div ref={componentRef}>
                  <div className="modal-body">
                    <div id="printableArea">
                      <div className="initial-38-1">
                        <div style={{borderBottomStyle: "dashed"}} className="text-center mb-2">
                          <h5
                            style={{ fontSize: "14px" }}
                            className="text-break initial-38-4"
                          >
                            <b>Carnival Castle Private Theatres</b>
                          </h5>
                          <h5
                            style={{ fontSize: "13px" }}
                            className="text-break initial-38-4"
                          >
                            4th floor, Garden View Enclave, Plot No.16, behind
                            Pista House, Kondapur, Hyderabad, Telangana, 500084
                          </h5>
                          <h5
                            style={{ fontSize: "13px" }}
                            className="text-break initial-38-4"
                          >
                            Receipt: {invoice.orderNo}
                          </h5>
                          <h5
                            style={{ fontSize: "13px" }}
                            className="text-break initial-38-4"
                          >
                            Date: {invoice.date} - {invoice.time}
                          </h5>

                          {/* <h5
                            style={{ fontSize: "12px" }}
                            className="text-break initial-38-4"
                          >
                            Name : {invoice.customerName}
                          </h5> */}
                          {/* <h5
                            style={{ fontSize: "12px" }}
                            className="initial-38-4 initial-38-3"
                          >
                            Phone : {invoice.customerPhone}
                          </h5> */}
                        </div>
                        {/* <span className="initial-38-5">
                        -------------------------------------
                        </span> */}
                        {/* <div className="row mt-4">
                          <div className="col-5">
                            <h5 style={{ fontSize: "12px", fontWeight: "800" }}>
                              Order ID
                              <span
                                style={{ marginBottom: "0px" }}
                                className="font-light"
                              >
                                {" "}
                                {invoice.orderNo}
                              </span>
                            </h5>
                          </div>
                          <div className="col-7">
                            <h5 style={{ fontSize: "12px", fontWeight: "800" }}>
                              <span className="font-light">
                                {invoice.date} - {invoice.time}
                              </span>
                            </h5>
                          </div>
                          <div className="col-12"></div>
                        </div> */}
                       
                        {/* <span className="initial-38-5">
                          -------------------------------------
                        </span> */}
                        <div style={{borderBottomStyle: "dashed", margin:"0px"}} className="row text-center">
                          <div className="col-4">
                            <h6> ITEM</h6>
                          </div>
                          <div className="col-4">
                            <h6> QTY</h6>
                          </div>
                          <div className="col-4">
                            <h6> PRICE</h6>
                          </div>
                        </div>
                        {products1?.map((data, key) => (
                        <div key={key} className="row text-center">
                          <div className="col-4">
                            <h6> {data.stockName}</h6>
                          </div>
                          <div className="col-4">
                            <h6> {data.quantity}</h6>
                          </div>
                          <div className="col-4">
                            <h6> {data.amount * data.quantity}</h6>
                          </div>
                        </div>
  ))}
                        {/* <table
                          style={{
                            fontSize: "10px",
                            marginBottom: "7px",
                            border: "2px solid black",
                          }}
                          className="table table-bordered"
                        >
                          <thead>
                            <tr>
                              <th
                                style={{ padding: "5px" }}
                                className="initial-38-6 border-top-0 border-bottom-0"
                              >
                                SNo
                              </th>
                              <th
                                style={{ padding: "5px" }}
                                className="initial-38-7 border-top-0 border-bottom-0"
                              >
                                Product Name
                              </th>
                              <th
                                style={{ padding: "5px" }}
                                className="initial-38-7 border-top-0 border-bottom-0"
                              >
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {products1?.map((data, key) => (
                              <tr key={key}>
                                <td style={{ padding: "5px" }}>{key + 1}</td>
                                <td style={{ padding: "5px" }}>
                                  <div>
                                    <h5 style={{ fontSize: "12px" }}>
                                      <b>
                                        {data.quantity} - {data.stockName}
                                      </b>
                                    </h5>
                                  </div>
                                </td>
                                <td
                                  style={{ padding: "5px" }}
                                  className="w-28p"
                                >
                                  {" "}
                                  <b>₹ {data.amount * data.quantity}</b>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table> */}

                        <div style={{borderTopStyle: "dashed"}} className="">
                          <dl style={{ margin: "0px" }} className="row ">
                            <dt style={{ margin: "0px" }} className="col-8">
                              Subtotal :
                            </dt>
                            <dd style={{ margin: "0px" }} className="col-4">
                              ₹ {invoice.subAmount}
                            </dd>
                            <dt style={{ margin: "0px" }} className="col-8">
                              Discount :
                            </dt>
                            <dd style={{ margin: "0px" }} className="col-4">
                              ₹{" "}
                              {invoice.couponAmount == "NaN"
                                ? 0
                                : invoice.couponAmount}{" "}
                            </dd>
                            <dt style={{ margin: "0px" }} className="col-8">
                              GST ({sumtax}%):
                            </dt>
                            <dd style={{ margin: "0px" }} className="col-4">
                              ₹{invoice.gst}
                              <hr
                                style={{
                                  marginBottom: "5px",
                                  marginTop: "5px",
                                }}
                              />
                            </dd>
                            <dt className="col-8 font-20px">Total:</dt>
                            <dd className="col-4 font-20px">
                              ₹ {invoice.totalAmount}
                            </dd>
                            <dt className="col-8 font-20px">Money Type:</dt>
                            <dd className="col-4 font-20px">
                              {invoice.moneyType}
                            </dd>
                          </dl>
                          {/* <span className="initial-38-5">
                          ---------------------------------
                          </span> */}
                          <h5  style={{borderTopStyle: "dashed", borderBottomStyle: "dashed",  fontSize: "14px" }}
                            // style={{ fontWeight: "800" }}
                            className="text-center "
                          >
                            <span className="d-block my-2">"Thank You. Visit Again."</span>
                          </h5>
                          {/* <span className="initial-38-5">
                          ---------------------------------
                          </span> */}
                          <span className="d-block text-center">
                           Receipts by carnivalcastle.com
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="2"></Col>
            </Row>
          </div>
        </Modal>
      </div>
    </React.Fragment>
  )
}

export default EcommerceCheckout
