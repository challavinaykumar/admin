import React, { useState, useEffect } from "react"
import { Row, Col, Card, CardBody, Input, Button, Table } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { Link, useHistory } from "react-router-dom"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"
import axios from "axios"

function Ventures() {
  const [Actin, setActin] = useState([])

  const history = useHistory()

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token
  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(() => {
    GetProducts()
    datass()
  }, [])

  const GetProducts = () => {
    var token = datas

    axios
      .post(
        URLS.GetTheater,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setActin(res.data.theatres)
      })
  }

  const pagesVisited = pageNumber * listPerPage
  const lists = Actin.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(Actin.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const Actinid = data => {
    sessionStorage.setItem("Theaterid", data._id)
    history.push("/EditTheater")
  }

  const Actinid1 = data => {
    sessionStorage.setItem("Theaterid", data._id)
    history.push("/ViewTheater")
  }

  const datass = () => {
    const location = sessionStorage.getItem("tost")
    if (location != "") {
      toast(location)
      sessionStorage.clear()
    } else {
      sessionStorage.clear()
    }
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)

  const [Searchs, setSearchs] = useState([])

  const Search = e => {
    let myUser = { ...Searchs }
    myUser[e.target.name] = e.target.value
    setSearchs(myUser)
    var token = datas

    axios
      .post(
        URLS.GetTheaterSearch + `${e.target.value}`,
        {},

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setActin(res.data.theatres)
      })
  }

  const manageDelete = data => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      DeleteBanner(data)
    }
  }
  const DeleteBanner = data => {
    var token = datas
    var remid = data._id
    axios
      .delete(URLS.DeleteTheater + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetProducts()
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
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Theater list"
          />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row>
                  {Roles.theatreListAdd  || Roles?.accessAll === true ?<> 
                    <Col>
                      <Link to="/AddTheater">
                        <Button color="primary">
                          New Theater <i className="bx bx-plus-circle"></i>
                        </Button>
                      </Link>
                    </Col></>:""}
                    <Col>
                      <div style={{ float: "right" }}>
                        <Input
                          type="search"
                          name="search"
                          value={Searchs.search}
                          onChange={Search}
                          className="form-control"
                          placeholder="Search.."
                          autoComplete="off"
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover className="table table-bordered mb-4 ">
                      <thead>
                        <tr className="text-center">
                          <th>SlNo</th>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Batch Type</th>
                          <th>Max People</th>
                          <th>Price</th>
                          <th>Offer Price</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((data, key) => (
                          <tr key={key} className="text-center">
                            <td>{(pageNumber - 1) * 5 + key + 6}</td>
                            <td>
                              <img
                                // src={URLS.Base + data?.image[0]}
                                src={URLS.Base + data?.image}
                                style={{ width: "80px" }}
                              />
                            </td>
                            <td>{data.name}</td>
                            <td>{data.batchType}</td>
                            <td>{data.maxPeople}</td>
                            <td>{data.price}</td>
                            <td>{data.offerPrice}</td>
                            <td>
                            {Roles.theatreListEdit  || Roles?.accessAll === true ?<>
                              <Button
                                onClick={() => {
                                  Actinid(data)
                                }}
                                style={{
                                  padding: "6px",
                                  margin: "3px",
                                }}
                                size="sm"
                                className="m-1"
                                outline
                                color="success"
                              >
                                <i className="bx bx-edit"></i>
                              </Button>    </>:''}
                              {Roles.theatreListView  || Roles?.accessAll === true ?<>
                              <Button
                                onClick={() => {
                                  Actinid1(data)
                                }}
                                style={{
                                  padding: "6px",
                                  margin: "3px",
                                }}
                                size="sm"
                                className="m-1"
                                outline
                                color="info"
                              >
                                <i className="fas fa-eye"></i>
                              </Button> </>:''}
                              {Roles.theatreListDelete  || Roles?.accessAll === true ?<>
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
                              </Button></>:''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
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
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <ToastContainer />
        </div>
      </div>
    </React.Fragment>
  )
}

export default Ventures
