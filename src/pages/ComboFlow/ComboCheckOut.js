import React, { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Weburls"
import axios from "axios"
import { useHistory } from "react-router-dom"
// import "bootstrap-icons/font/bootstrap-icons.css";
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  Modal,
  ModalBody,
  Row,
  Container,
  ModalFooter,
  ModalHeader,
} from "reactstrap"

const ComboBooking = () => {
  var gets = localStorage.getItem("authUser")
  var dataa = JSON.parse(gets)
  var datas = dataa.token
  var token = datas
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoading1, setIsLoading1] = useState(false)

  const GetTheatersData = () => {
    axios.post(URLS.GetAllTheaters, {}).then(res => {
      if (res.status === 200) {
        setIsLoading(false)
      }
    })
  }

  const history = useHistory()
  const [policys, setpolicys] = useState([])

  // 'https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatebookingforPayment'
  // const handleSubmit = e => {
  //   e.preventDefault()
  //   sessionStorage.setItem("userDetails", JSON.stringify(data))
  //  var payType=sessionStorage.getItem("payType");
  //  if(payType=="online")
  //  {
  //   addBooking()
  //  }
  //  else
  //  {
  //   cashBooking()
  //  }

  // }

  const handleSubmit = e => {
    e.preventDefault()
    sessionStorage.setItem("userDetails", JSON.stringify(data))
    var payType = sessionStorage.getItem("payType") || "cash"
    if (payType === "online") {
      addBooking()
    } else {
      cashBooking()
    }

    // Update transaction status with PUT request
    // axios
    //   .put(
    //     `https://api.carnivalcastle.com/v1/carnivalApi/web/booking/updatetransactionstatus/${sessionStorage.getItem(
    //       "bookingid"
    //     )}`
    //   )
    //   .then(response => {
    //     console.log("Transaction status updated:", response.data)
    //   })
    //   .catch(error => {
    //     console.error("Error updating transaction status:", error)
    //   })
  }

  useEffect(() => {
    GetTheatersData()
    GetPoliciesData() // this is the terms and conditions
  }, [])

  const handleClick = () => {
    history.push("/ComboPlans")
  }

  const GetPoliciesData = () => {
    axios.post(URLS.GetPolicies, {}, {}).then(res => {
      if (res.status === 200) {
        setpolicys(res.data.policy)
      }
    })
  }
  const mypaymenttypekey = sessionStorage.getItem("paymentkey")

  // const addBooking = async () => {
  //   setIsLoading1(true)
  //   const extrapersiontheater = sessionStorage.getItem(
  //     "extraAddedPersonsForTheatre"
  //   )
  //   const maxPeopletheater = sessionStorage.getItem("maxPeople")
  //   const options = {
  //     key: "rzp_test_HJG5Rtuy8Xh2NB",
  //     currency: "INR",
  //     name: "Carnival Castle",
  //     amount:
  //       mypaymenttypekey == "partialpayment"
  //         ? Number(sessionStorage.getItem("comboAdvancePayment")) * 100
  //         : sessionStorage.getItem("TotalPrice") * 100,
  //     description: "Carnival Castle Transaction",
  //     image: "https://carnivalcastle.com/static/images/logo-text.webp",
  //     handler: async response => {
  //       const token = localStorage.getItem("token")

  //       const dataArray = {
  //         totalPrice: sessionStorage.getItem("totalallprice"),
  //         subTotal: sessionStorage.getItem("subtotalallprice"),
  //         advancePayment: parseFloat(sessionStorage.getItem("comboAdvancePayment")), // comboAdvancePayment
  //         bookingId: sessionStorage.getItem("bookingid"),
  //         couponId: sessionStorage.getItem("coupon_Id"),
  //         couponAmount: sessionStorage.getItem("coupondis"),
  //         paymentType: "fullpayment",
  //         extraPersonPrice: sessionStorage.getItem("extraPersonprice"),
  //         transactionId: response.razorpay_payment_id,
  //         transactionStatus: "completed",
  //         status: "completed",
  //         cashType: "online",
  //       }
  //       if (extrapersiontheater > maxPeopletheater) {
  //         dataArray.extraPersonPrice = sessionStorage.getItem(
  //           "extraPersonperprice"
  //         )
  //       }

  //       try {
  //         const res = await axios.post(
  //           "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatebookingforPayment",
  //           dataArray,
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         )
  //         // if (res.status === 200) {
  //         //   toast(res.data.message);
  //         //    sessionStorage.clear();
  //         //   sessionStorage.setItem("invoicePath", res.data.invoicePath);
  //         //   sessionStorage.setItem("orderId", res.data.orderId);
  //         //     //  history.push("/thankyoupage");
  //         //     history.push("/PendingBookings");
  //         // }
  //         if (res.status === 200) {
  //           toast(res.data.message)
  //           window.location.href=res?.data?.data?.instrumentResponse?.redirectInfo?.url
  //           // sessionStorage.clear()
  //           // sessionStorage.setItem("invoicePath", res.data.invoicePath)
  //           // sessionStorage.setItem("orderId", res.data.orderId)
  //           // setTimeout(() => {
  //           //   history.push("/Confirmedbookings")
  //           // }, 2000)
  //           setIsLoading1(false)
  //         }
  //       } catch (error) {
  //         if (error.response && error.response.status === 400) {
  //           toast.error(error.response.data.message)
  //           // history.push("/payment-fail");
  //         } else if (error.response && error.response.status === 406) {
  //           toast.error(error.response.data.message)
  //           setTimeout(() => {
  //             history.push("/theaters")
  //           }, 2000)
  //         }
  //       }
  //     },
  //     prefill: {
  //       name: sessionStorage.getItem("name"),
  //       email: sessionStorage.getItem("email"),
  //       contact: sessionStorage.getItem("phone"),
  //     },
  //     notes: {
  //       address: "",
  //     },
  //     theme: {
  //       color: "#015A65",
  //     },
  //   }
  //   const rzp1 = new window.Razorpay(options)
  //   rzp1.open()
  // }

  const addBooking = async () => {
    setIsLoading1(true)
    const token = localStorage.getItem("token")
    const extrapersiontheater = parseFloat(sessionStorage.getItem( "countPeople"))
    const maxPeopletheater = parseFloat(sessionStorage.getItem("maxPeople"))
    const dataArray = {
      planOfferPrice: sessionStorage.getItem("planpricesss"),
      totalPrice: sessionStorage.getItem("totalallprice"),
      subTotal: sessionStorage.getItem("subtotalallprice"),
      advancePayment: parseFloat(sessionStorage.getItem("comboAdvancePayment")), // comboAdvancePayment
      bookingId: sessionStorage.getItem("bookingid"),
      couponId: sessionStorage.getItem("coupon_Id"),
      couponAmount: sessionStorage.getItem("coupondis"),
      // extraPersonPrice: sessionStorage.getItem("extraPersonperprice"),
      extraAddedPersonsForTheatre: sessionStorage.getItem(
        "countPeople"
      ),
      // paymentType:sessionStorage.getItem("advancePayment"),
      transactionId: "",
      transactionStatus: "completed",
      status: "completed",
      cashType: "online",
      paymentType: "fullpayment",
      create_type: "admin",
    }
    // dataArray.extraPersonPrice = sessionStorage.getItem("planextrapersoncharge") || 0;

    if (extrapersiontheater > maxPeopletheater) {
      dataArray.extraPersonPrice = sessionStorage.getItem("planextrapersoncharge") || 0
    }
    try {
      const res = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatebookingforPayment",
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.status === 200) {
        toast(res.data.message)
        // history.push("/thankyoupage");
        // setIsLoading1(false)
        // history.push("/Confirmedbookings")
        window.location.href =
          res?.data?.data?.instrumentResponse?.redirectInfo?.url
        // sessionStorage.clear();
        // sessionStorage.setItem("invoicePath", res.data.invoicePath)
        // sessionStorage.setItem("orderId", res.data.orderId)
        // sessionStorage.setItem("bookingId", res?.data?.paymentSave?.bookingId);
      } else if (res.status === 403) {
        toast.error(
          "Access Denied: You do not have permission to view this page."
        )
        history.push("/theaters")
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast(error.response.data.message)
      }
    }
  }
  
  const cashBooking = async () => {
    setIsLoading1(true)
    const token = localStorage.getItem("token")
    const extrapersiontheater = parseFloat(sessionStorage.getItem("countPeople"))
    const maxPeopletheater = parseFloat(sessionStorage.getItem("maxPeople"))
    const dataArray = {
      planOfferPrice: sessionStorage.getItem("planpricesss"),
      totalPrice: sessionStorage.getItem("totalallprice"),
      subTotal: sessionStorage.getItem("subtotalallprice"),
      advancePayment: parseFloat(sessionStorage.getItem("comboAdvancePayment")), // comboAdvancePayment
      bookingId: sessionStorage.getItem("bookingid"),
      couponId: sessionStorage.getItem("coupon_Id"),
      couponAmount: sessionStorage.getItem("coupondis"),
      // extraPersonPrice: sessionStorage.getItem("extraPersonperprice"),
      extraAddedPersonsForTheatre: sessionStorage.getItem(
        "extraAddedPersonsForTheatre"
      ),
      // paymentType:sessionStorage.getItem("advancePayment"),
      transactionId: "",
      transactionStatus: "completed",
      status: "completed",
      cashType: "cash",
      paymentType: "fullpayment",
      create_type: "admin",
    }
    if (extrapersiontheater > maxPeopletheater) {
      dataArray.extraPersonPrice = sessionStorage.getItem("planextrapersoncharge") || 0
    }
    try {
      const res = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatebookingforPayment",
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.status === 200) {
        toast(res.data.message)
        // history.push("/thankyoupage");
        setIsLoading1(false)
        history.push("/Confirmedbookings")

        // sessionStorage.clear();
        sessionStorage.setItem("invoicePath", res.data.invoicePath)
        sessionStorage.setItem("orderId", res.data.orderId)
        // sessionStorage.setItem("bookingId", res?.data?.paymentSave?.bookingId);
      } else if (res.status === 403) {
        toast.error(
          "Access Denied: You do not have permission to view this page."
        )
        history.push("/theaters")
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast(error.response.data.message)
      }
    }
  }

  const [isAgreed, setIsAgreed] = useState(false) //  agree

  const handleAgree = event => {
    if (event.target.checked) {
      setIsAgreed(true)
    } else {
      setIsAgreed(false)
      toast.error("You must agree to the terms and conditions to proceed.")
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Terms and Conditions"
          />
          <Row>
            <>
              {isLoading === true ? (
                <div
                  className="text-center"
                  style={{
                    // background:
                    //   "linear-gradient(329deg, rgba(191, 63, 249, 1) 0%, rgba(113, 51, 210, 1) 100%)",
                    backgroundColor: "var(--charcoal-black)",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    {/* <img
              src="assets/img/gipss.gif"
              style={{ height: "300px" }}
              alt="Loading"
            /> */}
                    <h6 style={{ color: "white" }}>Loading...</h6>
                  </div>
                </div>
              ) : (
                <div className="home-page indexsix">
                  <main className="main-wrapper">
                    <section
                      id="parallax"
                      className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
                    >
                      <div className="container"></div>
                    </section>
                    <section className="shop-area p-relative ">
                      <div className="container mx-auto p-4">
                        <button
                          type="button"
                          className="btn mb-3 bg-primary"
                          onClick={handleClick}
                          style={{
                            boxShadow: "none",
                            color: "black",
                            border: "none",
                          }}
                        >
                          <i className="far fa-arrow-alt-circle-left"></i> Back
                        </button>

                        <div className="row">
                          <div className="col-12 ">
                            <div
                              className="shadow-lg p-4 d-flex flex-column"
                              style={{ height: "700px" }}
                            >
                              <div
                                className="mt-2 flex-grow-1"
                                style={{
                                  overflowY: "auto",
                                  paddingRight: "10px",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: policys.termsAndCondition,
                                }}
                              ></div>

                              <div className="mt-auto text-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input me-2"
                                  id="agreeCheckbox"
                                  onChange={handleAgree}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="agreeCheckbox"
                                >
                                  I agree to all the above conditions.
                                </label>
                              </div>

                              <div className="d-flex justify-content-end mt-3">
                                {isLoading1 == true ? (
                                  <button
                                    className="btn bg-primary"
                                    style={{
                                      boxShadow: "none",
                                      color: "black",
                                      border: "none",
                                    }}
                                    disabled
                                  >
                                    Your Booking Processing...
                                  </button>
                                ) : (
                                  <button
                                    className="btn bg-primary"
                                    style={{
                                      boxShadow: "none",
                                      color: "black",
                                      border: "none",
                                    }}
                                    onClick={handleSubmit}
                                    disabled={!isAgreed}
                                  >
                                    Confirm & Pay Advance
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </main>
                  <ToastContainer />
                </div>
              )}
            </>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ComboBooking
