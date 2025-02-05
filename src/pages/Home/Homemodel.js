import React, { useEffect, useState } from "react"
import {
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Label,
  Input,
  CardTitle,
  Modal,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"
import axios from "axios"

function DigitalBrochure() {
  const [files, setFiles] = useState([])

  const [modal_small, setmodal_small] = useState(false)

  const [show, setshow] = useState(false)

  const [show1, setshow1] = useState(false)

  const changeHandler = e => {
    const file = e.target.files
    var ext = file[0].name.split(".").pop()
    var type = ext
    if (
      type == "jpg" ||
      type == "jpeg" ||
      type == "png" ||
      type == "JPG" ||
      type == "JPEG" ||
      type == "PNG" ||
      type == "JPEG" ||
      type == "WEBP" ||
      type == "webp"
    ) {
      setFiles(e.target.files)
    } else {
      e.target.value = null
      toast("file format not supported.Pls choose Image")
    }
  }

  const [form, setform] = useState([])

  const [forms, setforms] = useState([])

  const handlechange = e => {
    const myUser = { ...forms }
    myUser[e.target.name] = e.target.checked
    setforms(myUser)
  }

  const handlechanges = e => {
    const myUser = { ...forms }
    myUser[e.target.name] = e.target.value
    setforms(myUser)
  }

  useEffect(() => {
    GetAllBroucher()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const GetAllBroucher = () => {
    var token = datas

    axios
      .post(
        URLS.GetPopup,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setform(res.data.popup)
        setforms(res.data.popup)
      })
  }

  function tog_small() {
    setshow(!show)
  }

  const getpopup1 = () => {
    tog_small()
  }

  const submibooking = e => {
    e.preventDefault()
    changstatus()
  }

  const changstatus = () => {
    var token = datas

    const dataArray = new FormData()
    dataArray.append("popupBoolean", forms.popupBoolean)

    for (let i = 0; i < files.length; i++) {
      dataArray.append("image", files[i])
    }

    axios
      .put(URLS.UpdatePopup, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setshow(false)
            GetAllBroucher()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  function tog_small2() {
    setshow1(!show1)
  }

  const getpopup2 = () => {
    tog_small2()
  }

  const submibooking1 = e => {
    e.preventDefault()
    changstatus1()
  }

  const changstatus1 = () => {
    var token = datas
    const dataArray = {
      title: forms.title,
      modalEnabled: forms.modalEnabled,
    }

    axios
      .put(URLS.UpdatePopup1, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setshow1(false)
            GetAllBroucher()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  var gets = localStorage.getItem("authUser")

  function tog_small1() {
    setmodal_small(!modal_small)
  }

  const getpopup = () => {
    tog_small1()
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
            breadcrumbItem="Home Popup"
          />
          {show == true ? (
            <Col md={12}>
              <Card>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      submibooking(e)
                    }}
                  >
                    <Row>
                      <CardTitle className="mb-3">Edit Home Popup</CardTitle>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Image
                            <span className="text-danger">
                              <Button
                                onClick={() => {
                                  getpopup()
                                }}
                                size="sm"
                                className="m-1"
                                outline
                                color="info"
                              >
                                <i className="fas fa-eye"></i>
                              </Button>
                              400*600
                            </span>
                          </Label>
                          <Input
                            type="file"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            name="image"
                            value={files.image}
                            onChange={changeHandler}
                          />
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="mb-3 mt-5">
                          <Label
                            onClick={e => {
                              handlechange(e)
                            }}
                            className="form-check-label"
                            for="popupBoolean"
                          >
                            Is Show
                          </Label>
                          <Input
                            className="form-check-input m-1"
                            type="checkbox"
                            name="popupBoolean"
                            defaultChecked={forms.popupBoolean}
                            value={forms.popupBoolean}
                            onClick={e => {
                              handlechange(e)
                            }}
                            id="read"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div style={{ float: "right" }}>
                      <Button color="primary" type="submit">
                        Submit <i className="fas fa-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
          <Row>
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white">
                  <Row>
                    <Col>
                      <div style={{ float: "right" }}>
                      {Roles?.homePopUpEdit === true || Roles?.accessAll === true ? (
                        <Button
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Edit Booking"
                          onClick={() => {
                            getpopup1()
                          }}
                          className="mr-5 mb-1 m-1 mt-3"
                          color="success"
                          outline
                        >
                          <i className="bx bx-edit text-dark "></i>
                          <span>Edit Home Popup</span>
                        </Button>):""}
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <div>
                      <div className="table-rep-plugin mt-2 table-responsive">
                        <Table hover className="table table-bordered mb-4">
                          <thead>
                            <tr className="text-center">
                              <th>Popup Image</th>
                              <th>Popup Status</th>
                            </tr>
                            <tr className="text-center">
                              <td>
                                <img
                                  src={URLS.Base + form.image}
                                  width="100px"
                                ></img>
                              </td>
                              <td>
                                {form.popupBoolean == true ||
                                form.popupBoolean == true ? (
                                  <p style={{ paddingBottom: "50px" }}>Show</p>
                                ) : (
                                  <p style={{ paddingBottom: "50px" }}>Hide</p>
                                )}
                              </td>
                            </tr>
                          </thead>
                        </Table>
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>


          {show1 == true ? (
            <Col md={12}>
              <Card>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      submibooking1(e)
                    }}
                  >
                    <Row>
                      <CardTitle className="mb-3">Edit Image Popup</CardTitle>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Title <span className="text-danger">*</span>
                          </Label>
                          <textarea
                            type="text"
                            rows="2"
                            className="form-control "
                            id="basicpill-firstname-input1"
                            placeholder="Enter Title"
                            required
                            value={forms.title}
                            name="title"
                            onChange={e => {
                              handlechanges(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3 mt-5">
                          <Label
                            onClick={e => {
                              handlechange(e)
                            }}
                            className="form-check-label"
                            for="modalEnabled"
                          >
                            Is Show
                          </Label>
                          <Input
                            className="form-check-input m-1"
                            type="checkbox"
                            name="modalEnabled"
                            defaultChecked={forms.modalEnabled}
                            value={forms.modalEnabled}
                            onClick={e => {
                              handlechange(e)
                            }}
                            id="read"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div style={{ float: "right" }}>
                      <Button color="primary" type="submit">
                        Submit <i className="fas fa-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
          <Row>
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white">
                  <Row>
                    <Col>
                      <div style={{ float: "right" }}>
                      {Roles?.homePopUpEdit === true || Roles?.accessAll === true ? (
                        <Button
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Edit Booking"
                          onClick={() => {
                            getpopup2()
                          }}
                          className="mr-5 mb-1 m-1 mt-3"
                          color="success"
                          outline
                        >
                          <i className="bx bx-edit text-dark "></i>
                          <span>Edit Title Popup</span>
                        </Button>):""}
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <div>
                      <div className="table-rep-plugin mt-2 table-responsive">
                        <Table hover className="table table-bordered mb-4">
                          <thead>
                            <tr className="text-center">
                              <th>Popup Title</th>
                              <th>Popup Status</th>
                            </tr>
                            <tr className="text-center">
                              <td>{form.title}</td>
                              <td>
                                {form.modalEnabled == true ||
                                form.modalEnabled == true ? (
                                  <>Show</>
                                ) : (
                                  <>Hide</>
                                )}
                              </td>
                            </tr>
                          </thead>
                        </Table>
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
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
            View Image
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
          <img src={URLS.Base + form.image} width="100%"></img>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default DigitalBrochure
