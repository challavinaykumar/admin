import React, { useEffect, useState } from "react"
import {
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  Form,
  Label,
  Input,
  Button,
  Table,
  Modal,
} from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import axios from "axios"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"

const Coupons = () => {
  const [modal_small, setmodal_small] = useState(false)

  function tog_small() {
    setmodal_small(!modal_small)
    removeBodyCss()
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token
  console.log(datas)

  const [coup, setcoup] = useState([])
  const [form, setform] = useState([])
  const [form1, setform1] = useState([])

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }
  const handleChange1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
  }

  const getAllbcoupons = () => {
    var token = datas
    axios
      .post(
        URLS.GetCoupon,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setcoup(res.data.coupons)
      })
  }

  const addcoupons = () => {
    var token = datas
    // const dataArray = new FormData()
    // dataArray.append("title", form.title)
    // dataArray.append("couponCode", form.couponCode)
    // dataArray.append("couponCodeType", form.couponCodeType)
    // dataArray.append("percentDiscount", form.percentDiscount)
    // dataArray.append("amount", form.amount)
    // dataArray.append("description", form.description)
    // dataArray.append("fromDate", form.fromDate)
    // dataArray.append("toDate", form.toDate)

    const dataArray = {
      title: form.title,
      couponCode: form.couponCode,
      couponCodeType: form.couponCodeType,
      amount: form.amount,
      description: form.description,
      fromDate: form.fromDate,
      toDate: form.toDate,
    }

    axios
      .post(URLS.AddCoupon, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            getAllbcoupons()
            clearForm()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const getpopup = data => {
    setform1(data)
    tog_small()
  }

  const editcoupon = () => {
    var token = datas
    var formid = form1._id
    // const dataArray = new FormData()
    // dataArray.append("title", form1.title)
    // dataArray.append("couponCode", form1.couponCode)
    // dataArray.append("couponCodeType", form1.couponCodeType)
    // dataArray.append("percentDiscount", form1.percentDiscount)
    // dataArray.append("amount", form1.amount)
    // dataArray.append("description", form1.description)
    // dataArray.append("fromDate", form1.fromDate)
    // dataArray.append("toDate", form1.toDate)

    const dataArray = {
      title: form1.title,
      couponCode: form1.couponCode,
      couponCodeType: form1.couponCodeType,
      amount: form1.amount,
      description: form1.description,
      fromDate: form1.fromDate,
      toDate: form1.toDate,
    }

    axios
      .put(URLS.UpdateCoupon + "/" + formid, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            getAllbcoupons()
            setmodal_small(false)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const handleSubmit = e => {
    e.preventDefault()
    addcoupons()
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    editcoupon()
  }

  const deletebenners = data => {
    var token = datas
    var remid = data._id
    axios
      .delete(URLS.DeleteCoupon + "/" + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            getAllbcoupons()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const manageDelete = data => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      deletebenners(data)
    }
  }

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = coup.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(coup.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  useEffect(() => {
    getAllbcoupons()
  }, [])

  const clearForm = () => {
    setform({
      title: "",
      couponCode: "",
      couponCodeType: "",
      amount: "",
      description: "",
      fromDate: "",
      toDate: "",
      status: "",
    })
  }

  const [search, setsearch] = useState([])

  const searchAll = e => {
    let myUser = { ...search }
    myUser[e.target.name] = e.target.value
    setsearch(myUser)

    var token = datas
    axios
      .post(
        URLS.GeCouponSearch + `${e.target.value}`,
        {},

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setcoup(res.data.coupons)
      })
  }

  const [dds, setdds] = useState([])

  const handleChangedates = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)

    const tomorrow = new Date(e.target.value)
    tomorrow.setDate(tomorrow.getDate() + 1)
    setdds(tomorrow.toISOString().split("T")[0])
  }

  const [dds1, setdds1] = useState([])

  const handleChangedates1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)

    const tomorrow = new Date(e.target.value)
    tomorrow.setDate(tomorrow.getDate() + 1)
    setdds1(tomorrow.toISOString().split("T")[0])
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Coupons" />
          <Row>
          {Roles.CouponsAdd  || Roles?.accessAll === true ? <>
            <Col md={4}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Add Coupon</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      handleSubmit(e)
                    }}
                  >
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input2">
                        Title <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input2"
                        placeholder="Enter Title"
                        required
                        name="title"
                        value={form.title}
                        onChange={e => {
                          handleChange(e)
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input3">
                        Coupon Code <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input3"
                        placeholder="Enter Coupon Code"
                        required
                        name="couponCode"
                        value={form.couponCode}
                        onChange={e => {
                          handleChange(e)
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Coupon Code Type<span className="text-danger">*</span>
                      </Label>
                      <select
                        name="couponCodeType"
                        value={form.couponCodeType}
                        onChange={e => {
                          handleChange(e)
                        }}
                        required
                        className="form-select"
                      >
                        <option value="">Select</option>
                        <option value="Price">Price</option>
                        {/* <option value="Percentage">Percentage</option> */}
                      </select>
                    </div>
                    {form.couponCodeType == "Percentage" ? (
                      <div className="mb-3">
                        <Label for="basicpill-firstname-input2">
                          Percentage % <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="basicpill-firstname-input2"
                          placeholder="Enter  Percentage"
                          required
                          name="amount"
                          value={form.amount}
                          onChange={e => {
                            handleChange(e)
                          }}
                        />
                      </div>
                    ) : (
                      <div className="mb-3">
                        <Label for="basicpill-firstname-input2">
                          Price <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="basicpill-firstname-input2"
                          placeholder="Enter Price "
                          required
                          name="amount"
                          value={form.amount}
                          onChange={e => {
                            handleChange(e)
                          }}
                        />
                      </div>
                    )}

                    <div className="mb-3"></div>

                    <div className="mb-3">
                      <Label for="basicpill-firstname-input2">
                        From Date <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="date"
                        className="form-control"
                        id="basicpill-firstname-input2"
                        required
                        name="fromDate"
                        min={new Date().toISOString().split("T")[0]}
                        value={form.fromDate}
                        onChange={e => {
                          handleChangedates(e)
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input2">
                        Expire Date <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="date"
                        className="form-control"
                        id="basicpill-firstname-input2"
                        placeholder="Enter  Version"
                        required
                        name="toDate"
                        min={dds}
                        value={form.toDate}
                        onChange={e => {
                          handleChange(e)
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <Label for="basicpill-firstname-input2">
                        Description
                      </Label>
                      <textarea
                        type="date"
                        rows={2}
                        className="form-control"
                        id="basicpill-firstname-input2"
                        placeholder="Enter Description"
                        name="description"
                        value={form.description}
                        onChange={e => {
                          handleChange(e)
                        }}
                        required
                      />
                    </div>

                    <div style={{ float: "right" }}>
                      <Button className="m-1" color="primary" type="submit">
                        Submit <i className="fas fa-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>  </>:''
            }

<Col md={Roles.homeSlidersAdd  || Roles?.accessAll === true ?8:12}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Coupons List</CardTitle>
                </CardHeader>

                <CardBody>
                  <div>
                    <div className="table-responsive">
                      <div style={{ float: "right" }}>
                        <Input
                          type="search"
                          className="form-control"
                          placeholder="Search.."
                          value={search.search}
                          onChange={searchAll}
                          name="search"
                        />
                      </div>
                      <Table className="table table-bordered mb-4 mt-5">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Title</th>
                            <th>Coupon Codes</th>
                            <th>Coupon Type</th>
                            <th>Coupon Amount</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Description</th>
                            <th style={{ width: "100px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.map((data, key) => (
                            <tr key={key}>
                              <th>{(pageNumber - 1) * 5 + key + 6}</th>
                              <td>{data.title}</td>
                              <td>{data.couponCode}</td>
                              <td>{data.couponCodeType}</td>
                              <td>
                                {data.couponCodeType == "Percentage" ? (
                                  <>{data.amount}%</>
                                ) : (
                                  <>{data.amount} </>
                                )}
                              </td>
                              <td>{data.fromDate}</td>
                              <td>{data.toDate}</td>
                              <td>{data.description}</td>

                              <td>
                              {Roles.CouponsEdit  || Roles?.accessAll === true ?<>
                                <Button
                                  onClick={() => {
                                    getpopup(data)
                                  }}
                                  className="mr-2"
                                  style={{ padding: "6px", margin: "3px" }}
                                  color="success"
                                  outline
                                >
                                  <i className="bx bx-edit "></i>
                                </Button>       </>:''}
                                {Roles.CouponsDelete  || Roles?.accessAll === true ?<>
                                <Button
                                  onClick={() => {
                                    manageDelete(data)
                                  }}
                                  style={{ padding: "6px", margin: "3px" }}
                                  color="danger"
                                  outline
                                >
                                  <i className="bx bx-trash"></i>
                                </Button>       </>:''}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <div className="mt-3" style={{ float: "right" }}>
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
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />

        <Modal
          size="lg"
          isOpen={modal_small}
          toggle={() => {
            tog_small()
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              Edit Coupon 
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
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input2">
                      Title <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="basicpill-firstname-input2"
                      placeholder="Enter Title"
                      required
                      name="title"
                      value={form1.title}
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Coupon Code Type<span className="text-danger">*</span>
                    </Label>
                    <select
                      name="couponCodeType"
                      value={form1.couponCodeType}
                      onChange={e => {
                        handleChange1(e)
                      }}
                      className="form-select"
                    >
                      <option value="Price">Price</option>
                      <option value="Percentage">Percentage</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <Label for="basicpill-firstname-input2">
                      From Date <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="date"
                      className="form-control"
                      id="basicpill-firstname-input2"
                      required
                      name="fromDate"
                      value={form1.fromDate}
                      onChange={e => {
                        handleChangedates1(e)
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <Label for="basicpill-firstname-input2">Description</Label>
                    <textarea
                      type="date"
                      className="form-control"
                      id="basicpill-firstname-input2"
                      placeholder="Enter Description"
                      name="description"
                      value={form1.description}
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input3">
                      Coupon Code <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="basicpill-firstname-input3"
                      placeholder="Enter Coupon Code"
                      required
                      name="couponCode"
                      value={form1.couponCode}
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>

                  {form1.couponCodeType == "Percentage" ? (
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input2">
                        Percentage % <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input2"
                        placeholder="Enter Percentage"
                        required
                        name="amount"
                        value={form1.amount}
                        onChange={e => {
                          handleChange1(e)
                        }}
                      />
                    </div>
                  ) : (
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input2">
                        Price <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input2"
                        placeholder="Enter Price "
                        required
                        name="amount"
                        value={form1.amount}
                        onChange={e => {
                          handleChange1(e)
                        }}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <Label for="basicpill-firstname-input2">
                      Expire Date <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="date"
                      className="form-control"
                      id="basicpill-firstname-input2"
                      placeholder="Enter  Version"
                      required
                      name="toDate"
                      min={dds1}
                      value={form1.toDate}
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>
                </Col>
              </Row>

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
    </React.Fragment>
  )
}

export default Coupons
