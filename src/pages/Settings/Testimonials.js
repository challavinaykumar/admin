import React, { useState, useEffect } from "react"
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
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import axios from "axios"
import { URLS } from "../../Url"

const Banner = () => {
  const [modal_small, setmodal_small] = useState(false)
  const [banner, setbanner] = useState([])
  const [form, setform] = useState([])
  const [form1, setform1] = useState([])

  const [Files, setFiles] = useState("")
  const [Files1, setFiles1] = useState("")

  const changeHandler = e => {
    const file = e.target.files
    var ext = file[0].name.split(".").pop()
    var type = ext
    if (type == "jpg" || type == "jpeg" || type == "png") {
      setFiles(e.target.files)
    } else {
      e.target.value = null
      toast("file format not supported.Pls choose Image")
    }
  }
  const changeHandler1 = e => {
    const file = e.target.files
    var ext = file[0].name.split(".").pop()
    var type = ext
    if (type == "jpg" || type == "jpeg" || type == "png") {
      setFiles1(e.target.files)
    } else {
      e.target.value = null
      toast("file format not supported.Pls choose Image")
    }
  }

  function tog_small() {
    setmodal_small(!modal_small)
  }

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

  useEffect(() => {
    GetAllBanners()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = banner.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(banner.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const handleSubmit = e => {
    e.preventDefault()
    AddBanner()
  }

  const AddBanner = () => {
    var token = datas
    const dataArray = new FormData()
    dataArray.append("name", form.name)
    dataArray.append("rating", form.rating)
    dataArray.append("description", form.description)
    for (let i = 0; i < Files.length; i++) {
      dataArray.append("image", Files[i])
    }
    axios
      .post(URLS.AddTestimonials, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllBanners()
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

  const EditBanner = () => {
    var token = datas
    var formid = form1._id
    const dataArray = new FormData()
    dataArray.append("name", form1.name)
    dataArray.append("rating", form1.rating)
    dataArray.append("description", form1.description)
    for (let i = 0; i < Files1.length; i++) {
      dataArray.append("image", Files1[i])
    }
    axios
      .put(URLS.UpdateTestimonials + formid, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllBanners()
            setmodal_small(false)
            clearForm1()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const DeleteBanner = data => {
    var token = datas
    var remid = data._id
    axios
      .delete(URLS.DeleteTestimonials + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllBanners()
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
      DeleteBanner(data)
    }
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    EditBanner()
  }

  const GetAllBanners = () => {
    var token = datas
    axios
      .post(
        URLS.GetTestimonials,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setbanner(res.data.testimoni)
        // setIsLoading(false)
      })
  }
  const clearForm1 = () => {
    setFiles1({
      image: "",
    })
  }
  const clearForm = () => {
    setform({
      name: "",
      description: "",
      rating: "",
    })
    setFiles({
      image: "",
    })
  }

  const getpopup = data => {
    setform1(data)
    tog_small()
  }

  const [search, setsearch] = useState([])

  const searchAll = e => {
    let myUser = { ...search }
    myUser[e.target.name] = e.target.value
    setsearch(myUser)

    var token = datas
    axios
      .post(
        URLS.GetTestimonialsSearch + `${e.target.value}`,
        {},

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setbanner(res.data.testimoni)
      })
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Testimonial"
          />
          <Row>
          {Roles.testimonialsAdd  || Roles?.accessAll === true ? <>
            <Col md={4}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Add Testimonial</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      handleSubmit(e)
                    }}
                  >
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Name"
                        required
                        name="name"
                        value={form.name}
                        onChange={e => {
                          handleChange(e)
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Image <span className="text-danger">* 400*600</span>
                      </Label>
                      <Input
                        type="file"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        required
                        name="image"
                        value={Files.image}
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Rating <span className="text-danger">*</span>
                      </Label>
                      <select
                        value={form.rating}
                        name="rating"
                        onChange={e => {
                          handleChange(e)
                        }}
                        className="form-select"
                      >
                        <option value="">Select</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Description <span className="text-danger">*</span>
                      </Label>
                      <textarea
                        type="text"
                        rows="6"
                        className="form-control "
                        id="basicpill-firstname-input1"
                        placeholder="Enter Description"
                        required
                        value={form.description}
                        name="description"
                        onChange={e => {
                          handleChange(e)
                        }}
                      />
                    </div>
                    <div style={{ float: "right" }}>
                      <Button color="primary" type="submit">
                        Submit <i className="fas fa-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>  </>:''
            }
         <Col md={Roles.testimonialsAdd  || Roles?.accessAll === true ?8:12}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Testimonial List</CardTitle>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="table-responsive">
                      <div style={{ float: "right" }}>
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Search.."
                          value={search.search}
                          onChange={searchAll}
                          name="search"
                        />
                      </div>
                      <Table className="table table-bordered mb-4 mt-5">
                        <thead>
                          <tr className="text-center">
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Rating</th>
                            <th>Description</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.map((data, key) => (
                            <tr key={key} className="text-center">
                              <th>{(pageNumber - 1) * 5 + key + 6}</th>
                              <td>{data.name}</td>
                              <td>
                                <img
                                  style={{ width: "100px" }}
                                  src={URLS.Base + data.image}
                                />
                              </td>
                              <td>{data.rating}</td>
                              <td>{data.description}</td>
                              <td>
                              {Roles.testimonialsEdit  || Roles?.accessAll === true ?<>
                                <Button
                                  onClick={() => {
                                    getpopup(data)
                                  }}
                                  className="mr-2"
                                  style={{
                                    padding: "6px",
                                    margin: "3px",
                                  }}
                                  color="success"
                                  outline
                                >
                                  <i className="bx bx-edit "></i>
                                </Button>    </>:''}
                                {Roles.testimonialsDelete  || Roles?.accessAll === true ?<>
                                <Button
                                  onClick={() => {
                                    manageDelete(data)
                                  }}
                                  style={{
                                    padding: "6px",
                                    margin: "3px",
                                  }}
                                  color="danger"
                                  outline
                                >
                                  <i className="bx bx-trash"></i>
                                </Button> </>:''}
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
              Edit Testimonial
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
                  Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Name"
                  required
                  name="name"
                  value={form1.name}
                  onChange={e => {
                    handleChange1(e)
                  }}
                />
              </div>
              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Image <span className="text-danger">* 400*600</span>
                </Label>
                <Input
                  type="file"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  name="image"
                  value={Files1.image}
                  onChange={changeHandler1}
                />
              </div>
              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Rating <span className="text-danger">*</span>
                </Label>
                <select
                  value={form1.rating}
                  name="rating"
                  onChange={e => {
                    handleChange1(e)
                  }}
                  className="form-select"
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Description <span className="text-danger">*</span>
                </Label>
                <textarea
                  type="text"
                  rows="6"
                  className="form-control "
                  id="basicpill-firstname-input1"
                  placeholder="Enter Description"
                  required
                  value={form1.description}
                  name="description"
                  onChange={e => {
                    handleChange1(e)
                  }}
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
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Banner
