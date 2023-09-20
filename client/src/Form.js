import React, { useState, useEffect } from "react";
import axios from "axios"; // Corrected import statement
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import { TwitterPicker, ChromePicker, SketchPicker } from "react-color";

function Forms() {
  const [textValue, setTextValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [datetimeValue, setDatetimeValue] = useState(new Date().toISOString());
  const [color, setColor] = useState("#FFFFFF");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [radioChoice, setRadioChoice] = useState("auto");

  const [formData, setFormData] = useState([]); // New state variable to store fetched data

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    // Create an object with the form data
    const formData = {
      textValue,
      selectedOption,
      selectedOptions,
      isChecked,
      startDate,
      datetimeValue,
      color,
      currentDate,
      currentTime,
      radioChoice,
    };

    // Send a POST request to your server
    axios
      .post("http://localhost:5000/api/submit-form", formData, {})
      .then((response) => {
        console.log(response.data);
        window.alert(textValue + color + "sent sussesfully");
        // Handle the response from the server as needed
      })
      .catch((error) => {
        console.error("Error submitting form data:", error);
        window.alert("Error submitting form data:", error);
        // Handle the error as needed
      });
  };

  useEffect(() => {
    // Fetch form data when the component mounts
    axios
      .get("http://localhost:5000/api/get-form-data")
      .then((response) => {
        setFormData(response.data); // Store the fetched data in state
      })
      .catch((error) => {
        console.error("Error fetching form data:", error);
      });
  }, []);

  return (
    <>
      <div>
        <h1>Input Fields</h1>

        <input
          type="text"
          placeholder="Enter text"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />

        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">Select an option</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>

        <select
          multiple
          value={selectedOptions}
          onChange={(e) =>
            setSelectedOptions(
              Array.from(e.target.selectedOptions).map((option) => option.value)
            )
          }
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          Check this box
        </label>

        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />

        <h2>Select Gender:</h2>
        <div>
          <input
            type="radio"
            id="male"
            name="genderOption"
            value="male"
            checked={radioChoice === "male"}
            onChange={() => setRadioChoice("male")}
          />
          <label htmlFor="male">Male</label>
        </div>

        <div>
          <input
            type="radio"
            id="female"
            name="genderOption"
            value="female"
            checked={radioChoice === "female"}
            onChange={() => setRadioChoice("female")}
          />
          <label htmlFor="female">Female</label>
        </div>

        <div>
          <input
            type="radio"
            id="other"
            name="genderOption"
            value="other"
            checked={radioChoice === "other"}
            onChange={() => setRadioChoice("other")}
          />
          <label htmlFor="other">Other</label>
        </div>

        <h2>Datetime Picker</h2>
        <DatePicker
          selected={new Date(datetimeValue)}
          onChange={(date) => setDatetimeValue(date.toISOString())}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy/MM/dd HH:mm"
        />

        <TwitterPicker
          color={color}
          onChangeComplete={(color) => setColor(color.hex)}
        />

        <h2>ChromePicker</h2>
        <ChromePicker
          color={color}
          onChange={(updatedColor) => setColor(updatedColor.hex)}
        />

        <h2>SketchPicker</h2>
        <SketchPicker
          color={color}
          onChange={(updatedColor) => setColor(updatedColor.hex)}
        />

        <h2>Selected Color:</h2>
        <div
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: color,
          }}
        ></div>

        <div>
          <h2>Selected Date: {currentDate.toDateString()}</h2>
          <h2>Selected Time: {currentTime}</h2>
        </div>

        <button onClick={handleSubmit}>Submit</button>
      </div>

      <h2>Fetched Data</h2>
      <ul>
        {formData.map((data, index) => (
          <li key={index}>{JSON.stringify(data)}</li>
        ))}
      </ul>
    </>
  );
}

export default Forms;
