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
import Select from "react-select"

const Banner = () => {
  const [modal_small, setmodal_small] = useState(false)
  const [banner, setbanner] = useState([])
  const [productname, setproductname] = useState([])
  const [productname1, setproductname1] = useState([])
  const [form, setform] = useState({
    categoryId: "",
    name: "",
    type: "",
    price: "",
    occasionId: "",
    cakeType: "",
    cakePremiumOrNormal: "",
  })
  const [form1, setform1] = useState([])
  const [show, setshow] = useState(false)
  const [Files, setFiles] = useState("")
  const [Files1, setFiles1] = useState("")

  const [selectedOptions, setSelectedOptions] = useState([])
  const [selectedOptions1, setSelectedOptions1] = useState([])

  const [Occasions, setOccasions] = useState([])

  const multis = selectedOptions => {
    setSelectedOptions(selectedOptions)
  }

  const multis1 = selectedOptions1 => {
    setSelectedOptions1(selectedOptions1)
  }

  const options = Occasions.map(response => ({
    value: response._id,
    label: response.name,
  }))

  useEffect(() => {
    GetOcation()
  }, [])

  const GetOcation = () => {
    var token = datas
    axios
      .post(
        URLS.GetService,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setOccasions(res.data.occasions)
      })
  }

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
    dataArray.append("categoryId", form.categoryId)
    dataArray.append("name", form.name)
    dataArray.append("type", form.type)
    dataArray.append("price", form.price)
    if (productname.name === "cakes") {
      dataArray.append("cakeType", form.cakeType)
      dataArray.append("cakePremiumOrNormal", form.cakePremiumOrNormal)
    } else {
    }

    dataArray.append("occasionId", JSON.stringify(selectedOptions))
    for (let i = 0; i < Files.length; i++) {
      dataArray.append("image", Files[i])
    }
    axios
      .post(URLS.AddProducts, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllBanners()
            clearForm()
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

  const EditBanner = () => {
    var token = datas
    var formid = form1._id
    const dataArray = new FormData()
    dataArray.append("categoryId", form1.categoryId)
    dataArray.append("name", form1.name)
    dataArray.append("type", form1.type)
    dataArray.append("price", form1.price)
    if (productname1.name === "cakes") {
      dataArray.append("cakeType", form1.cakeType)
      dataArray.append("cakePremiumOrNormal", form1.cakePremiumOrNormal)
    } else {
    }

    dataArray.append("occasionId", JSON.stringify(selectedOptions1))
    for (let i = 0; i < Files1.length; i++) {
      dataArray.append("image", Files1[i])
    }
    axios
      .put(URLS.UpdateProducts + formid, dataArray, {
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
      .delete(URLS.DeleteProducts + remid, {
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
        URLS.GetProducts,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setbanner(res.data.products)
      })
  }

  const clearForm1 = () => {
    setFiles1({
      image: "",
    })
  }

  const clearForm = () => {
    setform({
      categoryId: "",
      name: "",
      type: "",
      price: "",
      occasionId: "",
      cakeType: "",
      cakePremiumOrNormal: "",
    })
    setFiles({
      image: "",
    })
    setSelectedOptions("")
  }

  const getpopup = data => {
    setform1(data)
    setSelectedOptions1(data.occasionId)
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
        URLS.GetProductsSearch + `${e.target.value}`,
        {},

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setbanner(res.data.products)
      })
  }
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)

  const [Category, setCategory] = useState([])

  useEffect(() => {
    GetProducts()
  }, [])

  const GetProducts = () => {
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
        setCategory(res.data.categorys)
      })
  }

  //  adding the categoryFunctions
  const handleCategoryChange = e => {
    handleChange(e)
    const selectedOption = Category.find(
      option => option._id === e.target.value
    )
    console.log(e.target.name, "e.target.value")
    console.log(selectedOption, "selectedOption")
    setproductname(selectedOption)
    if (selectedOption) {
      if (selectedOption.name === "cakes") {
        setform(prevForm => ({
          ...prevForm,
          categoryId: e.target.value,
          cakesFilds: true,
          dropdown: true,
          increment: false,
        }))
      } else if (
        selectedOption.name === "roses" ||
        selectedOption.name === "Photography"
      ) {
        setform1(prevForm => ({
          ...prevForm,
          categoryId: e.target.value,
          cakeType: "",
          cakePremiumOrNormal: "",
          cakesFilds: false,
          dropdown: false,
          increment: false,
        }))
      } else {
        setform(prevForm => ({
          ...prevForm,
          categoryId: e.target.value,
          cakeType: "",
          cakePremiumOrNormal: "",
          cakesFilds: false,
          dropdown: false,
          increment: true,
        }))
      }
    }
  }

  const handleCategoryUpdateChange = e => {
    console.log(e.target.name, "e.target.value")

    const selectedOptions1 = Category.find(
      option => option._id === e.target.value
    )
    console.log(selectedOptions1, "selectedOptions1")
    setproductname1(selectedOptions1)
    if (selectedOptions1) {
      if (selectedOptions1.name === "cakes") {
        setform1(prevForm => ({
          ...prevForm,
          categoryId: e.target.value,
          cakesFilds: true,
          dropdown: true,
          increment: false,
        }))
      } else if (
        selectedOptions1.name === "roses" ||
        selectedOptions1.name === "Photography"
      ) {
        setform1(prevForm => ({
          ...prevForm,
          categoryId: e.target.value,
          cakeType: "",
          cakePremiumOrNormal: "",
          cakesFilds: false,
          dropdown: false,
          increment: false,
        }))
      } else {
        setform1(prevForm => ({
          ...prevForm,
          categoryId: e.target.value,
          cakeType: "",
          cakePremiumOrNormal: "",
          cakesFilds: false,
          dropdown: false,
          increment: true,
        }))
      }
    }
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0]

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Products"
          />
          <Row>
            {show == true ? (
              <Col md={12}>
                <Card>
                  <CardHeader className="bg-white">
                    <CardTitle>Add Product</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form
                      onSubmit={e => {
                        handleSubmit(e)
                      }}
                    >
                      <Row>
                        <Col md="4">
                          <div className="mb-3 ">
                            <Label for="basicpill-firstname-input1">
                              Occasion Name
                              <span className="text-danger">*</span>
                            </Label>
                            <Select
                              options={options}
                              placeholder="Enter Occasion Name"
                              value={selectedOptions}
                              onChange={multis}
                              isSearchable={true}
                              isMulti
                            />
                          </div>{" "}
                        </Col>
                        <Col md="4">
                          <div className="mb-3">
                            <Label>Category</Label>
                            <span className="text-danger">*</span>
                            <select
                              value={form.categoryId}
                              name="categoryId"
                              required
                              onChange={handleCategoryChange}
                              className="form-select"
                            >
                              <option value="">Select</option>
                              {Category.map((data, key) => {
                                return (
                                  <option key={key} value={data._id}>
                                    {data.name}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                        </Col>
                        <Col md={4}>
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
                        </Col>
                        <Col md={4}>
                          <div className="mb-3">
                            <Label for="basicpill-firstname-input1">
                              Image <span className="text-danger">*</span>
                              <span className="text-danger">298*180</span>
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
                        </Col>

                        {form.cakesFilds && (
                          <>
                            <Col md="4">
                              <div className="mb-3">
                                <Label>Cake Type</Label>
                                <select
                                  value={form.cakeType}
                                  name="cakeType"
                                  required
                                  onChange={e => handleChange(e)}
                                  className="form-select"
                                >
                                  <option value="">Select</option>
                                  <option value="egg">Egg</option>
                                  <option value="eggless">Egg Less</option>
                                </select>
                              </div>
                            </Col>
                            <Col md="4">
                              <div className="mb-3">
                                <Label>Is Premium</Label>
                                <select
                                  value={form.cakePremiumOrNormal}
                                  name="cakePremiumOrNormal"
                                  required
                                  onChange={e => handleChange(e)}
                                  className="form-select"
                                >
                                  <option value="">Select</option>
                                  <option value="premium">Premium</option>
                                  <option value="normal">Normal</option>
                                </select>
                              </div>
                            </Col>
                          </>
                        )}

                        <Col md="4">
                          <div className="mb-3">
                            <Label>Type</Label>
                            <span className="text-danger">*</span>
                            <select
                              value={form.type}
                              name="type"
                              required
                              onChange={e => {
                                handleChange(e)
                              }}
                              className="form-select"
                            >
                              <option value="">Select</option>
                              <option value="quantity">Quantity</option>
                              <option value="grams">Grams</option>
                            </select>
                          </div>
                        </Col>
                        {form.type == "quantity" ? (
                          <>
                            <Col md={4}>
                              <div className="mb-3">
                                <Label for="basicpill-firstname-input1">
                                  Price
                                  <span className="text-danger">
                                    <small>
                                      (Price will be applied Per Pice)
                                    </small>
                                    *
                                  </span>
                                </Label>
                                <Input
                                  type="number"
                                  className="form-control"
                                  id="basicpill-firstname-input1"
                                  placeholder="Enter Price"
                                  required
                                  name="price"
                                  value={form.price}
                                  onChange={e => {
                                    handleChange(e)
                                  }}
                                />
                              </div>
                            </Col>
                          </>
                        ) : (
                          <>
                            <Col md={4}>
                              <div className="mb-3">
                                <Label for="basicpill-firstname-input1">
                                  Price
                                  <span className="text-danger">
                                    <small>
                                      (Price will be applied in 500 grams)
                                    </small>
                                    *
                                  </span>
                                </Label>
                                <Input
                                  type="number"
                                  className="form-control"
                                  id="basicpill-firstname-input1"
                                  placeholder="Enter Price"
                                  required
                                  name="price"
                                  value={form.price}
                                  onChange={e => {
                                    handleChange(e)
                                  }}
                                />
                              </div>
                            </Col>
                          </>
                        )}
                        <Col md={12}>
                          <div style={{ float: "right" }}>
                            <Button color="primary" type="submit">
                              Submit <i className="fas fa-check-circle"></i>
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            ) : (
              ""
            )}
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Product List</CardTitle>
                </CardHeader>
                <CardBody>
                  <div>
                    <Row>
                      {Roles.productsAdd || Roles?.accessAll === true ? (
                        <>
                          <Col>
                            <Button
                              onClick={() => {
                                setshow(!show)
                              }}
                              color="primary"
                            >
                              Add Products List<i className="bx bx-plus"></i>
                            </Button>
                          </Col>
                        </>
                      ) : (
                        ""
                      )}
                      <Col>
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
                      </Col>
                    </Row>
                    <div className="table-responsive">
                      <Table className="table table-bordered mb-4 mt-5">
                        <thead>
                          <tr className="text-center">
                            <th>S.No</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category Name</th>
                            <th>Type</th>
                            <th>Cake Type</th>
                            <th>IsPremium</th>
                            <th>Price</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.map((data, key) => (
                            <tr key={key} className="text-center">
                              <td>{(pageNumber - 1) * 5 + key + 6}</td>
                              <td>
                                <img
                                  style={{ width: "100px" }}
                                  src={URLS.Base + data.image}
                                />
                              </td>
                              <td>{data.name}</td>
                              <td>{data.categoryName}</td>
                              <td>{data.type}</td>
                              <td>{data.cakeType}</td>
                              <td>{data.cakePremiumOrNormal}</td>
                              <td>{data.price} /-</td>
                              <td>
                                {Roles.productsEdit ||
                                Roles?.accessAll === true ? (
                                  <>
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
                                    </Button>{" "}
                                  </>
                                ) : (
                                  ""
                                )}
                                {Roles.productsDelete ||
                                Roles?.accessAll === true ? (
                                  <>
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
          size="lg"
          isOpen={modal_small}
          toggle={() => {
            tog_small()
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              Edit Product
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
                <Col md="6">
                  <div className="mb-3 ">
                    <Label for="basicpill-firstname-input1">
                      Occasion Name
                      <span className="text-danger">*</span>
                    </Label>
                    <Select
                      options={options}
                      placeholder="Enter Occasion Name"
                      value={selectedOptions1}
                      onChange={multis1}
                      isSearchable={true}
                      isMulti
                    />
                  </div>{" "}
                </Col>
                <Col md={6}>
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
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Image <span className="text-danger">*</span>
                      <span className="text-danger">298*180</span>
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
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <Label>Category</Label>
                    <span className="text-danger">*</span>
                    <select
                      value={form1.categoryId}
                      name="categoryId"
                      required
                      onChange={e => {
                        handleCategoryUpdateChange(e)
                      }}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      {Category.map((data, key) => {
                        return (
                          <option key={key} value={data._id}>
                            {data.name}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <Label>Type</Label>
                    <span className="text-danger">*</span>
                    <select
                      value={form1.type}
                      name="type"
                      required
                      onChange={e => {
                        handleChange1(e)
                      }}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option value="quantity">Quantity</option>
                      <option value="grams">Grams</option>
                    </select>
                  </div>
                </Col>
                {form1.cakesFilds && (
                  <>
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Cake Type</Label>
                        <select
                          value={form1.cakeType}
                          name="cakeType"
                          required
                          onChange={e => handleChange1(e)}
                          className="form-select"
                        >
                          <option value="">Select</option>
                          <option value="egg">Egg</option>
                          <option value="eggless">Egg Less</option>
                        </select>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Is Premium</Label>
                        <select
                          value={form1.cakePremiumOrNormal}
                          name="cakePremiumOrNormal"
                          required
                          onChange={e => handleChange1(e)}
                          className="form-select"
                        >
                          <option value="">Select</option>
                          <option value="premium">Premium</option>
                          <option value="normal">Normal</option>
                        </select>
                      </div>
                    </Col>
                  </>
                )}

                {form1.type == "quantity" ? (
                  <>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label for="basicpill-firstname-input1">
                          Price
                          <span className="text-danger">
                            <small>(Price will be applied in 1 Pice)</small>*
                          </span>
                        </Label>
                        <Input
                          type="number"
                          className="form-control"
                          id="basicpill-firstname-input1"
                          placeholder="Enter Price"
                          required
                          name="price"
                          value={form1.price}
                          onChange={e => {
                            handleChange1(e)
                          }}
                        />
                      </div>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label for="basicpill-firstname-input1">
                          Price
                          <span className="text-danger">
                            <small>(Price will be applied in 500 grams)</small>*
                          </span>
                        </Label>
                        <Input
                          type="number"
                          className="form-control"
                          id="basicpill-firstname-input1"
                          placeholder="Enter Price"
                          required
                          name="price"
                          value={form1.price}
                          onChange={e => {
                            handleChange1(e)
                          }}
                        />
                      </div>
                    </Col>
                  </>
                )}
              </Row>
              <hr></hr>
              <Row>
                <Col md={12}>
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
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Banner
