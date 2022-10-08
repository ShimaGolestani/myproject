import React, { useEffect, useRef, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import ReactApexChart from "react-apexcharts";
import StatusIcon from "../assets/images/status.svg";
import UserIcon from "../assets/images/user.svg";
import MessageIcon from "../assets/images/messages.svg";
import CalenderIcon from "../assets/images/calender.svg";
import ApplicationIcon from "../assets/images/apps.svg";
import SearchIcon from "../assets/images/search.svg";
import ExitIcon from "../assets/images/exit.svg";
import CommentsIcon from "../assets/images/CommentIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import json_symbol from "../jsons/symbol.json";
import json_candle from "../jsons/candle.json";
import json_area from "../jsons/area.json";
import json_favorite from "../jsons/favorite.json";
import json_last_deals from "../jsons/last_deals.json";
import json_sidebar from "../jsons/sidebar.json";
import {
  getDataChartCandle,
  getDataChartArea,
  getSymbol,
  getDataSide,
  lastDealssync,
  setCurrentSymbolComment,
  setCandleSelected,
  getLimitSelected,
  setDataChartArea,
  setDataChartCandle,
  setDataSide,
  setFavoriteSymbol,
  setLastDeals,
  setSearch,
  setShowApps,
  setShowMessage,
  setShowModalAddComments,
  setShowModalComments,
  setShowProfile,
  setShowStats,
  setSymbols,
  setLimitSelected,
} from "../redux/home/home-action";
import { StarIcon as StarFillIcon } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/outline";
import ModalAddComment from "../components/ModalAddComments";
import ModalComments from "../components/ModalComments";
import { Overlay, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Token } from "../Constants/LocalStorageConstants";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { signOut } = useAuth();
  const dispatch = useDispatch();
  const {
    symbols,
    chartArea,
    chartCandle,
    favorite,
    lastDeals,
    search,
    side,
    showProfile,
    showMessage,
    showApps,
    showStats,
    candleSelected,
    limitSelected,
  } = useSelector((state) => state.home);

  const refProfile = useRef();
  const refMessage = useRef();
  const refApps = useRef();
  const refStats = useRef();

  console.log(candleSelected);

  const navigate = useNavigate();

  // initial state
  useEffect(() => {
    dispatch(getSymbol());
    dispatch(setFavoriteSymbol(json_favorite.favorites));
    dispatch(getDataSide());
    dispatch(getDataChartCandle("")).then((res) => {
      const array = [];
      res.map((item) => {
        array.push({
          x: new Date(item.eventDate + item.eventClock),
          y: [
            item.finalTradePrice,
            item.maxPrice,
            item.minPrice,
            item.closePrice,
          ],
        });
        console.log("test");
      });
      dispatch(setDataChartCandle([{ data: array }]));
    });

    dispatch(getDataChartArea()).then((res) => {
      const array = [];
      res.map((item) => {
        array.push({
          x: new Date(item.eventClock + item.eventClock),
          y: [item.lastValue],
        });
      });
      dispatch(setDataChartArea([{ data: array }]));
    });
  }, []);

  useEffect(() => {
    if (candleSelected != "") {
      dispatch(getDataChartCandle(candleSelected)).then((res) => {
        console.log("res", res);
        const array = [];
        res.map((item) => {
          array.push({
            x: new Date(item.eventDate + item.eventClock),
            y: [
              item.finalTradePrice,
              item.maxPrice,
              item.minPrice,
              item.closePrice,
            ],
          });
          console.log("test");
        });
        dispatch(setDataChartCandle([{ data: array }]));
      });

      dispatch(setLastDeals([]));

      dispatch(lastDealssync(candleSelected));
    }
  }, [candleSelected]);

  // outside click

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        refProfile.current &&
        !refProfile.current.contains(event.target) &&
        !document.getElementById("profile").contains(event.target)
      ) {
        dispatch(setShowProfile(false));
      }
      if (
        refMessage.current &&
        !refMessage.current.contains(event.target) &&
        !document.getElementById("message").contains(event.target)
      ) {
        dispatch(setShowMessage(false));
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refProfile, refMessage]);

  // start
  useEffect(() => {
    const list = document.getElementsByClassName("apexcharts-yaxis-label");
    for (var index = 0; index < list.length; ++index) {
      list[index].setAttribute("text-anchor", "start");
    }
  }, [chartArea, chartCandle]);

  const handleSignOut = () => {
    signOut();
    navigate("/sign-in");
  };

  const changeSearch = (e) => {
    dispatch(setSearch(e.target.value));
  };

  const [symbolName, setSymbolName] = useState();

  const addToFavorite = (item) => {
    const fav = [...favorite];
    const index = fav.findIndex((o) => o.insCode === item.insCode);
    if (index != -1) {
      fav.splice(index, 1);
    } else {
      fav.push(item);
    }
    dispatch(setFavoriteSymbol(fav));
  };

  const showModalProfile = () => {
    dispatch(setShowProfile(!showProfile));
    dispatch(setShowMessage(false));
  };

  const showModalApps = () => {
    dispatch(setShowApps(!showApps));
  };

  const showModalStats = () => {
    dispatch(setShowStats(!showStats));
  };

  const showModalMessage = () => {
    dispatch(setShowMessage(!showMessage));
    dispatch(setShowProfile(false));
  };

  const showModalAddComment = (item) => {
    dispatch(setCurrentSymbolComment(item));
    dispatch(setShowModalAddComments(true));
  };

  const showModalComments = () => {
    dispatch(setShowModalComments(true));
  };

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    bar: {
      dataLabels: {
        position: "top",
      },
    },
    title: {
      text: "CandleStick Chart",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  const options2 = {
    chart: {
      type: "area",
      height: 350,
    },
    title: {
      text: "",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  // console.log('fav', favorite);

  return (
    <div className="desktop:min-h-screen p-2 bg-back-color w-full flex ">
      <Row className="flex w-full bg-back-color rounded-5xl nopadding">
        <Col
          md={12}
          lg={3}
          className="bg-back-color flex flex-col desktop:h-full p-8 desktop:flex-1 desktop:rounded-5xl"
        >
          <div className="flex justify-evenly relative">
            <img
              onClick={showModalStats}
              ref={refStats}
              className="w-8 invert"
              alt="alt"
              src={StatusIcon}
            />
            <Overlay
              target={refStats.current}
              show={showStats}
              placement="right"
            >
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  My Tooltip
                </Tooltip>
              )}
            </Overlay>
            <img className="w-8 invert" alt="alt" src={CalenderIcon} />
            <img
              onClick={showModalApps}
              ref={refApps}
              className="w-8 invert"
              alt="alt"
              src={ApplicationIcon}
            />
            <Overlay target={refApps.current} show={showApps} placement="right">
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  My Tooltip
                </Tooltip>
              )}
            </Overlay>
            <img
              onClick={showModalMessage}
              id="message"
              className="w-8 invert"
              alt="alt"
              src={MessageIcon}
            />
            {showMessage && (
              <div
                ref={refMessage}
                id="profile"
                className="absolute text-center w-36 bg-white p-3 -bottom-20 flex flex-col items-center z-10 shadow-sm rounded-lg left-0 lg:left-4"
              >
                <div
                  className="text-xs text-gray-400 
                                "
                >
                  پيامي در صندوق نداريد
                </div>
              </div>
            )}
            <img
              id="profile"
              onClick={showModalProfile}
              className="w-8 invert"
              alt="alt"
              src={UserIcon}
            />
            {showProfile && (
              <div
                ref={refProfile}
                id="profile"
                className="absolute w-36 bg-white p-3 -bottom-32 flex flex-col items-center z-10 shadow-sm rounded-lg left-0 lg:-left-12"
              >
                <img className="w-8 " alt="alt" src={UserIcon} />
                <div className="text-sm font-bold mt-3 invert-0 text-black">
                  شیما گلستانی
                </div>
                <div className="text-zinc-400 text-xs mt-2 font-bold">
                  ویرایش پروفایل
                </div>
                <div>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={handleSignOut}
                    className="text-black"
                  >
                    خروج
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* <div className='relative mt-6'>
                        <img alt='' className='absolute right-3 top-0 bottom-0 m-auto' src={SearchIcon} />
                        <input onChange={changeSearch} value={search} className='bg-white h-10 rounded-full w-full pr-11  text-black' type='text' placeholder='' />
                    </div> */}
          <div className="bg-white text-black mt-6 w-full desktop:flex-1 rounded-2.5x p-3 ">
            {/* <div className='font-bold text-center border-b py-3'>
                            {side.symbol}
                        </div> */}
            <div className="font-bold text-center border-b py-3 mt-5">
              <div>شاخص کل</div>
              <div className="mt-2 text-sm">{side.indexLastValue}</div>
            </div>
            <div className="font-bold text-center border-b py-3">
              <div>ارزش بازار</div>
              <div className="mt-2 text-sm">{side.marketValue}</div>
            </div>
            <div className="font-bold text-center border-b py-3">
              <div>تعداد معاملات</div>
              <div className="mt-2 text-sm">{side.numberOfTrades}</div>
            </div>
            <div className="font-bold text-center border-b py-3">
              <div>ارزش معاملات</div>
              <div className="mt-2 text-sm">{side.valueOfTrades}</div>
            </div>
            <div className="font-bold text-center py-3">
              <div>حجم معاملات</div>
              <div className="mt-2 text-sm">{side.volumeOfTrades}</div>
            </div>
          </div>

          <div className="mt-3 flex justify-center">
            <img
              alt="alt"
              src={ExitIcon}
              style={{ cursor: "pointer" }}
              onClick={handleSignOut}
              className="invert"
            />
            <img
              onClick={showModalComments}
              alt="alt"
              className="mr-7 invert"
              src={CommentsIcon}
            />
          </div>
        </Col>
        <Col
          className="nopadding bg-white flex-1  desktop:h-full desktop:rounded-5xl"
          md={12}
          lg={9}
        >
          <div className="dektop:p-8 px-4 desktop:mt-0 mt-3 ">
            <div className="flex ">
              <div className="w-1/5 ml-2">
                <label className="text-black bg-search-color rounded-full mb-2 h-10 w-full text-center relative">
                  {" "}
                  {symbolName}{" "}
                </label>
              </div>
              <div className="relative w-4/5">
                <img
                  alt=""
                  className="absolute right-3 top-0 bottom-1 mt-2 "
                  src={SearchIcon}
                />
                <input
                  onChange={changeSearch}
                  value={search}
                  className="bg-search-color h-10 w-full rounded-full  pr-11  text-black"
                  type="text"
                  placeholder=""
                />
              </div>
            </div>
            <div className="h-48 mb-4 overflow-y-auto fixTableHead">
              <Table>
                <thead className="">
                  <tr className="text-sm ">
                    <th className="rounded-tr-2.5x py-3 text-center">
                      لیست نماد
                    </th>
                    <th className="py-3 text-center">تعداد</th>
                    <th className="py-3 text-center">آخرین قیمت</th>
                    <th className="py-3 text-center">قیمت پایانی</th>
                    <th className="py-3 text-center">ارزش فعلی</th>
                    <th className="rounded-tl-2.5x  py-3 text-center">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="tbody text-sm">
                  {symbols.map((item) => {
                    var regex = new RegExp(["w*" + search + "w*"]);
                    if (search == "" || regex.test(item.symbol))
                      return (
                        <tr key={item.insCode}>
                          <td
                            onClick={(e) => {
                              dispatch(setCandleSelected(item.insCode));
                              setSymbolName(e.target.innerHTML);
                            }}
                            className="text-center"
                          >
                            {item.symbol}
                          </td>
                          <td className="text-center">{item.tradesCount}</td>
                          <td className="text-center">
                            {item.finalTradePrice}
                          </td>
                          <td className="text-center">{item.closePrice}</td>
                          <td className="text-center">{item.tradesVolume}</td>
                          <td className="text-center flex justify-center">
                            {favorite?.find(
                              (o) => o.insCode === item.insCode
                            ) ? (
                              <StarFillIcon
                                onClick={addToFavorite.bind(this, item)}
                                className="w-5"
                              />
                            ) : (
                              <StarIcon
                                onClick={addToFavorite.bind(this, item)}
                                className="w-5"
                              />
                            )}
                            <img
                              onClick={showModalAddComment.bind(this, item)}
                              className="w-4 mr-2"
                              src={CommentsIcon}
                            />
                          </td>
                        </tr>
                      );
                    else return null;
                  })}
                </tbody>
              </Table>
            </div>

            <Row className="nopadding mt-3 justify-between gap-3 text-black ">
              <Col
                md={12}
                lg={5}
                className="overflow-y-auto flex nopadding h-64"
              >
                <div className="flex-1 bg-green-tbl rounded-tr-2.5x rounded-br-2.5x ">
                  <div className="flex h-10 bg-green-h-tbl rounded-tr-2.5x items-center text-sm justify-between px-2 ">
                    <div>تعداد</div>
                    <div>حجم</div>
                    <div>قیمت</div>
                  </div>
                  {lastDeals?.map((item) => {
                    return (
                      <div
                        key={item.insCode}
                        className="flex justify-between px-2 text-sm h-10 border-t border-green-h-tbl items-center"
                      >
                        <div>{item.numberOfSupply}</div>
                        <div>{item.supplyVolume}</div>
                        <div>{item.supplyPrice}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex-1 bg-red-tbl rounded-tl-2.5x rounded-bl-2.5x text-black">
                  <div className="flex h-10 bg-red-h-tbl rounded-tl-2.5x items-center text-sm justify-between px-2">
                    <div>تعداد</div>
                    <div>حجم</div>
                    <div>قیمت</div>
                  </div>
                  {lastDeals?.map((item) => {
                    return (
                      <div
                        key={item.insCode}
                        className="flex justify-between px-2 text-sm h-10 border-t border-red-h-tbl items-center"
                      >
                        <div>{item.numberOfDemand}</div>
                        <div>{item.demandVolume}</div>
                        <div>{item.demandPrice}</div>
                      </div>
                    );
                  })}
                </div>
              </Col>
              <Col className="overflow-y-auto dekstop:h-96 nopadding">
                <Table>
                  <thead className="bg-table-header">
                    <tr className="text-sm">
                      <th className="rounded-tr-2.5x py-3 text-center">
                        نمادهای منتخب
                      </th>
                      <th className="py-3 text-center">تعداد</th>
                      <th className="py-3 text-center">آخرین قیمت</th>
                      <th className="py-3 text-center">قیمت پایانی</th>
                      <th className="rounded-tl-2.5x  py-3 text-center">
                        ارزش فعلی
                      </th>
                    </tr>
                  </thead>
                  <tbody className="tbody text-sm">
                    {favorite.map((item) => {
                      return (
                        <tr key={item.insCode}>
                          <td className="text-center">{item.symbol}</td>
                          <td className="text-center">{item.tradesCount}</td>
                          <td className="text-center">
                            {item.finalTradePrice}
                          </td>
                          <td className="text-center">{item.closePrice}</td>
                          <td className="text-center">{item.tradesVolume}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>

            <div className="nopadding mt-3 justify-between gap-3 flex flex-col desktop:flex-row ">
              <Col className="bg-candle flex-1 rounded-2xl pt-3 ">
                <ReactApexChart
                  options={options2}
                  series={chartArea}
                  type="area"
                  height={300}
                />
              </Col>
              <div className="bg-candle flex-1 rounded-2xl pt-2">
                <ReactApexChart
                  options={options}
                  series={chartCandle}
                  type="candlestick"
                  height={300}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <ModalAddComment />
      <ModalComments />
    </div>
  );
};

export default Home;
