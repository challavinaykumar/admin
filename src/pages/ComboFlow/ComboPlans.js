import React, { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { ToastContainer } from "react-toastify"
import "primereact/resources/themes/lara-light-cyan/theme.css"
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

const ComboPlans = () => {
  var gets = localStorage.getItem("authUser")
  var dataa = JSON.parse(gets)
  var datas = dataa.token
  var token = datas
  const [isLoading, setIsLoading] = useState(true)
  const history = useHistory()
  const [showImages, setShowImages] = useState(null)
  console.log(showImages)
  const [cakesFlavour, setCakesFlavour] = useState(null)
  console.log(cakesFlavour)
  const [itemkey, setItemkey] = useState("")
  const [plans, setPlans] = useState([])
  console.log(plans)
  const [planProducts, setPlanProducts] = useState([])
  console.log(planProducts)
  const [cakes, setCakes] = useState([]) // egg and eglees
  const [otherProducts, setotherProducts] = useState([]) // other PLAN PRODUCTS
  console.log(otherProducts)

  const [totalAmountOption, setTotalAmountOption] = useState({
    amountOption: "partialpayment", // Set this to "partialpayment" by default
  })

  // const navigate = useNavigate();
  useEffect(() => {
    axios.post(URLS.GetAllTheaters, {}).then(res => {
      if (res.status === 200) {
        setIsLoading(false)
      }
    })
    sessionStorage.setItem("paymentkey", "partialpayment")
  }, [])

  useEffect(() => {
    const getid = sessionStorage.getItem("theaterId")
    const occasiondata = sessionStorage.getItem("occasion")
    const datas = JSON.parse(occasiondata)

    if (datas && getid) {
      axios
        .post(URLS.GetOccationById, { occasionId: datas._id, theatreId: getid })
        .then(res => {
          console.log(res.data)
          setPlans(res.data?.plans || [])
        })
    }
  }, [])

  const handleBack = () => {
    history.push("/combooccassions")
  }

  useEffect(() => {
    // Update the state based on the window width when the component mounts
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768) // Open if width is greater than 768px
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // const handleFlavourChange = (e, i) => {
  //   const updatedFlavours = [...cakesFlavour];
  //   updatedFlavours[i] = {
  //     ...updatedFlavours[i],
  //     [e.target.name]: e.target.value,
  //   };
  //   setCakesFlavour(updatedFlavours);
  // };

  const [advanceAmount, setAdvanceAmount] = useState(0)
  console.log(advanceAmount)
  useEffect(() => {
    getOneGst()
  }, [])

  const getOneGst = async () => {
    try {
      const res = await axios.post(URLS.GetCharges, {})
      if (res.status === 200) {
        console.log(res.data.charges.comboAdvancePayment, "response")
        // setGst(Number(res.data.charges.bookingGst));
        setAdvanceAmount(Number(res.data.charges.comboAdvancePayment))
        sessionStorage.setItem(
          "comboAdvancePayment",
          res.data.charges.comboAdvancePayment
        )
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // setGst(0);
      }
    }
  }

  const [totalAmountOption1, setTotalAmountOption1] = useState("")

  const slecthandleChange = e => {
    const myChange = { ...totalAmountOption }
    myChange[e.target.name] = e.target.value
    console.log(e.target.value)
    sessionStorage.setItem("paymentkey", e.target.value)
    setTotalAmountOption(myChange)
    if (e.target.value == "partialpayment") {
      const advanceamountkey =
        parseFloat(sessionStorage.getItem("TotalPrice")) -
        parseFloat(advanceAmount)
      setTotalAmountOption1(advanceamountkey)
      sessionStorage.setItem("TotalPrice2", advanceamountkey)
      sessionStorage.setItem("advancePayment", parseFloat(advanceAmount))
    } else {
      const advanceamountkey = parseFloat(sessionStorage.getItem("TotalPrice"))
      setTotalAmountOption1(advanceamountkey)
      sessionStorage.setItem("TotalPrice2", advanceamountkey)
    }
  }

  // Conditional total amount calculation
  const remainingAmount =
    totalAmountOption === "fullpayment"
      ? 0
      : sessionStorage.getItem("TotalPrice") - advanceAmount

  const totalAmount = Number(sessionStorage.getItem("TotalPrice"))
  const remainingAmountFixed = remainingAmount.toFixed(2)
  const totalAmountFixed = totalAmount.toFixed(2)
  const displayedAdvanceAmount =
    totalAmountOption === "fullpayment" ? 0 : advanceAmount

  const [extrapersionschanges, setextrapersionschanges] = useState(0)
  const [extrapersionschanges1, setextrapersionschanges1] = useState(0)

  const nintymin = Number(sessionStorage.getItem("nintymin"))

  const [plansdata, setplansdata] = useState([])
  console.log(plansdata)

  // const handleChoose = (item) => {
  //   setplansdata(item)
  //   setShowImages((prevVisibleImages) => ({
  //     ...prevVisibleImages,
  //     [item._id]: !prevVisibleImages[item._id]
  //   }));

  // }

  const [theaterplanstate, settheaterplanstate] = useState(0)
  const [totalplanprice, settotalplanprice] = useState(0)
  const [subtotalplanprice, setsubtotalplanprice] = useState(0)
  const handleChoose = (item, index) => {
    setplansdata(item)
    if (showImages === index) {
      setShowImages(null)
    } else {
      setShowImages(index)
    }
    axios.post(URLS.GetByPlanIdProducts, { planId: item._id }).then(res => {
      const selectedCaketype = res?.data?.planProducts.filter(
        cake => cake.categoryName === "cakes"
      )
      setPlanProducts(selectedCaketype[0])
      setCakes(selectedCaketype)
      const selectedCaketype1 = res?.data?.planProducts.filter(
        cake => cake.categoryName !== "cakes"
      )
      setotherProducts(selectedCaketype1)
    })
    const theaterPrice =
      parseFloat(
        nintymin == 90
          ? sessionStorage.getItem("theatrePrices")
          : sessionStorage.getItem("theatrePrices")
      ) || 0
    // settheaterPriceplan(theaterPrice)
    const theaterplanprice =
      nintymin == 90 ? item.oneandhalfslotPrice : item.offerPrice
    settheaterplanstate(theaterplanprice)
    sessionStorage.setItem("planpricesss", theaterplanprice)
    const extrapersions = sessionStorage.getItem("countPeople")
    if (Number(extrapersions) > item.noOfPersons) {
      const extrapersons = extrapersions - item.noOfPersons
      setextrapersionschanges1(extrapersons)
      const extrapersonscharge = extrapersons * item.extraPersonPrice
      setextrapersionschanges(extrapersonscharge)
      sessionStorage.setItem("planextrapersoncharge", extrapersonscharge)
      const totalallprice =
        parseFloat(theaterplanprice) +
        parseFloat(extrapersonscharge) +
        parseFloat(item.theatrePriceIncluded === "No" ? theaterPrice : 0) -
        parseFloat(sessionStorage.getItem("coupondis") || 0)
      const subtotalallprice =
        parseFloat(theaterplanprice) +
        parseFloat(extrapersonscharge) +
        parseFloat(item.theatrePriceIncluded === "No" ? theaterPrice : 0)
      settotalplanprice(totalallprice)
      setsubtotalplanprice(subtotalallprice)
      sessionStorage.setItem("totalallprice", totalallprice)
      sessionStorage.setItem("subtotalallprice", subtotalallprice)
    } else {
      const extrapersonscharge = 0
      const totalallprice =
        parseFloat(theaterplanprice) +
        parseFloat(extrapersonscharge) +
        parseFloat(item.theatrePriceIncluded === "No" ? theaterPrice : 0) -
        parseFloat(sessionStorage.getItem("coupondis") || 0)
      const subtotalallprice =
        parseFloat(theaterplanprice) +
        parseFloat(extrapersonscharge) +
        parseFloat(item.theatrePriceIncluded === "No" ? theaterPrice : 0)
      settotalplanprice(totalallprice)
      setsubtotalplanprice(subtotalallprice)
      sessionStorage.setItem("totalallprice", totalallprice)
      sessionStorage.setItem("subtotalallprice", subtotalallprice)
      setextrapersionschanges1(0)
      setextrapersionschanges(extrapersonscharge)
      sessionStorage.setItem("planextrapersoncharge", extrapersonscharge)
    }
  }

  //   const handleChoose = (item, index) => {
  //     setplansdata(item);
  //     if (showImages === index) {
  //       setShowImages(null);
  //     } else {
  //       setShowImages(index);
  //     }

  //     setItemkey(item._id);
  //     let existingTotal = parseFloat(sessionStorage.getItem("TotalPrice")) || 0;
  //     let storedCakePrice = parseFloat(sessionStorage.getItem("cakeprice")) || 0;
  //     let theaterPrice = parseFloat(nintymin == 90 ? item.oneandhalfslotPrice : 0) || 0;
  //     sessionStorage.setItem( "theaterPrice", nintymin == 90 ? item.oneandhalfslotPrice : item.offerPrice);
  //     let couponamount = parseFloat(sessionStorage.getItem("coupondis")) || 0;
  //     console.log(theaterPrice);
  //     console.log(storedCakePrice);
  //     axios.post(URLS.GetByPlanIdProducts, { planId: item._id }).then((res) => {
  //       const selectedCaketype = res?.data?.planProducts.filter(
  //         (cake) => cake.categoryName === "cakes"
  //       );
  //       setPlanProducts(selectedCaketype[0]);
  //       setCakes(selectedCaketype);
  //       const selectedCaketype1 = res?.data?.planProducts.filter(
  //         (cake) => cake.categoryName !== "cakes"
  //       );
  //       console.log(selectedCaketype);
  //       console.log(selectedCaketype1);
  //       setotherProducts(selectedCaketype1);
  //       sessionStorage.setItem(
  //         "theatrePriceIncluded",
  //         res?.data?.plan?.theatrePriceIncluded
  //       );
  //       setIncludes(res?.data?.plan);

  //       const extrapersions = sessionStorage.getItem("countPeople");
  //       if (Number(extrapersions) > item.noOfPersons) {
  //         const extrapersons = extrapersions - item.noOfPersons;
  //         setextrapersionschanges1(extrapersons);
  //         const extrapersonscharge = extrapersons * item.extraPersonPrice;
  //         setextrapersionschanges(extrapersonscharge);
  //         sessionStorage.setItem("extraPersonprice", extrapersonscharge);
  //         // console.log(extrapersonscharge)
  //         if (showImages) {
  //           // const newTotal = existingTotal - (storedCakePrice + theaterPrice);
  //           const newTotal0 = res?.data?.plan?.theatrePriceIncluded == "No" ? theaterPrice : 0;
  //           const newTotal1 = newTotal0 + storedCakePrice;
  //           const newTotal = newTotal1 + extrapersonscharge;
  //           console.log(newTotal);
  //           // sessionStorage.setItem("TotalPrice", newTotal);

  //           // Reset cakeprice
  //           sessionStorage.setItem("cakeprice", 0);
  //         } else {
  //           if (storedCakePrice === 0) {
  //             const newTotal0 =
  //               res?.data?.plan?.theatrePriceIncluded == "No" ? theaterPrice : 0;
  //             const newTotal1 = newTotal0 + item.offerPrice;
  //             const newTotal12 = newTotal1 - couponamount;
  //             const newTotal = newTotal12 + extrapersonscharge;
  //             console.log(newTotal);
  //             console.log(
  //               item.offerPrice + res?.data?.plan?.theatrePriceIncluded == "No"
  //                 ? theaterPrice
  //                 : 0
  //             );

  //             // sessionStorage.setItem("TotalPrice", newTotal);
  //             sessionStorage.setItem("cakeprice", item.offerPrice);
  //           }
  //         }
  //       } else {
  //         const extrapersonscharge = 0;
  //         sessionStorage.setItem("extraPersonprice", extrapersonscharge);

  //         setextrapersionschanges1(0);
  //         setextrapersionschanges(extrapersonscharge);
  //         if (showImages) {
  //           // const newTotal = existingTotal - (storedCakePrice + theaterPrice);
  //           const newTotal0 =
  //             res?.data?.plan?.theatrePriceIncluded == "No" ? theaterPrice : 0;
  //           const newTotal1 = newTotal0 + storedCakePrice;
  //           const newTotal = newTotal1 + extrapersonscharge;
  //           console.log(newTotal);
  //           // sessionStorage.setItem("TotalPrice", newTotal);

  //           // Reset cakeprice
  //           sessionStorage.setItem("cakeprice", 0);
  //         } else {
  //           if (storedCakePrice === 0) {
  //             const newTotal0 =
  //               res?.data?.plan?.theatrePriceIncluded == "No" ? theaterPrice : 0;
  //             const newTotal1 = newTotal0 + item.offerPrice;
  //             const newTotal12 = newTotal1 - couponamount;
  //             const newTotal = newTotal12 + extrapersonscharge;
  //             console.log(newTotal);
  //             console.log(
  //               item.offerPrice + res?.data?.plan?.theatrePriceIncluded == "No"
  //                 ? theaterPrice
  //                 : 0
  //             );
  // console.log(newTotal)
  //             // sessionStorage.setItem("TotalPrice", newTotal);
  //             sessionStorage.setItem("cakeprice", item.offerPrice);
  //           }
  //         }
  //       }
  //     });
  //   };

  const handleFlavourChange = e => {
    const selectedId = e.target.value
    const selectedCake = cakes.find(cake => cake._id === selectedId)
    console.log(selectedCake)
    setPlanProducts(selectedCake || null) // Handle case where no cake is selected
  }
  const singleCake = data => {
    setPlanProducts(data)
    console.log(data)
  }

  const handleGoToBookingSummary = () => {
    history.push("/theaters")
  }

  const handleSubmit = () => {
    const bodyData = {
      bookingId: sessionStorage.getItem("bookingid"),
      totalPrice: totalplanprice,
      planId: plansdata._id,
      // flavour: cakesFlavour[0]?.flavour,
      flavour: planProducts?.name,
      productId: planProducts?._id,
    }

    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatecombo",
        bodyData
      )
      .then(
        res => {
          if (res.status === 200) {
            console.log(res.data)
            history.push("/combocheckout")
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            console.log(error.response)
            toast.error(error.response.message)
          } else if (error.response && error.response.status === 406) {
            toast.error(error.response.message)
            setTimeout(() => {
              history.push("/theaters")
            }, 2000)
          }
        }
      )
  }

  const advanceAmount1 =
    totalAmountOption.amountOption === "partialpayment"
      ? displayedAdvanceAmount
      : 0
  const totalPrice1 = parseFloat(sessionStorage.getItem("TotalPrice")) || 0
  const remainingAmount1 = totalPrice1 - advanceAmount1

  const cahstypestor = sessionStorage.getItem("payType")
  const [onlines, setOnline] = useState(cahstypestor || "cash")
  console.log(onlines)

  const handleCashOptionClick = e => {
    const value = e.target.value || "cash"
    setOnline(value)
    sessionStorage.setItem("payType", value)
  }


  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Combo Plans"
          />
          <Row>
            <>
              {isLoading ? (
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
                    <section className="shop-area p-relative">
                      <div className="container">
                        <button
                          type="button"
                          className="btn mb-2 bg-primary"
                          onClick={handleBack}
                        >
                          <i className="far fa-arrow-alt-circle-left"></i> Back
                        </button>
                        <div className="container mt-4">
                          <div className="row">
                            {plans.length === 0 ? (
                              <div className="col-md-12 shadow-lg p-4 text-center">
                                <div className="text-center">
                                  <h3>
                                    There are no plans available for this
                                    theater. Please choose another theater.
                                  </h3>
                                  <button
                                    type="button"
                                    className="btn mb-2 ms-2 bg-primary"
                                    style={{
                                      // backgroundColor: "#a020f0",
                                      boxShadow: "none",
                                      color: "black",
                                      border: "none",
                                    }}
                                    onClick={handleGoToBookingSummary}
                                  >
                                    Click Now
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="col-md-8 shadow-lg p-4 gradient-border bg-light-grey">
                                  <div className="row">
                                    {plans.map((item, index) => (
                                      <div key={index}>
                                        <div className="col-lg-4 mb-2">
                                          <div
                                            className="card bg-dark"
                                            style={{
                                              color: "#fff",
                                              borderRadius: "10px",
                                              padding: "20px",
                                              marginTop: "20px",
                                              width: "300px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              handleChoose(item, index)
                                            }
                                          >
                                            <h2 className="fw-bold text-gold-gradient">
                                              {item.name}
                                            </h2>
                                            <p>({item.noOfPersons}) Members</p>
                                            <ul className="pt-4 opls">
                                              {item?.benefits?.map(
                                                (datas, is) => (
                                                  <li className="pb-2" key={is}>
                                                    <img
                                                      draggable="false"
                                                      role="img"
                                                      className="emoji m-1"
                                                      alt="🌟"
                                                      style={{ height: "15px" }}
                                                      src="https://s.w.org/images/core/emoji/15.0.3/svg/1f31f.svg"
                                                    />
                                                    {datas}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                            <p>
                                              <del className="text-center">
                                                <small>₹ </small>
                                                {item.price}
                                              </del>
                                            </p>
                                            <h3>
                                              <small> ₹</small>
                                              {nintymin == 90
                                                ? item.oneandhalfslotPrice
                                                : item.offerPrice}
                                              /-
                                              {/* {item.offerPrice}/- */}
                                            </h3>
                                            <button
                                              className="btn btn-success  mt-3 main-booknow"
                                              style={{
                                                boxShadow: "none",
                                                color: "black",
                                                border: "none",
                                              }}
                                              onClick={() =>
                                                handleChoose(item, index)
                                              }
                                            >
                                              {showImages === index
                                                ? "Hide"
                                                : "Choose"}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div className="row d-flex">
                                      {Object.keys(plansdata).length > 0 ? (
                                        <div
                                          className="col-md-4 col-sm-6 mb-4 d-flex flex-column"
                                          style={{ cursor: "pointer" }}
                                        >
                                          {/* Card */}
                                          <div
                                            className="card flex-fill"
                                            style={{
                                              border: "none",
                                              boxShadow:
                                                "0 4px 8px rgba(0, 0, 0, 0.2)",
                                            }}
                                          >
                                            <div
                                              style={{ position: "relative" }}
                                            >
                                              {/* Conditionally render the badge if the cake is eggless */}
                                              {planProducts.cakeType ===
                                                "eggless" && (
                                                <span
                                                  className="badge bg-success"
                                                  style={{
                                                    position: "absolute",
                                                    top: "10px",
                                                    left: "10px",
                                                    zIndex: "1",
                                                  }}
                                                >
                                                  Eggless
                                                </span>
                                              )}
                                              <img
                                                src={
                                                  URLS.Base + planProducts.image
                                                }
                                                className="card-img-top"
                                                alt="Combo Image"
                                                style={{
                                                  height: "200px",
                                                  width: "100%",
                                                  objectFit: "cover",
                                                  borderBottom:
                                                    "1px solid #ddd",
                                                }}
                                              />
                                            </div>

                                            <div className="card-body bg-dark text-white gradient-border">
                                              {/* Cake name and egg/eggless images in one row */}
                                              <div className="d-flex justify-content-between align-items-center">
                                                <h5
                                                  className="card-title"
                                                  style={{
                                                    fontSize: "15px",
                                                    margin: "0",
                                                  }}
                                                >
                                                  {planProducts.name}
                                                </h5>

                                                {/* Conditionally render the base64 image for egg or eggless cake */}
                                                {planProducts.cakeType ===
                                                "egg" ? (
                                                  <img
                                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABW0lEQVR4nN2VP0sDQRDF01gIgoWFYGGhCBaCxRWGS/LeXXKFihK/kljoF/FT+LcRLFIIFoKgaDTZPRUVEy0sjOSYO84YzWruQBzYZvYxP+bNsJvJ/JvwyXkNXGmy9dujyDcNVHzXnfwE0GS1n+L6I2izGyC47MuFQsEWwEEqAOU4c0Ed4DAVQN11LQFUfgTQjlPWwJ4GmsEhdxW51KnzXXc2sAg4MgZocuPLYQJrca0iZ6SDYyOAJld6bUwdWAz1NXJaACdmAGC/50oC26H+BpiSLTo17eDZAPAY6fP5Ccmfm3bQNAA8RBblcuOSv0zSoq1Qf2vbY2JRzQzgOGWDIS9E+mJxVPK+EUC6WP/mzVmNa69LpRHZojtjQDsUsKzJHQU0FPnU3pz4eoZx73nDnYNP9rEjhwTQSAVQzWYHpc5LKoCWZQ3IbF7T/nDOun+ZSUCAC016/Tjxt+IdjFUzfH0mcf4AAAAASUVORK5CYII="
                                                    alt="Egg Cake"
                                                    style={{
                                                      width: "20px",
                                                      marginLeft: "10px",
                                                    }}
                                                  />
                                                ) : planProducts.cakeType ===
                                                  "eggless" ? (
                                                  <img
                                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABbUlEQVR4nGNgGDZAdH6Fh9iCisfiCyv+k40XVPwTW1hxRnRBiTKGBWILyx9RZPhCFIuWYlgAk6QoFBaVWUEtOEoTC8QXVZiDzBBbUH6CJhZILqgwBluwsOIMSRaILSz3F1tYsV9sQcUXMF5Yvk98YYUPujrRReX60CC6QLQFYgsrOvBEaDOKGYsqdaBBdJkoC8QWVQYQSjESCyu84EE0v1IDEkTl14mzYEH5AcLJsnwPTL3IvFJVqPgt4ixYWP6ViHT/Aa5+boUSNIjuEemDii9E+OA9PIgWlstBLKh4SL0gWlCxG6ZeeE6pFFT8KbFB5E8wkheUecLVL6sUh/rgJVEWQIOpHY/rG5HVSi2sEIbGwRuiLQAB8UXlvmILKvaKLyj/LL6w4hMo5SAnTxgQnFnOjx7x1C3sVtXzQHxW/pkmFsisKuSExsE3mljAMDONFWrOL9pWOAsr7mKvMqlgidiC8gdiCytcKAqJQQUAHGz+5dhaYC0AAAAASUVORK5CYII="
                                                    alt="Eggless Cake"
                                                    style={{
                                                      width: "20px",
                                                      marginLeft: "10px",
                                                    }}
                                                  />
                                                ) : null}
                                              </div>
                                            </div>
                                            {planProducts.categoryName ===
                                            "cakes" ? (
                                              <select
                                                className="form-select"
                                                aria-label="Cake size selection"
                                                value={cakesFlavour?._id || ""}
                                                name="flavour"
                                                required
                                                onChange={handleFlavourChange}
                                                style={{ marginTop: "0px" }}
                                              >
                                                <option value="">
                                                  Select Flavour
                                                </option>
                                                {cakes.map((flavour, index) => (
                                                  <option
                                                    key={index}
                                                    value={flavour._id}
                                                  >
                                                    {flavour.name}
                                                  </option>
                                                ))}
                                              </select>
                                            ) : null}
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>

                                    <div className="row d-flex">
                                      {Object.keys(plansdata).length > 0 ? (
                                        <>
                                          {otherProducts.map((data, index) => (
                                            <div
                                              key={index}
                                              // className="col-md-4 col-sm-6 mb-4 d-flex flex-column"
                                              className="col-6 col-sm-4 col-md-4 mb-4 d-flex flex-column"
                                              style={{ cursor: "pointer" }}
                                            >
                                              {/* Card */}
                                              <div
                                                className="card flex-fill"
                                                style={{
                                                  border: "none",
                                                  boxShadow:
                                                    "0 4px 8px rgba(0, 0, 0, 0.2)",
                                                }}
                                              >
                                                <div>
                                                  <img
                                                    src={URLS.Base + data.image}
                                                    className="card-img-top"
                                                    alt="Combo Image"
                                                    style={{
                                                      height: "120px",
                                                      width: "100%",
                                                      objectFit: "cover",
                                                      borderBottom:
                                                        "1px solid #ddd",
                                                    }}
                                                  />
                                                </div>

                                                <div className="card-body bg-dark text-white gradient-border">
                                                  <div className="d-flex justify-content-between align-items-center">
                                                    <h6
                                                      className=""
                                                      style={{
                                                        fontSize: "12px",
                                                        margin: "0",
                                                      }}
                                                    >
                                                      {data.name}
                                                    </h6>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {Object.keys(plansdata).length > 0 && (
                                  <div className="col-lg-4 col-md-5 mb-5">
                                    <div
                                      className="position-sticky"
                                      style={{ top: "20px" }}
                                    >
                                      <div className="">
                                        <div className="card-body shadow-lg">
                                          <div className="d-flex justify-content-between align-items-center shadow-none mb-2 rounded ">
                                            <div>Total:</div>
                                            <div>
                                              ₹ {totalplanprice.toFixed(2)}
                                              {/* {parseFloat(
                                                sessionStorage.getItem(
                                                  "TotalPrice"
                                                )
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
                                            <div className="accordion-item">
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
                                                        justifyContent:
                                                          "space-between",
                                                      }}
                                                    >
                                                      <div>Plan Price</div>
                                                      <div>
                                                        ₹ {theaterplanstate}
                                                        {/* {sessionStorage.getItem(
                                                          "cakeprice"
                                                        )} */}
                                                      </div>
                                                    </div>

                                                    <hr />
                                                    {/* theatrePriceIncluded  yes or no*/}

                                                    {plansdata.theatrePriceIncluded ===
                                                      "No" && (
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          justifyContent:
                                                            "space-between",
                                                        }}
                                                      >
                                                        <div>Theater Price</div>
                                                        <div>
                                                          ₹
                                                          {sessionStorage.getItem(
                                                            "theatrePrices"
                                                          )}
                                                        </div>
                                                      </div>
                                                    )}

                                                    {plansdata.theatrePriceIncluded ===
                                                      "No" && <hr />}

                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                      }}
                                                    >
                                                      <div>
                                                        Extra Person Price(
                                                        {extrapersionschanges1})
                                                      </div>
                                                      <div>
                                                        ₹{extrapersionschanges}
                                                      </div>
                                                    </div>
                                                    <hr />

                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                      }}
                                                    >
                                                      <div>Sub Total</div>
                                                      <div>
                                                        ₹
                                                        {/* {sessionStorage.getItem(
                                                          "subtotal"
                                                        )} */}
                                                        {subtotalplanprice.toFixed(
                                                          2
                                                        )}
                                                      </div>
                                                    </div>
                                                    <hr />
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
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
                                                        justifyContent:
                                                          "space-between",
                                                      }}
                                                    >
                                                      <div>Total Amount</div>
                                                      <div>
                                                        ₹{" "}
                                                        {totalplanprice.toFixed(
                                                          2
                                                        )}
                                                      </div>
                                                      {/* <div>
                                                        {totalAmountOption.amountOption ===
                                                        "partialpayment"
                                                          ? "Remaining Amount"
                                                          : "Total Amount"}
                                                      </div>
                                                      {totalAmountOption.amountOption ===
                                                      "partialpayment" ? (
                                                        <div>
                                                          {totalAmountOption1}
                                                        </div>
                                                      ) : (
                                                        sessionStorage.getItem(
                                                          "TotalPrice"
                                                        )
                                                      )} */}
                                                    </div>
                                                    <hr />
                                                    {/* {totalAmountOption.amountOption ===
                                                      "partialpayment" && (
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          flexDirection:
                                                            "column",
                                                          justifyContent:
                                                            "space-between",
                                                        }}
                                                      >
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            justifyContent:
                                                              "space-between",
                                                          }}
                                                        >
                                                          <div>
                                                            Advance Amount
                                                          </div>
                                                          <div>
                                                            - ₹{" "}
                                                            {
                                                              displayedAdvanceAmount
                                                            }{" "}
                                                            /-
                                                          </div>
                                                        </div>
                                                        <hr />
                                                      </div>
                                                    )} */}

                                                    {/* <div className="row mb-3">
                                                      <div className="col">
                                                        <div className="form-check mt-2">
                                                          <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="amountOption"
                                                            id="partialpaymentOption"
                                                            value="partialpayment"
                                                            checked={
                                                              totalAmountOption.amountOption ===
                                                              "partialpayment"
                                                            }
                                                            onClick={e =>
                                                              slecthandleChange(
                                                                e
                                                              )
                                                            }
                                                          />
                                                          <label
                                                            className="form-check-label"
                                                            htmlFor="partialpaymentOption"
                                                          >
                                                            <small>
                                                              Advance Amount
                                                            </small>
                                                          </label>
                                                        </div>
                                                      </div>
                                                      <div className="col pt-0">
                                                        <div className="form-check mt-2">
                                                          <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="amountOption"
                                                            id="fullpaymentOption"
                                                            value="fullpayment"
                                                            checked={
                                                              totalAmountOption.amountOption ===
                                                              "fullpayment"
                                                            }
                                                            onClick={e =>
                                                              slecthandleChange(
                                                                e
                                                              )
                                                            }
                                                          />
                                                          <label
                                                            className="form-check-label"
                                                            htmlFor="fullpaymentOption"
                                                          >
                                                            <small>
                                                              Full Amount
                                                            </small>
                                                          </label>
                                                        </div>
                                                      </div>
                                                    </div> */}

                                                    {/* cash and the online */}

                                                    <div className="row">
                                              <div className="col">
                                                <div className="form-check mt-3">
                                                  <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    style={{ fontSize: "13px" }}
                                                    name="OnlineOption2"
                                                    id="cashOption"
                                                    value="cash"
                                                    checked={onlines === "cash"}
                                                    onClick={
                                                      handleCashOptionClick
                                                    } // Pass event directly
                                                  />
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor="cashOption"
                                                  >
                                                    <small
                                                      style={{
                                                        fontSize: "13px",
                                                      }}
                                                    >
                                                      Cash:
                                                    </small>
                                                  </label>
                                                </div>
                                              </div>
                                              <div className="col pt-2">
                                                <div className="form-check mt-2">
                                                  <input
                                                    style={{ fontSize: "13px" }}
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="OnlineOption2"
                                                    id="onlineOption"
                                                    value="online"
                                                    checked={
                                                      onlines === "online"
                                                    }
                                                    onClick={
                                                      handleCashOptionClick
                                                    } // Pass event directly
                                                  />
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor="onlineOption"
                                                  >
                                                    <small
                                                      style={{
                                                        fontSize: "13px",
                                                      }}
                                                    >
                                                      Online
                                                    </small>
                                                  </label>
                                                </div>
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
                                        type="button"
                                        onClick={handleSubmit}
                                        className="btn w-100 mt-2 bg-primary"
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
                                )}
                              </>
                            )}
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

export default ComboPlans
