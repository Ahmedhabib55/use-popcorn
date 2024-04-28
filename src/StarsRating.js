import { useState } from "react";
import "./starStyle.css";

export default function StarsRating({
  numStar = 5,
  color = "black",
  size = 30,
  className = "",
  message = [],
  onSetRating = 0,
}) {
  const containerStyle = {
    display: " flex",
    alignItems: "center",
  };
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  function handleRating(rate) {
    setRating(rate);
    onSetRating(rate);
  }
  return (
    <div style={containerStyle} className={className}>
      {[...Array(numStar)].map((_, i) => (
        <Star
          key={i}
          onRate={() => handleRating(i + 1)}
          onDoubleClick={() => setRating(0)}
          onHoveIn={() => setTempRating(i + 1)}
          onHoveOut={() => setTempRating(0)}
          full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
          size={size}
          color={color}
        />
      ))}
      <p style={{ color: color, transform: "translate(1px, 1px)" }}>
        {message.length === numStar
          ? message[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}
// console.log(e._targetInst.index, i)

function Star({
  onDoubleClick,
  onRate,
  full,
  onHoveIn,
  onHoveOut,
  size,
  color,
}) {
  const space = {
    padding: "2px",
    fontSize: size,
    color: "#ddd",
  };
  return (
    <span
      className={""}
      style={full ? { ...space, color } : space}
      onDoubleClick={onDoubleClick}
      onClick={onRate}
      onMouseEnter={onHoveIn}
      onMouseLeave={onHoveOut}
    >
      &#9733;
    </span>
  );
}
