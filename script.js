const form = document.getElementById("bookingForm");
const result = document.getElementById("result");

const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const roomTypeInput = document.getElementById("roomType");
const nameInput = document.getElementById("name");

const today = new Date().toISOString().split("T")[0];
checkInInput.min = today;
checkOutInput.min = today;

checkInInput.addEventListener("change", () => {
  checkOutInput.min = checkInInput.value;
  checkOutInput.value = "";
});

form.addEventListener("submit", handleBooking);

function handleBooking(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const roomPrice = Number(roomTypeInput.value);
  const checkInDate = new Date(checkInInput.value);
  const checkOutDate = new Date(checkOutInput.value);

  if (!name || !checkInInput.value || !checkOutInput.value) {
    showMessage("Please fill all fields.", "error");
    return;
  }

  if (checkOutDate <= checkInDate) {
    showMessage("Check-out date must be after check-in date.", "error");
    return;
  }

  const days = calculateDays(checkInDate, checkOutDate);
  const totalPrice = days * roomPrice;

  showMessage(
    `Thank you ${name}!<br>
     Stay Duration: ${days} night(s)<br>
     Total Amount: ₹${totalPrice}`,
    "success"
  );

  form.reset();
}

function calculateDays(start, end) {
  const diffTime = end - start;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function showMessage(message, type) {
  result.innerHTML = message;
  result.style.color = type === "success" ? "green" : "red";
}
