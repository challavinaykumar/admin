import React, { useState, useEffect } from "react"
import {
  CardBody,
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Label,
  Form,
  Modal,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useHistory } from "react-router-dom"
import { URLS } from "../../Url"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { productsData } from "common/data"

function RecruitView() {
  const [modal_small, setmodal_small] = useState(false)
  const history = useHistory()
  const [Plan, setPlan] = useState([])
  const [form, setform] = useState([])
  const [AddOns, setAddOns] = useState([])
  const [Theater, setTheater] = useState([])
  const [Products, setProducts] = useState([])
  console.log(Products)
  const [Payments, setPayments] = useState([])
  const [Occation, setOccation] = useState([])
  const [Theaterimg, setTheaterimg] = useState([])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [form1, setform1] = useState([])

  const [Price, setPrice] = useState([])

  const [AddPrice, setAddPrice] = useState([])

  const [form2, setform2] = useState([])

  const [invoice, setInvoice] = useState("")

  function tog_small() {
    setmodal_small(!modal_small)
  }

  const getpopup = data => {
    setform1(data)
    tog_small()
  }

  const handleChange1 = e => {
    let myUser = { ...form2 }
    myUser[e.target.name] = e.target.value
    setform2(myUser)
    const cal = Number(e.target.value) * Price
    setAddPrice(cal)
  }

  useEffect(() => {
    GetBooking()
  }, [])

  const BookingId = sessionStorage.getItem("BookingId")
  // bookingId: localStorage.getItem("bookingid"),          in the website

  const GetBooking = () => {
    const data = {
      bookingId: BookingId,
    }
    var token = datas
    axios
      .post(URLS.GetPendingBookingsbyid, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setform(res?.data?.data[0])
        setPlan(res?.data?.planData[0])
        setPayments(res?.data?.data[0])
        setNoteDescription(res?.data?.data[0].noteDescription)
        setProducts(res?.data?.selectedProductData)
        // const cakes = res.data.productData
        // console.log(cakes)
        const selectedCaketype1 = res?.data?.productData.filter(
          cake => cake.categoryName !== "cakes"
        )
        const oneee = [...res?.data?.selectedProductData, ...selectedCaketype1]
        setProducts(oneee)
        setTheater(res?.data?.theatreData[0])
        setOccation(res?.data?.occasionData[0])
        setAddOns(res?.data?.data[0]?.products)
        setTheaterimg(res?.data?.theatreData[0]?.image)
        // setInvoice(res?.data?.invoice || ""); // invoice
        const data = res?.data?.data[0].theatreId
        const [startTime, endTime] = res?.data?.data[0].time.split(" - ")
        const start = new Date(`01/01/1970 ${startTime}`)
        const end = new Date(`01/01/1970 ${endTime}`)
        const differenceInMinutes = (end - start) / (1000 * 60)
        console.log()

        axios
          .post(
            URLS.GetOneTheater,
            { id: data },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then(res => {
            setPrice(
              differenceInMinutes == 90
                ? res?.data?.theatre?.onehalfanhourExtraPersonPrice
                : res?.data?.theatre?.extraPersonprice
            )
          })
      })
  }

  const handleDownload = () => {
    window.open(URLS.Base + form.invoice, "_blank", "noopener,noreferrer")
  }

  const Bookingid = () => {
    sessionStorage.setItem("PosID", form._id)
    sessionStorage.setItem("BookID", form._id)
    sessionStorage.setItem("PosName", form._id)
    sessionStorage.setItem("bookingdate", form?.date)
    sessionStorage.setItem("orderid", form?.orderId)
    sessionStorage.setItem("theatername", Theater?.name)
    history.push("/Pos")
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    editbenners()
  }

  // note api calling
  const [noteDescription, setNoteDescription] = useState("")

  const updateNote = () => {
    if (noteDescription.trim() === "") {
      toast("Please write the note before submitting.")
      return
    }

    const token = datas
    const dataArray = {
      noteDescription: noteDescription,
    }

    axios
      .put(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/updatenotedescription/${BookingId}`,
        dataArray,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(res => {
        if (res.status === 200) {
          toast(res.data.message)
          // setNoteDescription('');
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast(error.response.data.message)
        } else {
          toast("An unexpected error occurred.")
        }
      })
  }

  const handleNoteChange = e => {
    setNoteDescription(e.target.value)
  }

  // --------------------------------------------

  const editbenners = () => {
    var token = datas

    const dataArray = {
      bookingId: form._id,
      noOfPersons: Number(form2.noOfPersons),
      extraPersonPrice: AddPrice,
    }

    axios
      .put(URLS.UpdateExtraPersonStatus, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small(false)
            GetBooking()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="View Booking"
          />
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
              {form.status == "pending" ? (
                ""
              ) : (
                <>
                  <Button
                    onClick={() => {
                      Bookingid(data)
                    }}
                    className="mb-3  m-1 "
                    style={{ float: "right" }}
                    color="danger"
                  >
                    Add Pos
                  </Button>

                  <Button
                    onClick={() => {
                      getpopup(Occation?._id)
                    }}
                    className="mb-3  m-1 "
                    style={{ float: "right" }}
                    color="info"
                  >
                    Add Extra Person
                  </Button>
                </>
              )}
            </Col>
          </Row>
          <Card>
            <CardBody>
              <h5 className="mb-3 text-primary">Occation Details :</h5>
              <Row>
                <Col className="mt-2 mb-3">
                  <div className="d-flex">
                    <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Occation Image</h6>
                      <p className="text-muted fs-14 mb-0">
                        {" "}
                        <img
                          src={URLS.Base + Occation?.image}
                          style={{ width: "80px" }}
                        />
                      </p>
                    </div>
                  </div>
                </Col>
                <Col className="mt-2 mb-3">
                  <div className="d-flex">
                    <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Occation Name</h6>
                      <p className="text-muted fs-14 mb-0">{Occation?.name}</p>
                    </div>
                  </div>
                </Col>
                <Col className="mt-2 mb-3">
                  <div className="d-flex">
                    <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Person Name</h6>
                      <p className="text-muted fs-14 mb-0">
                        {form?.personName}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col className="mt-2 mb-3">
                  <div className="d-flex">
                    <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2"> Price</h6>
                      <p className="text-muted fs-14 mb-0">{parseFloat(Occation?.price).toFixed(2)}</p>
                    </div>
                  </div>
                </Col>
                <Col className="mt-2 mb-3">
                  <div className="d-flex">
                    <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2"> Status</h6>
                      <p className="text-muted fs-14 mb-0">
                        {Occation?.status}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              {form?.type == "combo" ? (
                <>
                  <hr></hr>
                  <h5 className="mb-3 text-primary">Plan Details :</h5>
                  <Row>
                    <Col md={3} className="mt-2 mb-3">
                      <div className="d-flex">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Plan Name</h6>
                          <p className="text-muted fs-14 mb-0">{Plan?.name}</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={3} className="mt-2 mb-3">
                      <div className="d-flex">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Plan Price</h6>
                          <p className="text-muted fs-14 mb-0">{Plan?.price}</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={3} className="mt-2 mb-3">
                      <div className="d-flex">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Plan Offer Price</h6>
                          <p className="text-muted fs-14 mb-0">
                            {Plan?.offerPrice}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col md={3} className="mt-2 mb-3">
                      <div className="d-flex">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Theater Price Included</h6>
                          <p className="text-muted fs-14 mb-0">
                            {Plan?.theatrePriceIncluded}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </>
              ) : (
                <></>
              )}
            </CardBody>
          </Card>
          <Row>
            <Col md={4}>
              <Card>
                <CardBody>
                  <h5 className="mb-3 text-primary">Slot Details : </h5>
                  <ul className="list-unstyled mt-4 ">
                    <li>
                      <div className="d-flex">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Date</h6>
                          <p className="text-muted fs-14 mb-0">{form?.date}</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex pt-4">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Time</h6>
                          <p className="text-muted fs-14 mb-0">{form?.time}</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex pt-4">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">No .of Persons</h6>
                          <p className="text-muted fs-14 mb-0">
                            {form?.noOfPersons}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex pt-4">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Booking Type</h6>
                          <p className="text-muted fs-14 mb-0">
                            {form?.type == null ? <>-</> : <>{form?.type}</>}
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <hr></hr>
                  <h5 className="text-primary  pt-3"> User Details :</h5>
                  <ul className="list-unstyled mt-4 ">
                    <li>
                      <div className="d-flex">
                        <i className="bx bx-user-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">User Name</h6>
                          <p className="text-muted fs-14 mb-0">
                            {form?.userName}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex mt-3">
                        <i className="bx bx-phone text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Phone</h6>
                          <p className="text-muted fs-14 mb-0">
                            {form?.userPhone}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="mt-3">
                      <div className="d-flex">
                        <i className="bx bx-mail-send text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Email</h6>
                          <p className="text-muted fs-14 mb-0">
                            {form?.userEmail}
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <CardBody>
                  <h5 className="text-primary"> Theater Details :</h5>
                  <Col md={12}>
                    <div className="text-center">
                      <img
                        src={URLS?.Base + Theaterimg}
                        style={{ height: "150px", width: "100%" }}
                      />
                    </div>
                  </Col>
                  <ul className="list-unstyled mt-3">
                    <li>
                      <div className="d-flex">
                        <i className="bx bx-store-alt text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Theater Name</h6>
                          <p className="text-muted fs-14 mb-0">
                            {Theater?.name}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex mt-3">
                        <i className="bx bx-map text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Batch Type</h6>
                          <p className="text-muted fs-14 mb-0">
                            {Theater?.batchType}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="mt-3">
                      <div className="d-flex">
                        <i className="bx bx-handicap text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2"> Seats </h6>
                          <p className="text-muted fs-14 mb-0">
                            {Theater?.maxPeople}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="mt-3">
                      <div className="d-flex">
                        <i className=" bx bx-wallet-alt text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Price </h6>
                          <p className="text-muted fs-14 mb-0">
                            {parseFloat(Theater?.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="mt-3">
                      <div className="d-flex">
                        <i className="bx bx-wallet-alt text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Offer Price </h6>
                          <p className="text-muted fs-14 mb-0">
                            {parseFloat(Theater?.offerPrice).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="mt-3">
                      <div className="d-flex">
                        <i className="bx bx-handicap text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Extra Person Price</h6>
                          <p className="text-muted fs-14 mb-0">
                            {parseFloat(Theater?.extraPersonprice).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <CardBody>
                  {/* <h5 className="text-primary pb-2 "> Payments :</h5> */}
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <h5 className="text-primary">Payments:</h5>
                    </div>
                    <div className="col-12 col-md-6 text-end">
                      <Button
                        className="btn btn-success mb-2"
                        onClick={handleDownload}
                        disabled={
                          form.invoice == undefined ||
                          form.invoice == "" ||
                          form.invoice == null
                        }
                      >
                        <i className="fas fa-file-invoice"></i> Invoice
                      </Button>
                    </div>
                  </div>

                  <Table hover className="table table-bordered ">
                    <tbody>
                      <tr className="text-center">
                        <th>Transtation Id</th>
                        <td>{Payments?.transactionId}</td>
                      </tr>
                      <tr className="text-center">
                        <th>Transtation Status</th>
                        <td>{Payments?.transactionStatus}</td>
                      </tr>
                      <tr className="text-center">
                        <th>Sub Amount</th>
                        <td>{parseFloat(Payments?.subTotal).toFixed(2)}</td>
                      </tr>
                      {/* <tr className="text-center">
                        <th>Gst ({Payments?.gst} %)</th>
                        <td> + {((Payments?.gst / 100) * Payments?.subTotal).toFixed(2)}</td>
                      </tr> */}
                      <tr className="text-center">
                        <th>Coupon Code ({Payments?.couponCode})</th>
                        <td>{parseFloat(Payments?.couponAmount).toFixed(2)}</td>
                      </tr>
                      <tr className="text-center">
                        <th>Total Amount</th>
                        <td>{parseFloat(Payments?.totalPrice).toFixed(2)}</td>
                      </tr>
                      <tr className="text-center">
                        <th>Payment Type</th>
                        <td>{Payments?.paymentType}</td>
                      </tr>
                      <tr className="text-center">
                        <th>Advance Amount </th>
                        <td>
                          {parseFloat(Payments?.advancePayment).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="text-center">
                        <th>Remaning Amount</th>
                        <td>
                          {(
                            parseFloat(Payments?.totalPrice) -
                            parseFloat(Payments?.advancePayment)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Card>
            <CardBody className="mt-3 mb-3">
              <Row>
                <Col md={form?.type === "combo" ? 6 : 12}>
                  {form?.type !== "combo" && (
                    <>
                      <h5 className="text-primary">AddOns Details :</h5>
                      <div className="table-rep-plugin mt-3 table-responsive">
                        <Table hover className="table table-bordered mb-4">
                          <thead>
                            <tr className="text-center">
                              <th>Sl.No</th>
                              <th>Product Name</th>
                              <th>Unit Price</th>
                              <th>Quantity</th>
                              <th>Total Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {AddOns?.map((data, key) => (
                              <tr key={key} className="text-center">
                                <td>{key + 1}</td>
                                <td>{data?.name}</td>
                                <td>{parseFloat(data?.price).toFixed(2)}</td>
                                <td>
                                  {data?.quantity}
                                  {data.type === "cake"
                                    ? data?.quantity === 500
                                      ? " GMS"
                                      : " Kg"
                                    : ""}
                                </td>
                                <td>
                                  {(data?.type === "cake"
                                    ? data?.quantity === 500
                                      ? parseFloat(data?.price)
                                      : parseFloat(data?.price) *
                                        (2 * parseFloat(data?.quantity))
                                    : parseFloat(data?.price) *
                                      parseFloat(data?.quantity)).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}

                  {form?.type === "combo" && (
                    <>
                      <h5 className="text-primary">Plan Benefits Details :</h5>
                      <div className="table-rep-plugin mt-3 table-responsive">
                        <Table hover className="table table-bordered mb-4">
                          <thead>
                            <tr className="text-center">
                              <th>Sl.No</th>
                              <th>Image</th>
                              <th>Product Name</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Products?.map((data, key) => (
                              <tr key={key} className="text-center">
                                <td>{key + 1}</td>
                                <td>
                                  <img
                                    src={URLS.Base + data?.image}
                                    style={{ width: "20px" }}
                                    alt={data?.name}
                                  />
                                </td>
                                <td>{data?.name}</td>
                                <td>{"Free"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>

          <div className="form-group m-3 position-relative">
            <label htmlFor="nameInput">
              <b style={{ color: "red" }}>Note : </b>
            </label>
            <div className="input-group">
              <textarea
                className="form-control"
                id="exampleTextarea"
                rows="4"
                required
                placeholder="Type here..."
                value={noteDescription}
                onChange={e => {
                  handleNoteChange(e)
                }}
              ></textarea>
            </div>
            <div className="mt-2">
              <button
                className="btn btn-primary"
                type="button"
                onClick={updateNote}
              >
                Submit
              </button>
            </div>
          </div>
        </Container>
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
              Add Extra Person
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
                <Label for="basicpill-firstname-input1">
                  Add Extra Person <span className="text-danger">*</span>
                </Label>
                <input
                  type="number"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Add Extra Person"
                  required
                  name="noOfPersons"
                  value={form2.noOfPersons}
                  onChange={e => {
                    handleChange1(e)
                  }}
                />
              </div>
              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Extra Person Price ({Price})
                  <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Price"
                  required
                  name="AddPrice"
                  value={AddPrice}
                  disabled
                />
              </div>
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
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default RecruitView
