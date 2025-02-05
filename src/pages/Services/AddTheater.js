import React, { useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useHistory } from "react-router-dom"
import { Link } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import Dropzone from "react-dropzone"
import axios from "axios"
import { URLS } from "../../Url"

function AddVendors() {
  const [form, setform] = useState({
    name: "",
    batchType: "",
    maxPeople: "",
    price: "",
    offerPrice: "",
    oneandhalfslotPrice: "",
    extraPersonprice: "",
    description: "",
    extraPerson: "",
    link: "",
    maxSeating: "",
  })
  const [selectedFiles, setselectedFiles] = useState([])

  const [selectedFiles1, setselectedFiles1] = useState([])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const handleSubmit = e => {
    e.preventDefault()
    Adddealer()
  }

  const [inputList, setInputList] = useState([""])

  const handleInputChange = (e, index) => {
    const { value } = e.target
    const list = [...inputList]
    list[index] = value
    setInputList(list)
  }

  const handleRemoveClick = index => {
    const list = [...inputList]
    list.splice(index, 1)
    setInputList(list)
  }

  const handleAddClick = () => {
    setInputList([...inputList, ""])
  }

  const removeFile = index => {
    setselectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const removeFile1 = index => {
    setselectedFiles1(prev => prev.filter((_, i) => i !== index))
  }

  const history = useHistory()
  const Adddealer = () => {
    var token = datas
    const dataArray = new FormData()
    dataArray.append("link", form.link)
    dataArray.append("name", form.name)
    dataArray.append("price", form.price)
    dataArray.append("batchType", form.batchType)
    dataArray.append("maxPeople", form.maxPeople)
    dataArray.append("offerPrice", form.offerPrice)
    dataArray.append("oneandhalfslotPrice", form.oneandhalfslotPrice)
    dataArray.append("extraPerson", form.extraPerson)
    dataArray.append("description", form.description)
    dataArray.append("features", JSON.stringify(inputList))
    dataArray.append("extraPersonprice", form.extraPersonprice)
    dataArray.append("onehalfanhourExtraPersonPrice", form.onehalfanhourExtraPersonPrice)
    dataArray.append("maxSeating", form.maxSeating)

    for (let i = 0; i < selectedFiles.length; i++) {
      dataArray.append("image", selectedFiles[i])
    }

    for (let i = 0; i < selectedFiles1.length; i++) {
      dataArray.append("video", selectedFiles1[i])
    }

    axios
      .post(URLS.AddTheater, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            sessionStorage.setItem(
              "tost",
              "Theater has been Added Successfully"
            )
            history.push("/Theater")
            setSelectedOptions("")
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

  const handlechange = e => {
    const myform = { ...form }
    myform[e.target.name] = e.target.value
    setform(myform)
  }

  const clearForm = () => {
    setform({
      link: "",
      name: "",
      price: "",
      batchType: "",
      maxPeople: "",
      offerPrice: "",
      oneandhalfslotPrice: "",
      description: "",
      extraPerson: "",
      extraPersonprice: "",
      maxSeating: "",
    })
    setInputList([""])
    setselectedFiles("")
  }

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    setselectedFiles(files)
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  function handleAcceptedFiles1(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes1(file.size),
      })
    )
    setselectedFiles1(files)
  }

  function formatBytes1(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Add Theater"
          />
          <Form
            onSubmit={e => {
              handleSubmit(e)
            }}
          >
            <Row>
              <Col xl="12">
                <Button
                  onClick={history.goBack}
                  className="mb-3"
                  style={{ float: "right" }}
                  color="primary"
                >
                  <i className="far fa-arrow-alt-circle-left"></i>
                  Back
                </Button>
              </Col>
            </Row>
            <Card>
              <CardBody>
                <Row className="mt-2">
                  <Col lg="6" className="mt-4">
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Theater Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Theater Name"
                        required
                        value={form.name}
                        name="name"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Badge Type
                          </Label>
                          <select
                            value={form.batchType}
                            name="batchType"
                            onChange={e => {
                              handlechange(e)
                            }}
                            className="form-select"
                          >
                            <option value="">Select</option>
                            <option value="Most Booked">Most Booked</option>
                            <option value="Cheapest">Cheapest</option>
                            <option value="Family Recalled">
                              Family Recalled
                            </option>
                            <option value="Couples Recalled">
                              Couples Recalled
                            </option>
                          </select>
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Max People <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Max People"
                            required
                            value={form.maxPeople}
                            name="maxPeople"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Price <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter  Price"
                            required
                            value={form.price}
                            name="price"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Offer Price <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Offer Price"
                            required
                            value={form.offerPrice}
                            name="offerPrice"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      {/* 1.5 hours SHOW */}
                      <Col>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                          One and Half Hour <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter One and Half Hour"
                            required
                            value={form.oneandhalfslotPrice}
                            name="oneandhalfslotPrice"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="col-6">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Max Seating <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Max Seating"
                            required
                            value={form.maxSeating}
                            name="maxSeating"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col className="col-6">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Extra Person <span className="text-danger">*</span>
                          </Label>
                          <select
                            value={form.extraPerson}
                            name="extraPerson"
                            onChange={e => {
                              handlechange(e)
                            }}
                            className="form-select"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      </Col>
                      {form.extraPerson == "Yes" ? (
                        <>
                          <Col className="col-6">
                            <div className="mb-3">
                              <Label for="basicpill-firstname-input1">
                                Extra Person Price{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="basicpill-firstname-input1"
                                placeholder="Enter Extra Person Price"
                                required
                                value={form.extraPersonprice}
                                name="extraPersonprice"
                                onChange={e => {
                                  handlechange(e)
                                }}
                              />
                            </div>
                          </Col>
                          <Col className="col-6">
                            <div className="mb-3">
                              <Label for="basicpill-firstname-input1">
                               1.5 Hours Extra Person Price{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="basicpill-firstname-input1"
                                placeholder="Enter Extra Person Price"
                                required
                                value={form.onehalfanhourExtraPersonPrice}
                                name="onehalfanhourExtraPersonPrice"
                                onChange={e => {
                                  handlechange(e)
                                }}
                              />
                            </div>
                          </Col>
                        </>
                      ) : (
                        <></>
                      )}

                      <Col md="6">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Description <span className="text-danger">*</span>
                          </Label>
                          <textarea
                            type="text"
                            rows="1"
                            className="form-control "
                            id="basicpill-firstname-input1"
                            placeholder="Enter Description"
                            required
                            value={form.description}
                            name="description"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Youtube Link <span className="text-danger">*</span>
                          </Label>
                          <textarea
                            type="text"
                            rows="1"
                            className="form-control "
                            id="basicpill-firstname-input1"
                            placeholder="Enter Link"
                            required
                            value={form.link}
                            name="link"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md="10">
                        <Label>Features</Label>
                        {inputList.map((x, i) => {
                          return (
                            <>
                              <Row>
                                <div key={i} className="box row">
                                  <Col md="8" className="mb-3">
                                    <Input
                                      type="text"
                                      required
                                      name="features"
                                      placeholder="Enter Features"
                                      value={x}
                                      onChange={e => handleInputChange(e, i)}
                                    />
                                  </Col>
                                  <Col md="4">
                                    <div className="btn-box">
                                      {inputList.length !== 1 && (
                                        <button
                                          className="mr10 btn btn-outline-danger btn-sm m-1"
                                          type="button"
                                          onClick={() => handleRemoveClick(i)}
                                        >
                                          Remove
                                          <i className="bx bx-x-circle"></i>
                                        </button>
                                      )}
                                      {inputList.length - 1 === i && (
                                        <button
                                          className="btn btn-sm btn-outline-info m-1"
                                          onClick={handleAddClick}
                                        >
                                          Add
                                          <i className="bx bx-plus-circle"></i>
                                        </button>
                                      )}
                                    </div>
                                  </Col>
                                </div>
                              </Row>
                            </>
                          )
                        })}
                      </Col>
                    </Row>
                  </Col>
                  <Col lg="6">
                    <div className="text-center m-4">
                      <h5 style={{ fontWeight: "bold" }}>Theater Image</h5>
                      <div className="w-50 m-auto">
                        <Dropzone
                          onDrop={acceptedFiles => {
                            handleAcceptedFiles(acceptedFiles)
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone">
                              <div
                                className="dz-message needsclick mt-2"
                                {...getRootProps()}
                              >
                                <input {...getInputProps()} />
                                <div className="mb-3">
                                  <i className="display-4 text-muted bx bxs-cloud-upload" />
                                </div>
                                <h4>Upload File</h4>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                        <div
                          className="dropzone-previews mt-3"
                          id="file-previews"
                        >
                          {selectedFiles.map((f, i) => {
                            return (
                              <Card
                                className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                key={i + "-file"}
                              >
                                <div className="p-2">
                                  <Row className="align-items-center">
                                    <Col className="col-auto">
                                      <img
                                        data-dz-thumbnail=""
                                        height="40"
                                        className="avatar-sm rounded bg-light"
                                        alt={f.name}
                                        src={f.preview}
                                      />
                                    </Col>
                                    <Col>
                                      <Link
                                        to="#"
                                        className="text-muted font-weight-bold"
                                      >
                                        {f.name}
                                      </Link>
                                      <p className="mb-0">
                                        <strong>{f.formattedSize}</strong>
                                      </p>
                                    </Col>
                                    <Col className="col-auto">
                                      {/* <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeFile(i)}
                                      >
                                        Remove
                                      </button> */}
                                      <i
                                        className="fas fa-times fa-2x"
                                        onClick={() => removeFile(i)}
                                        style={{ cursor: "pointer", color:"red" }}
                                      ></i>
                                    </Col>
                                  </Row>
                                </div>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="text-center m-4">
                      <h5 style={{ fontWeight: "bold" }}>Theater Video</h5>
                      <div className="w-50 m-auto">
                        <Dropzone
                          onDrop={acceptedFiles => {
                            handleAcceptedFiles1(acceptedFiles)
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone">
                              <div
                                className="dz-message needsclick mt-2"
                                {...getRootProps()}
                              >
                                <input {...getInputProps()} />
                                <div className="mb-3">
                                  <i className="display-4 text-muted bx bxs-cloud-upload" />
                                </div>
                                <h4>Upload File</h4>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                        <div
                          className="dropzone-previews mt-3"
                          id="file-previews"
                        >
                          {selectedFiles1.map((f, i) => {
                            return (
                              <Card
                                className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                key={i + "-file"}
                              >
                                <div className="p-2">
                                  <Row className="align-items-center">
                                    <Col className="col-auto">
                                      <iframe
                                        data-dz-thumbnail=""
                                        height="40"
                                        className="avatar-sm rounded bg-light"
                                        alt={f.name}
                                        src={f.preview}
                                      />
                                    </Col>
                                    <Col>
                                      <Link
                                        to="#"
                                        className="text-muted font-weight-bold"
                                      >
                                        {f.name}
                                      </Link>
                                      <p className="mb-0">
                                        <strong>{f.formattedSize}</strong>
                                      </p>
                                    </Col>
                                    <Col className="col-auto">
                                      {/* <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeFile1(i)}
                                      >
                                        Remove
                                      </button> */}
                                      <i
                                        className="fas fa-times fa-2x"
                                        onClick={() => removeFile1(i)}
                                        style={{ cursor: "pointer", color:"red" }}
                                      ></i>
                                    </Col>
                                  </Row>
                                </div>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Row>
              <Col md={12}>
                <div className="mb-3" style={{ float: "right" }}>
                  <button
                    type="submit"
                    style={{ width: "120px" }}
                    className="btn btn-info m-1"
                  >
                    Submit <i className="fas fa-cHCUk-circle"></i>
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default AddVendors
