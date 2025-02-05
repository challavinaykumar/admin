import React, { useState, useEffect } from "react"
import { CardBody, Container, Row, Col, Card, Button } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useHistory } from "react-router-dom"
import { URLS } from "../../Url"
import axios from "axios"

function RecruitView() {
  const history = useHistory()
  const [form, setform] = useState([])

  const [Image, setImage] = useState([])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  useEffect(() => {
    GetTheater()
  }, [])

  const Theaterid = sessionStorage.getItem("Theaterid")

  const GetTheater = () => {
    const data = {
      id: Theaterid,
    }

    var token = datas
    axios
      .post(URLS.GetOneTheater, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setform(res.data.theatre)
        setImage(res.data.theatre.image)
      })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="View Theater"
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
            </Col>
          </Row>
          <Card>
            <CardBody className="mt-3 mb-3">
              <Row>
                <Col lg={4}>
                  <h5 className="mb-3 text-primary">Theater Details : </h5>
                  <ul className="list-unstyled vstack gap-3 mb-0">
                    <img
                      src={URLS.Base + Image}
                      style={{ borderRadius: "20px", height: "300px" }}
                    ></img>
                  </ul>
                </Col>

                <Col xl="4" className="mt-3">
                  <div className="mt-4 mt-xl-3">
                    <h4 className="mt-1 mb-3">{form.name}</h4>
                    <h5 className="mb-4">
                      Price :{" "}
                      <span className="text-muted me-2">
                        <del>{form.price} </del>
                      </span>{" "}
                      <b>Rs : {form.offerPrice} /-</b>
                    </h5>
                    <p className="text-muted mb-4">{form.description}</p>
                    <p className="text-muted">
                      <i className="bx bxs-user font-size-16 align-middle text-primary me-2" />
                      Max People : {form.maxPeople}
                    </p>

                    <p className="text-muted ">
                      <i className="bx bx-handicap font-size-16 align-middle text-primary me-2" />
                      Max Seating : {form.maxSeating}
                    </p>

                    <p className="text-muted">
                      <i className="bx bxs-group font-size-16 align-middle text-primary me-2" />
                      Extra Person : {form.extraPerson}
                    </p>

                    <p className="text-muted">
                      <i className="bx bxs-badge-check font-size-16 align-middle text-primary me-2" />
                      Extra Person Cost : {form.extraPersonprice} /-
                    </p>
                    <p className="text-muted">
                      <i className="bx bx-time font-size-16 align-middle text-primary me-2" />
                      <span>
                        One and Half Hour:{" "}
                        {form.oneandhalfslotPrice
                          ? `${form.oneandhalfslotPrice} /-`
                          : "0 /-"}
                      </span>
                    </p>
                  </div>
                </Col>
                <Col md="4" className="mt-4">
                  <h5 className="mb-3 text-primary">Features : </h5>
                  {form.features &&
                    form.features.map((item, i) => (
                      <div key={i}>
                        <p className="text-muted">
                          <i className="fa fa-caret-right font-size-16 align-middle text-primary me-2" />
                          {item}
                        </p>
                      </div>
                    ))}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default RecruitView
