import React, { useState, useEffect } from "react";
import axios from "axios";

import List from "../List";
import Badge from "../Badge";

import closeSvg from "../../assets/img/close.svg";

import "./AddList.scss";

const AddList = ({ colors, onAdd }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [visiblePopup, setVisiblePopup] = useState(false);
  const [selColor, setSelColor] = useState(3);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(colors)) {
      setSelColor(colors[0].id);
    }
  }, [colors]);

  const onClose = () => {
    setVisiblePopup(false);
    setInputValue("");
    setSelColor(colors[0].id);
  };

  const addList = () => {
    if (!inputValue) {
      alert("Введите название списка!");
      return;
    }
    setIsLoading(true);
    axios
      .post("http://localhost:3001/lists", {
        name: inputValue,
        colorId: selColor,
      })
      .then(({ data }) => {
        const color = colors.filter((c) => c.id === selColor)[0].name;
        const listObj = { ...data, color: { name: color } };
        onAdd(listObj);
        onClose();
      })
      .catch(() => {
        alert("Ошибка при добавлении списка!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="add-list">
      <List
        onClick={() => setVisiblePopup(true)}
        items={[
          {
            className: "list__add-btn",
            icon: (
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="list__add-btn"
              >
                <path
                  d="M8 1V15"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 8H15"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            name: "Добавить список",
          },
        ]}
      />
      {visiblePopup && (
        <div className="add-list__popup">
          <img
            onClick={onClose}
            src={closeSvg}
            alt="Close icon"
            className="add-list__popup-close-btn"
          />
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="field"
            type="text"
            placeholder="Название папки"
          />
          <div className="add-list__popup-colors">
            {colors.map((color) => (
              <Badge
                onClick={() => setSelColor(color.id)}
                key={color.id}
                color={color.name}
                className={selColor === color.id && "active"}
              />
            ))}
          </div>
          <button onClick={addList} className="button">
            {isLoading ? "Происходит добавление..." : "Добавить"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddList;
