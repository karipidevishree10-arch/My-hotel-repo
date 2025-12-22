/* ---------------- FOOD SECTION TOGGLE ---------------- */
const foodRequired = document.getElementById("foodRequired");
const foodSection = document.getElementById("foodSection");

if (foodRequired && foodSection) {
  foodSection.style.display = "none";
  foodRequired.addEventListener("change", () => {
    foodSection.style.display = foodRequired.value === "Yes" ? "block" : "none";
  });
}

/* ---------------- MEMBER DETAILS DYNAMIC INPUT ---------------- */
const membersInput = document.getElementById("members");
const memberDetails = document.getElementById("memberDetails");

if (membersInput && memberDetails) {
  membersInput.addEventListener("change", () => {
    memberDetails.innerHTML = "";

    const count = Number(membersInput.value);

    if (count > 4) {
      alert("Maximum 4 members allowed per room.");
      membersInput.value = "";
      return;
    }

    for (let i = 1; i <= count; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `Member ${i} Name`;
      input.required = true;
      memberDetails.appendChild(input);
    }
  });
}

/* ---------------- BOOKING PAGE LOGIC ---------------- */
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (phone.value.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    const checkInDate = new Date(checkIn.value);
    const checkOutDate = new Date(checkOut.value);

    const nights =
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    const roomCost = Number(roomType.value) * nights;
    const acCost = Number(ac.value) * nights;
    const heaterCost = Number(heater.value) * nights;

    const foodCost =
      foodRequired.value === "Yes"
        ? Number(foodPrice.value) * Number(members.value) * nights
        : 0;

    const subtotal = roomCost + acCost + heaterCost + foodCost;
    const gst = subtotal * 0.12;
    const finalAmount = subtotal + gst;

    const memberNames = [];
    memberDetails.querySelectorAll("input").forEach((i) => {
      memberNames.push(i.value);
    });

    const bookingData = {
      hotelName: "RoyalStay Hotel",
      primaryName: primaryName.value,
      email: email.value,
      phone: phone.value,
      aadhaar: aadhaar.value,
      guestType: guestType.value,
      members: members.value,
      memberNames,
      bedType: bedType.value,
      room: roomType.options[roomType.selectedIndex].text,
      nights,
      roomCost,
      acCost,
      heaterCost,
      food:
        foodRequired.value === "Yes"
          ? `${foodType.value} (${foodPrice.options[foodPrice.selectedIndex].text})`
          : "No Food",
      foodCost,
      gst,
      finalAmount
    };

    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    window.location.href = "payment.html";
  });
}

/* ---------------- PAYMENT PAGE LOGIC ---------------- */
const paymentForm = document.getElementById("paymentForm");

if (paymentForm) {
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (cardNumber.value.length !== 16) {
      alert("Card number must be 16 digits.");
      return;
    }

    if (cvv.value.length !== 3) {
      alert("CVV must be 3 digits.");
      return;
    }

    window.location.href = "bill.html";
  });
}

/* ---------------- BILL PAGE LOGIC ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  const billOutput = document.getElementById("billOutput");
  if (!billOutput) return;

  const d = JSON.parse(localStorage.getItem("bookingData"));
  if (!d) {
    billOutput.innerHTML = "<p>No booking data found.</p>";
    return;
  }

  const memberList =
    d.memberNames && d.memberNames.length
      ? d.memberNames.map((m, i) => `<p>Member ${i + 1}: ${m}</p>`).join("")
      : "<p>Single Guest</p>";

  billOutput.innerHTML = `
    <p><strong>Guest Name:</strong><span>${d.primaryName}</span></p>
    <p><strong>Email:</strong><span>${d.email}</span></p>
    <p><strong>Phone:</strong><span>${d.phone}</span></p>
    <p><strong>Guest Type:</strong><span>${d.guestType}</span></p>
    <p><strong>Total Members:</strong><span>${d.members}</span></p>

    ${memberList}

    <p><strong>Bed Type:</strong><span>${d.bedType || "Standard"}</span></p>
    <p><strong>Room:</strong><span>${d.room}</span></p>
    <p><strong>Stay:</strong><span>${d.nights} nights</span></p>
    <p><strong>Food:</strong><span>${d.food}</span></p>

    <hr>

    <p><strong>Room Charges:</strong><span>₹${d.roomCost}</span></p>
    <p><strong>AC Charges:</strong><span>₹${d.acCost}</span></p>
    <p><strong>Heater Charges:</strong><span>₹${d.heaterCost}</span></p>
    <p><strong>Food Charges:</strong><span>₹${d.foodCost}</span></p>
    <p><strong>GST (12%):</strong><span>₹${d.gst.toFixed(2)}</span></p>

    <h3>
      <strong>Total Amount Paid:</strong>
      <span>₹${d.finalAmount.toFixed(2)}</span>
    </h3>
  `;
});

/* ---------------- LOGOUT ---------------- */
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
