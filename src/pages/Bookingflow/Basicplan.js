import React, { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { ToastContainer, toast } from "react-toastify"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { URLS } from "../../Weburls"
import axios from "axios"
// import "bootstrap-icons/font/bootstrap-icons.css";
import { useHistory } from "react-router-dom"
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  Modal,
  ModalBody,
  Row,
  Container,
  ModalFooter,
  ModalHeader,
} from "reactstrap"

const BookingForm = () => {
  var gets = localStorage.getItem("authUser")
  var data123 = JSON.parse(gets)
  var datas = data123.token
  var token = datas

  const [totalPrice, setTotalPrice] = useState(
    Number(sessionStorage.getItem("TotalPrice")) || 0
  );
  const [data, setData] = useState(
    JSON.parse(sessionStorage.getItem("data")) || []
  );

  console.log(data);
  const [isLoading, setIsLoading] = useState(true);
  const [couponData, setCouponData] = useState([]);
  console.log(couponData);
  const [addons, setAddons] = useState(
    JSON.parse(sessionStorage.getItem("adonsJSON")) || []
  );
  console.log(addons);

  const [people, setPeople] = useState(sessionStorage.getItem("maxPeople") || 0);

  const theatermaxseats = Number(sessionStorage.getItem("theatermaxSeating"));

  const [price, setPrice] = useState(0);
  console.log(price);

  const GetTheatersData = () => {
    axios.post(URLS.GetAllTheaters, {}).then((res) => {
      if (res.status === 200) {
        setIsLoading(false);
      }
    });
  };

  const GetUniqueId = () => {
    axios.post(URLS.GetUnicId).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
      }
    });
  };

  const handleCouponChange = (e) => {
    setCouponData({ ...couponData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Update the state based on the window width when the component mounts
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768); // Open if width is greater than 768px
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [discountprice, setdiscountprice] = useState(0);
  const add1 = async () => {
    const dataArray = {
      couponId: couponData.couponCode,
    };

    try {
      const res = await axios.post(URLS.GetCheckCoupon, dataArray);
      if (res.status === 200) {
        toast(res.data.message);
        sessionStorage.setItem("coupon_Id", res.data.coupon_Id);
        const couponAmount = Number(res.data.couponAmount);
        const amount = Number(sessionStorage.getItem("subtotal"));
        const TotalPrice = parseFloat(sessionStorage.getItem("TotalPrice"));
        console.log(TotalPrice, "TotalPrice");
        console.log(res.data.couponAmount, "res.data.couponAmount");
        var discountAmount;
        if (res.data.couponCodeType === "Percentage") {
          discountAmount = amount * (res.data.couponAmount / 100);
        } else {
          discountAmount = res.data.couponAmount;
        }
        sessionStorage.setItem("couponAmount", discountAmount);
        var tamount = amount - discountAmount;
        sessionStorage.setItem("Couponbutton", true);
        sessionStorage.setItem("CouponData", JSON.stringify(res.data));
        setdiscountprice(discountAmount);
        sessionStorage.setItem("coupondis", discountAmount);
        sessionStorage.setItem("TotalPrice", tamount);
        setTotalPrice(tamount); // Update state
        console.log(res.data, "couponData");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast(error.response.data.message);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (data.decoration === "No") {
    //   navigate("/BookingSummary");
    //   return;
    // }
    const dataArray = {
      userName: data.userName,
      userEmail: data.userEmail,
      userPhone: data.userPhone,
      noOfPersons: data.noOfPersons,
      decoration: data.decoration,
      subTotal: sessionStorage.getItem("subtotal"),
      theatreId: sessionStorage.getItem("theaterId"),
      bookingId: sessionStorage.getItem("bookingid"),
      time: sessionStorage.getItem("slot"),
      date: sessionStorage.getItem("date"),
      theaterName: sessionStorage.getItem("theaterName"),
      type: sessionStorage.getItem("planType"),
    };

    // const token = sessionStorage.getItem("token");
    axios
      .post(
        // "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/addbooking",
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/newadmin/addbooking",
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        GetUniqueId();
        console.log(res.data);
        history.push("/occations")
        sessionStorage.setItem("userDetails", JSON.stringify(data));
        sessionStorage.setItem("bookingid", res.data.bookingId);
        sessionStorage.setItem("countPeople", data.noOfPersons);
        sessionStorage.setItem("adonsJSON", JSON.stringify([]));
        sessionStorage.setItem("data", JSON.stringify(data));
      });
  };

  const handleChange = (e) => {
    let myUser = { ...data };
    myUser[e.target.name] = e.target.value;
    console.log(myUser.noOfPersons);
    sessionStorage.setItem("extraAddedPersonsForTheatre", myUser.noOfPersons);
    setData(myUser);
    // const extraPrice = (myUser.noOfPersons - people) * sessionStorage.getItem("extraPersonprice")
    // console.log(extraPrice)

    // if (Number(myUser.noOfPersons > people)) {
    //   const extraPersonPrice = Number(sessionStorage.getItem("extraPersonprice"));
    //   const extraPrice = (Number(myUser.noOfPersons) - people) * extraPersonPrice;
    //   setPrice(extraPrice);
    // } else {
    //  console.log("2 less ")
    //  const extraPrice = 0
    //  setPrice(extraPrice);
    // }

    // Calculate the extra price if the number of persons exceeds 'people'

    if (Number(myUser.noOfPersons) > people) {
      const extraPersonPrice = parseFloat( sessionStorage.getItem("extraPersonprice") || 0);
      console.log(extraPersonPrice)
      const extraPrice =  (parseFloat(myUser.noOfPersons) - parseFloat(people)) * parseFloat(extraPersonPrice);
      sessionStorage.setItem("extraPersonperprice", parseFloat(extraPrice));
      setPrice(extraPrice);
      console.log(extraPrice)
      sessionStorage.setItem(
        "TotalPrice",
        parseFloat(sessionStorage.getItem("theatrePrices") || 0) + parseFloat(extraPrice) +  parseFloat(sessionStorage.getItem("occprice") || 0) + parseFloat(sessionStorage.getItem("cakeprice") || 0) + parseFloat(sessionStorage.getItem("addons") || 0) -  parseFloat(sessionStorage.getItem("coupondis")) || parseFloat(discountprice)
      );

      sessionStorage.setItem(
        "theaterPrice",
        parseFloat(sessionStorage.getItem("theatrePrices")) + parseFloat(extraPrice)
      );

      sessionStorage.setItem(
        "subtotal",
        parseFloat(sessionStorage.getItem("theatrePrices")) +
          parseFloat(extraPrice) +
          parseFloat(sessionStorage.getItem("occprice") || 0) +
          parseFloat(sessionStorage.getItem("cakeprice") || 0) +
          parseFloat(sessionStorage.getItem("addons") || 0)
      );
    } else {
      setPrice(0);
      sessionStorage.setItem(
        "extraPersonperprice",
        sessionStorage.getItem("extraPersonprice")
      );
      sessionStorage.setItem(
        "TotalPrice",
        parseFloat(sessionStorage.getItem("theatrePrices")) +
          0 +
          parseFloat(sessionStorage.getItem("occprice") || 0) +
          parseFloat(sessionStorage.getItem("cakeprice") || 0) +
          parseFloat(sessionStorage.getItem("addons") || 0) -
          parseFloat(sessionStorage.getItem("coupondis")) ||
          parseFloat(discountprice)
      );
      sessionStorage.setItem(
        "theaterPrice",
        parseFloat(sessionStorage.getItem("theatrePrices")) + 0
      );
      // sessionStorage.setItem("extraPersonprice", sessionStorage.getItem("extraPersonprice"))
      sessionStorage.setItem(
        "subtotal",
        parseFloat(sessionStorage.getItem("theatrePrices")) +
          0 +
          parseFloat(sessionStorage.getItem("occprice") || 0) +
          parseFloat(sessionStorage.getItem("cakeprice") || 0) +
          parseFloat(sessionStorage.getItem("addons") || 0)
      );
    }

    // Navigate to Booking Summary if 'No' is selected for decoration
    // if (e.target.name === "decoration" && e.target.value === "No") {
    //   navigate("/BookingSummary");
    // }
  };

  const SubTotaluserprice = (parseFloat(sessionStorage.getItem("theaterPrice") || 0) + parseFloat(sessionStorage.getItem("occprice") || 0) + parseFloat(sessionStorage.getItem("addons") || 0) + (parseFloat(sessionStorage.getItem("cakeprice")) || 0)).toFixed(2);
  const Totaluserprice = (parseFloat(sessionStorage.getItem("theaterPrice") || 0) + parseFloat(sessionStorage.getItem("occprice") || 0) + parseFloat(sessionStorage.getItem("addons") || 0) + (parseFloat(sessionStorage.getItem("cakeprice")) || 0) - (parseFloat(sessionStorage.getItem("couponAmount")) || 0)).toFixed(2);
  

  
  useEffect(() => {
    GetTheatersData();
  }, []);
  
  const history = useHistory()
  const handleClick = () => {
    history.push("/theaters")
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Basic" />
          <Row>
            <>
              {isLoading === true ? (
                <div
                  className="text-center"
                  style={{
                    // background:
                    //   "linear-gradient(329deg, rgba(191, 63, 249, 1) 0%, rgba(113, 51, 210, 1) 100%)",
                    backgroundColor: "var(--charcoal-black)",
                    // height: "100vh",
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
                    {/* <section
              id="parallax"
              className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
            >
              <div className="container"></div>
            </section> */}
                    <section className="shop-area p-relative ">
                      <div className="container">
                        <button
                          type="button"
                          className="btn mb-3 bg-primary"
                          // style={{ background: "var(--gold-gradient)", border: "none", color: "black" }}
                          onClick={handleClick}
                        >
                          <i className="far fa-arrow-alt-circle-left"></i> Back
                        </button>
                        <div className="row">
                          <div className="col-8">
                            <div className="p-2 rounded w-100 mx-auto ">
                              <div className="row shadow-sm p-2">
                                <div className="col-12">
                                  <h4>Overview</h4>
                                </div>
                                <div className="col-12 col-md-4 d-flex align-items-center mb-2">
                                  <FaMapMarkerAlt
                                    style={{ color: "var(--gold-gradient)" }}
                                  />
                                  <span className="ms-2">
                                    {sessionStorage.getItem("theaterName")},
                                    Hyderabad
                                  </span>
                                </div>
                                <div className="col-12 col-md-3 d-flex align-items-center mb-2">
                                  <FaCalendarAlt
                                    style={{ color: "var(--gold-gradient)" }}
                                  />
                                  <span className="ms-2">
                                    {sessionStorage.getItem("date")}
                                  </span>
                                </div>
                                <div className="col-12 col-md-5 d-flex align-items-center mb-2">
                                  <FaClock
                                    style={{ color: "var(--gold-gradient)" }}
                                  />
                                  <span className="ms-2">
                                    {sessionStorage.getItem("slot")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="container mt-2">
                          <form
                            onSubmit={e => {
                              handleSubmit(e)
                            }}
                          >
                            <div className="row">
                              {/* Booking Details Form */}
                              <div className="col-md-8 shadow-lg mb-5">
                                <div className=" mb-3 mt-4">
                                  <div className="">
                                    <h5 className="card-title">
                                      Booking Details
                                    </h5>
                                    <div className="row mb-3 mt-3">
                                      <div className="col-md-6">
                                        <label
                                          htmlFor="userName"
                                          className="form-label"
                                        >
                                          Your Name{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="userName"
                                          name="userName"
                                          value={data.userName}
                                          onChange={e => {
                                            handleChange(e)
                                          }}
                                          required
                                          placeholder="Enter Your Name"
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <label
                                          htmlFor="numPersons"
                                          className="form-label"
                                        >
                                          Number of Persons{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                        <select
                                          className="form-select"
                                          id="numPersons"
                                          name="noOfPersons"
                                          value={data.noOfPersons}
                                          onChange={e => handleChange(e)}
                                          required
                                        >
                                          <option value="">
                                            No. of Persons
                                          </option>
                                          {Array.from(
                                            { length: theatermaxseats },
                                            (_, index) => (
                                              <option
                                                key={index}
                                                value={index + 1}
                                              >
                                                {index + 1}
                                              </option>
                                            )
                                          )}
                                        </select>
                                      </div>
                                    </div>

                                    <div className="row mb-3">
                                      <div className="col-md-6">
                                        <label
                                          htmlFor="whatsAppNumber"
                                          className="form-label"
                                        >
                                          Mobile Number{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          maxLength="10"
                                          minLength="10"
                                          pattern="[6789][0-9]{9}"
                                          id="userPhone"
                                          name="userPhone"
                                          value={data.userPhone}
                                          placeholder="Enter your phone number"
                                          onChange={e => {
                                            handleChange(e)
                                          }}
                                          required
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <label
                                          htmlFor="email"
                                          className="form-label"
                                        >
                                          Email Id{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                        <input
                                          type="email"
                                          className="form-control"
                                          id="userEmail"
                                          required
                                          value={data.userEmail}
                                          name="userEmail"
                                          placeholder="Enter your email"
                                          onChange={e => {
                                            handleChange(e)
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <div className="row mb-3">
                                      <div className="col-md-12">
                                        <label
                                          htmlFor="decoration"
                                          className="form-label"
                                        >
                                          Do you want decoration?{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                        <select
                                          className="form-select"
                                          id="decoration"
                                          name="decoration"
                                          value={data.decoration}
                                          onChange={e => {
                                            handleChange(e)
                                          }}
                                          required
                                        >
                                          {/* <option value="">Select</option> */}
                                          <option value="Yes">Yes</option>
                                          {/* <option value="No">No</option> */}
                                        </select>
                                      </div>
                                      <div className="col-md-12 mt-3 mb-5">
                                        <label
                                          htmlFor="discountCoupon"
                                          className="form-label"
                                        >
                                          Discount Coupon
                                        </label>
                                        <div className="input-group">
                                          <input
                                            type="text"
                                            name="couponCode"
                                            onChange={handleCouponChange}
                                            className="form-control"
                                            id="discountCoupon"
                                            placeholder="Enter coupon code"
                                            value={couponData.couponCode || ''} 
                                            // readOnly={isCouponApplied} 
                                          />
                                          <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={add1}
                                            // disabled={isCouponApplied}
                                          >
                                            Apply
                                            {/* {isCouponApplied
                                              ? "Applied"
                                              : "Apply"} */}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Booking Summary */}
                              <div className="col-lg-4 col-md-5 mb-5">
                                <div
                                  className="position-sticky "
                                  style={{ top: "20px" }}
                                >
                                  <div className="">
                                    <div className="card-body shadow-lg">
                                      <div className="d-flex justify-content-between align-items-center shadow-none rounded ">
                                        <div>Total:</div>
                                        <div>
                                          ₹ {Totaluserprice}
                                          {/* {parseFloat(
                                            sessionStorage.getItem("TotalPrice")
                                          ).toFixed(2)} */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="shadow-lg mt-3">
                                    <div className="card-body">
                                      <div
                                        className="accordion"
                                        id="accordionExample"
                                      >
                                        <div
                                          className="accordion-item"
                                          style={{ border: "none" }}
                                        >
                                          <h2
                                            className="accordion-header"
                                            id="headingOne"
                                          >
                                            <button
                                              className="accordion-button"
                                              type="button"
                                              data-bs-toggle="collapse"
                                              data-bs-target="#collapseOne"
                                              aria-expanded="true"
                                              aria-controls="collapseOne"
                                            >
                                              Summary Details
                                            </button>
                                          </h2>
                                          <div
                                            id="collapseOne"
                                            className="accordion-collapse collapse show"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#accordionExample"
                                          >
                                            <div className="accordion-body">
                                             <div>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <div>
                                            Theatre Price ({data.noOfPersons}{" "}
                                            ppl)
                                          </div>
                                          <div>
                                            ₹
                                            {Number(
                                              sessionStorage.getItem(
                                                "theaterPrice"
                                              )
                                            )}
                                          </div>
                                        </div>
                                        <hr />
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <div>
                                            Occasions (
                                            {sessionStorage.getItem(
                                              "occasionName"
                                            )}
                                            )
                                          </div>
                                          <div>
                                            ₹
                                            {sessionStorage.getItem(
                                              "occprice"
                                            ) || 0}
                                          </div>
                                        </div>
                                        <hr />
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <div>Cake</div>
                                          <div>
                                            ₹
                                            {sessionStorage.getItem(
                                              "cakeprice"
                                            ) || 0}
                                          </div>
                                        </div>
                                        <hr />
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                          }}
                                        >
                                          <div>Addons</div>
                                          <div>
                                            ₹
                                            {sessionStorage.getItem("addons") ||
                                              0}
                                          </div>
                                        </div>
                                        {/* {addons.map((occasion, index) => (
                                          <div
                                            key={index}
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              marginBottom: "8px",
                                            }}
                                          >
                                            <div>{occasion.name}</div>
                                            <div>₹{occasion.price}</div>
                                          </div>
                                        ))} */}
                                        <hr />
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <div>Sub Total</div>
                                          <div>
                                            ₹ {SubTotaluserprice}
                                            {/* {sessionStorage.getItem("subtotal")} */}
                                          </div>
                                        </div>
                                        <hr />
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <div>Coupon Amount</div>
                                          <div>
                                            ₹
                                            {parseFloat(
                                              sessionStorage.getItem(
                                                "coupondis"
                                              )
                                            ).toFixed(2)}
                                          </div>
                                        </div>
                                        <hr />
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <div>Total Amount</div>
                                          <div>
                                            ₹ {Totaluserprice}
                                            {/* {parseFloat(
                                              sessionStorage.getItem("TotalPrice")
                                            ).toFixed(2)} */}
                                          </div>
                                        </div>
                                      </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    type="submit"
                                    className="btn btn-primary w-100 mt-2"
                                    style={{
                                      // backgroundColor: "#a020f0",
                                      boxShadow: "none",
                                      color: "black",
                                      border: "none",
                                    }}
                                  >
                                    Proceed
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
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

export default BookingForm
