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
  ModalHeader,
  ModalBody,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import axios from "axios"
import ReactPaginate from "react-paginate"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"

const Staff = () => {
  const [show, setshow] = useState(false)
  const [show1, setshow1] = useState(false)

  const toggle = () => setshow1(!show1)

  const [form, setform] = useState([])
  const [users, setusers] = useState([])
  const [form1, setform1] = useState([])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

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

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

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
      toast("File format not supported. Please choose JPG, JPEG, or PNG.")
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
      toast("File format not supported. Please choose JPG, JPEG, or PNG.")
    }
  }

  const Get = () => {
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
        setusers(res.data.staff)
      })
  }

  const custsearch = e => {
    const myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)

    const token = datas
    console.log(token)
    axios
      .post(
        URLS.GetStaffSearch + `${e.target.value}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          if (res.status === 200) {
            setusers(res.data.staff)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const Add = () => {
    var token = datas

    const dataArray = new FormData()
    dataArray.append("email", form.email)
    dataArray.append("phone", form.phone)
    dataArray.append("password", form.password)
    dataArray.append("departmentId", form.departmentId)
    dataArray.append("roleId", form.roleId)
    dataArray.append("name", form.name)
    dataArray.append("address", form.address)

    for (let i = 0; i < Files.length; i++) {
      dataArray.append("profilepic", Files[i])
    }

    axios
      .post(URLS.AddStaff, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setform({
              email: "",
              phone: "",
              password: "",
              departmentId: "",
              roleId: "",
              name: "",
              address: "",
            })
            setFiles({ profilepic: "" })
            Get()
            setshow(false)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const formsubmit = e => {
    e.preventDefault()
    Add()
  }

  const Update = () => {
    var token = datas
    const dataArray = new FormData()
    dataArray.append("email", form1.email)
    dataArray.append("phone", form1.phone)
    dataArray.append("password", form1.password)
    dataArray.append("departmentId", form1.departmentId)
    dataArray.append("roleId", form1.roleId)
    dataArray.append("name", form1.name)
    dataArray.append("address", form1.address)
    for (let i = 0; i < Files1.length; i++) {
      dataArray.append("profilepic", Files1[i])
    }
    axios
      .put(URLS.EditStaff + form1._id, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            Get()
            setshow1(false)
            setFiles1({ profilepic: "" })
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const formeditsubmit = e => {
    e.preventDefault()
    Update()
  }

  const usedata = datal => {
    setshow1(true)
    setform1(datal)
  }

  useEffect(() => {
    Get()
    GetRoles()
  }, [])

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = users.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(users.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const manageDelete = data => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      Delete(data)
    }
  }

  const Delete = datau => {
    var token = datas
    var remid = datau._id
    axios
      .delete(URLS.DeleteStaff + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
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

  const [dep, setdep] = useState([])

  useEffect(() => {
    Getalldep()
  }, [])

  const Getalldep = () => {
    var token = datas
    axios
      .post(
        URLS.GetDepartment,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          setdep(res.data.departments)
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }
  const [role, setrole] = useState([])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const Optionchangess = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  const GetRoles = () => {
    var token = datas
    axios
      .post(
        URLS.GetRole,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setrole(res.data.roles)
      })
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Staff" />
          <Row>
            <Col>
              {show == true ? (
                <Card className="p-4">
                  <Form
                    onSubmit={e => {
                      formsubmit(e)
                    }}
                  >
                    <h5 className="mb-3">Add New Staff</h5>
                    <Row>
                      <Col md="3">
                        <Label>Employee Name</Label>
                        <span className="text-danger">*</span>
                        <Input
                          onChange={e => {
                            handleChange(e)
                          }}
                          name="name"
                          value={form.name}
                          required
                          type="text"
                          placeholder="Enter Employee Name"
                        />
                      </Col>
                      <Col md="3">
                        <Label>Email Id</Label>
                        <span className="text-danger">*</span>
                        <Input
                          name="email"
                          onChange={e => {
                            handleChange(e)
                          }}
                          value={form.email}
                          required
                          type="email"
                          placeholder="Enter Email"
                        />
                      </Col>
                      <Col md="3">
                        <Label>Mobile No</Label>
                        <span className="text-danger">*</span>
                        <div className="input-group mb-3">
                          <Input
                            name="phone"
                            onChange={e => {
                              handleChange(e)
                            }}
                            value={form.phone}
                            required
                            type="text"
                            minLength="10"
                            maxLength="10"
                            pattern="[0-9]+"
                            className="form-control"
                            placeholder="Enter Mobile No"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onKeyPress={e => {
                              const charCode = e.which ? e.which : e.keyCode
                              if (charCode < 48 || charCode > 57) {
                                e.preventDefault()
                              }
                            }}
                          />
                        </div>
                      </Col>
                      <Col md="3">
                        <Label>Password</Label>
                        <span className="text-danger">*</span>
                        <Input
                          name="password"
                          onChange={e => {
                            handleChange(e)
                          }}
                          type="text"
                          value={form.password}
                          required
                          placeholder="Enter password"
                        />
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Employee Image
                          </Label>{" "}
                          <span className="text-danger">260 * 190</span>
                          <Input
                            type="file"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            required
                            name="profilepic"
                            value={Files.profilepic}
                            onChange={changeHandler}
                          />
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label> Department</Label>
                          <span className="text-danger">*</span>
                          <select
                            value={form.departmentId}
                            name="departmentId"
                            required
                            onChange={e => {
                              Optionchangess(e)
                            }}
                            className="form-select"
                          >
                            <option value="">Select</option>
                            {dep.map((data, key) => {
                              return (
                                <option key={key} value={data._id}>
                                  {data.departmentName}
                                </option>
                              )
                            })}
                          </select>
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label> Roles </Label>
                          <span className="text-danger">*</span>
                          <select
                            name="roleId"
                            onChange={e => {
                              handleChange(e)
                            }}
                            value={form.roleId}
                            required
                            className="form-select"
                          >
                            <option value="">Select</option>
                            {role.map((data, key) => {
                              return (
                                <option key={key} value={data._id}>
                                  {data.roleName}
                                </option>
                              )
                            })}
                          </select>
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label>Address</Label>
                          <span className="text-danger">*</span>
                          <textarea
                            onChange={e => {
                              handleChange(e)
                            }}
                            type="text"
                            name="address"
                            required
                            rows={1}
                            value={form.address}
                            placeholder="Enter Address"
                            className="form-control"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Button type="submit" color="success m-1" outline>
                        Submit <i className="bx bx-check-circle"></i>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setshow(!show)
                        }}
                        color="danger m-1"
                        outline
                      >
                        Cancel <i className="bx bx-x-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </Card>
              ) : (
                ""
              )}
              <Card>
                <CardBody>
                  <Row>
                  {Roles.staffAdd  || Roles?.accessAll === true ?<> 
                    <Col>
                      <Button
                        onClick={() => {
                          setshow(!show)
                        }}
                        color="primary"
                      >
                        New Staff <i className="bx bx-user-plus"></i>
                      </Button>
                    </Col></>:""}
                    
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
                        <tr>
                          <th>Sl.No</th>
                          <th>Employee Image</th>
                          <th>Employee Name</th>
                          <th>Email</th>
                          <th>Mobile No</th>
                          <th>Department</th>
                          <th>Role</th>
                          <th>Address</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((data, key) => (
                          <tr key={key}>
                            <th scope="row">
                              {(pageNumber - 1) * 5 + key + 6}
                            </th>
                            <td>
                              <img
                                src={URLS.Base + data.profilepic}
                                width="80px"
                              ></img>
                            </td>
                            <td>{data.name}</td>
                            <td>{data.email}</td>
                            <td>{data.phone}</td>
                            <td>{data.departmentName}</td>
                            <td>{data.roleName}</td>
                            <td>{data.address}</td>
                            <td>
                            {Roles.staffEdit  || Roles?.accessAll === true ?<>
                              <Button
                                onClick={() => {
                                  usedata(data)
                                }}
                                className="m-1 btn-sm"
                                color="success"
                                outline
                              >
                                <i className="bx bx-edit"></i>
                                
                              </Button>   </>:''}
                              {Roles.staffDelete  || Roles?.accessAll === true ?<>
                              <Button
                                className="m-1 btn-sm"
                                color="danger"
                                onClick={() => {
                                  manageDelete(data)
                                }}
                                outline
                              >
                                <i className="bx bx-trash"></i>
                                
                              </Button> </>:''}
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
      <Modal size="lg" isOpen={show1} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Edit Staff Details</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={e => {
              formeditsubmit(e)
            }}
          >
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <Label>Employee Name</Label>
                  <span className="text-danger">*</span>
                  <Input
                    name="name"
                    onChange={e => {
                      handleChange1(e)
                    }}
                    value={form1.name}
                    required
                    type="text"
                    placeholder="Enter Employee Name"
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label>Email Id</Label> <span className="text-danger">*</span>
                  <Input
                    name="email"
                    onChange={e => {
                      handleChange1(e)
                    }}
                    value={form1.email}
                    required
                    type="email"
                    placeholder="Enter Email"
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label>Mobile No</Label>
                  <span className="text-danger">*</span>
                  <div className="input-group mb-3">
                    <Input
                      name="phone"
                      onChange={e => {
                        handleChange1(e)
                      }}
                      value={form1.phone}
                      required
                      type="text"
                      minLength="10"
                      maxLength="10"
                      pattern="[0-9]+"
                      className="form-control"
                      placeholder="Enter Mobile No"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      onKeyPress={e => {
                        const charCode = e.which ? e.which : e.keyCode
                        if (charCode < 48 || charCode > 57) {
                          e.preventDefault()
                        }
                      }}
                    />
                  </div>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label for="basicpill-firstname-input1">Employee Image</Label>{" "}
                  <span className="text-danger">260 * 190</span>
                  <Input
                    type="file"
                    className="form-control"
                    id="basicpill-firstname-input1"
                    name="profilepic"
                    value={Files1.profilepic}
                    onChange={changeHandler1}
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label> Department</Label>
                  <span className="text-danger">*</span>
                  <select
                    value={form1.departmentId}
                    name="departmentId"
                    required
                    onChange={e => {
                      handleChange1(e)
                    }}
                    className="form-select"
                  >
                    <option value="">Select</option>
                    {dep.map((data, key) => {
                      return (
                        <option key={key} value={data._id}>
                          {data.departmentName}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label> Roles </Label> <span className="text-danger">*</span>
                  <select
                    name="roleId"
                    onChange={e => {
                      handleChange1(e)
                    }}
                    value={form1.roleId}
                    required
                    className="form-select"
                  >
                    <option value="">Select</option>
                    {role.map((data, key) => {
                      return (
                        <option key={key} value={data._id}>
                          {data.roleName}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label>Address</Label>
                  <span className="text-danger">*</span>
                  <textarea
                    onChange={e => {
                      handleChange1(e)
                    }}
                    type="text"
                    name="address"
                    required
                    rows={1}
                    value={form1.address}
                    placeholder="Enter Address"
                    className="form-control"
                  />
                </div>
              </Col>
            </Row>
            <div className="text-end mt-3">
              <Button type="submit" color="success m-1" outline>
                Submit <i className="bx bx-check-circle"></i>
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setshow1(!show1)
                }}
                color="danger m-1"
                outline
              >
                Cancel <i className="bx bx-x-circle"></i>
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default Staff
