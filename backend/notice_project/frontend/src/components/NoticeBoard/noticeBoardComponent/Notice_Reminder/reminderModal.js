import React, { useContext } from "react";
import "./reminderModal.css";
import closeReminderModal from "../../../../assets/closeReminder.svg";
import { UserInfoContext } from "../../../../App.js";

const rangeOfNumbers = (min, max) => {
  let range = [];
  for (let i = min; i <= max; i++) {
    const items = i.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    range.push(items);
  }
  return range;
};

const formatDate = (dateArray) => {
  const newFormattedDate = [];
  newFormattedDate.push(dateArray[2]);
  newFormattedDate.push(dateArray[0]);
  newFormattedDate.push(dateArray[1]);
  newFormattedDate.join("-");
  return newFormattedDate;
};


const ReminderModal = ({ setReminderModal, setSuccessMessage, noticeID }) => {
  const hours = rangeOfNumbers(0, 23);
  const minutes = rangeOfNumbers(0, 59);
  const UserData = useContext(UserInfoContext);

  const setReminder = () => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    const dateObject = new Date();

    const time_created = dateObject.toLocaleTimeString().slice(0, 8);
    const date_created_Array = dateObject.toLocaleDateString().split("/");
    const date_created = formatDate(date_created_Array);
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const hour = document.getElementById("hours").value;
    const minute = document.getElementById("minute").value;
    const time = `${hour}:${minute}`;

    const data = {
      title: title,
      time_created: time_created,
      date_created: date_created,
      schedule_time: time,
      schedule_date: date,
      email: UserData?.email,
      user_id: user?.id,
      notice_id: noticeID,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(
      `https://noticeboard.zuri.chat/organisation/${userData?.org_id}/create-reminder/${userData?._id}`,
      options
    )
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          setSuccessMessage(true);
          console.log("SUCCESSFUL POST");
        }
      })
      .then((err) => {
        console.log(err.statusText);
      });
  };

  return (
    <div className="reminderModal">
      <div className="reminderModal-innerContainer">
        <div>
          <h2 className="reminderModal-header">Set a Reminder</h2>
          <img
            src={closeReminderModal}
            alt="closeReminderModal"
            className="reminderModal-image"
            loading="eager"
            onClick={() => setReminderModal(false)}
          />
        </div>

        <p className="reminderModal-text">
          Set a time and a date to get reminded of this Notice
        </p>

        <form>
          <div>
            <label className="reminder-label" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="reminder-input"
              maxLength="30"
              required
            />
          </div>

          <div>
            <label className="reminder-label" htmlFor="date">
              Date
            </label>
            <input type="date" id="date" className="reminder-input" required />
          </div>

          <div>
            <label className="reminder-label">Time</label>
            <div className="reminder-time-container">
              <label htmlFor="hour"></label>
              <select id="hour" className="reminder-time" required>
                {hours.map((hour, index) => {
                  return (
                    <option key={index} value={hour}>
                      {hour}
                    </option>
                  );
                })}
              </select>

              <label htmlFor="minute"></label>
              <select id="minute" className="reminder-time" required>
                {minutes.map((minute, index) => {
                  return (
                    <option key={index} value={minute}>
                      {minute}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="reminder-button-container">
            <button
              type="submit"
              className="reminder-button"
              onSubmit={setReminder}
            >
              Set Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;
