import React, { useEffect, useState } from "react";
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
} from "@devexpress/dx-react-chart-bootstrap4";
import "@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css";
import { Animation } from "@devexpress/dx-react-chart";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UsersCountChart = () => {
  // Here we fetch all users in users letiable
  const [users, setAllUsers] = useState([]);
  const { sendRequest } = useHttpClient();

  // when call this component this useEffect call and fetch all users
  // from database and setAllUsers in users letiable.
  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const res = await sendRequest(`/api/users/`);
        setAllUsers(res.users);
      } catch (error) {}
    }
    fetchAllUsers();
  }, [sendRequest]);

  //current date
  let today = new Date();

  //current month
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  // current year
  let yyyy = today.getFullYear();

  // this shows last 10th number of  registered users
  // means current day users
  // we use filter method because we want all users at a specific date
  // we user filter because every data has a array of object
  today.setDate(String(today.getDate()).padStart(2, "0"));
  const today_users = users.filter((user) => {
    const t = user.registerDate;
    // in userdate letiable we can get only date so that I use substr(8,2)
    // if the date is 2021-14-10 then we get only 14

    const userdate = t.substr(8, 2); //14
    return userdate === `${String(today.getDate()).padStart(2, "0")}`;
  });

  // this shows last 9th number of  registered users

  let last1Day = new Date();
  last1Day.setDate(String(last1Day.getDate() - 1).padStart(2, "0"));
  const last_1day_users = users.filter((user) => {
    const t = user.registerDate;
    const userdate = t.substr(8, 2);
    // here we deduct dd-1 because we want last day of the current day
    return userdate === `${String(last1Day.getDate()).padStart(2, "0")}`;
  });

  // this shows last 8th number of  registered users

  let last2Days = new Date();
  last2Days.setDate(String(last2Days.getDate() - 2).padStart(2, "0"));
  const last_2days_users = users.filter((user) => {
    const t = user.registerDate;
    const userdate = t.substr(8, 2);
    // here we deduct dd-2 because we want 2nd last day of the current day

    return userdate === `${String(last2Days.getDate()).padStart(2, "0")}`;
  });

  // this shows last 7th number of  registered users
  let last3Days = new Date();
  last3Days.setDate(String(last3Days.getDate() - 3).padStart(2, "0"));
  const last_3days_users = users.filter((user) => {
    const t = user.registerDate;
    const userdate = t.substr(8, 2);
    return userdate === `${String(last3Days.getDate()).padStart(2, "0")}`;
  });

  // this shows last 6th number of  registered users

  let last4Days = new Date();
  last4Days.setDate(String(last4Days.getDate() - 4).padStart(2, "0"));
  const last_4days_users = users.filter((user) => {
    const t = user.registerDate;
    const userdate = t.substr(8, 2);
    return userdate === `${String(last4Days.getDate()).padStart(2, "0")}`;
  });

  // this shows last 5th number of  registered users

  let last5Days = new Date();
  last5Days.setDate(String(last5Days.getDate() - 5).padStart(2, "0"));
  const last_5days_users = users.filter((user) => {
    const t = user.registerDate;
    const userdate = t.substr(8, 2);
    return userdate === `${String(last5Days.getDate()).padStart(2, "0")}`;
  });
  // this shows last 4th number of  registered users

  let last6Days = new Date();
  last6Days.setDate(String(last6Days.getDate() - 6).padStart(2, "0"));
  const last_6days_users = users.filter((user) => {
    const t = user.registerDate;
    const userdate = t.substr(8, 2);
    return userdate === `${String(last6Days.getDate()).padStart(2, "0")}`;
  });

  // this shows last 4th number of  registered users

  let last7Days = new Date();
  last7Days.setDate(String(last7Days.getDate() - 7).padStart(2, "0"));
  const last_7days_users = users.filter((user) => {
    const t = user.registerDate;
    const userdate = t.substr(8, 2);
    return userdate === `${String(last7Days.getDate()).padStart(2, "0")}`;
  });
  // this shows last 4th number of  registered users

  let last8Days = new Date();
  last8Days.setDate(String(last8Days.getDate() - 8).padStart(2, "0"));
  const last_8days_users = users.filter((user) => {
    const t = user.registerDate;
    const userdate = t.substr(8, 2);
    return userdate === `${String(last8Days.getDate()).padStart(2, "0")}`;
  });
  let last9Days = new Date();
  last9Days.setDate(String(last9Days.getDate() - 9).padStart(2, "0"));
  const last_9days_users = users.filter((user) => {
    const t = user.registerDate;
    const userdate = t.substr(8, 2);
    return userdate === `${String(last9Days.getDate()).padStart(2, "0")}`;
  });
  // all users who registered last 10 days

  const AllUsers = [
    {
      //this is date which shows on x-axis of the graph
      year: `${String(today.getDate()).padStart(2, "0")}`,
      // here we get all users length who registered on this date which shows on y-axis line
      users: today_users.length,
    },
    {
      year: `${String(last1Day.getDate()).padStart(2, "0")}`,
      users: last_1day_users.length,
    },
    {
      year: `${String(last2Days.getDate()).padStart(2, "0")}`,

      users: last_2days_users.length,
    },
    {
      year: `${String(last3Days.getDate()).padStart(2, "0")}`,
      users: last_3days_users.length,
    },
    {
      year: `${String(last4Days.getDate()).padStart(2, "0")}`,
      users: last_4days_users.length,
    },
    {
      year: `${String(last5Days.getDate()).padStart(2, "0")}`,
      users: last_5days_users.length,
    },
    {
      year: `${String(last6Days.getDate()).padStart(2, "0")}`,
      users: last_6days_users.length,
    },
    {
      year: `${String(last7Days.getDate()).padStart(2, "0")}`,
      users: last_7days_users.length,
    },
    {
      year: `${String(last8Days.getDate()).padStart(2, "0")}`,
      users: last_8days_users.length,
    },
    {
      year: `${String(last9Days.getDate()).padStart(2, "0")}`,
      users: last_9days_users.length,
    },
  ];

  return (
    <div className="card">
      <Chart data={AllUsers}>
        <ArgumentAxis />
        <ValueAxis max={7} />

        <BarSeries valueField="users" argumentField="year" />
        <Title
          text={`Last 10 days User Registeration count of ${mm + "/" + yyyy}`}
        />
        <Animation />
      </Chart>
      <div>
        <h3 style={{ textAlign: "center" }}>Total number of Users</h3>
        <p>{users.length}</p>
      </div>
    </div>
  );
};

export default UsersCountChart;
