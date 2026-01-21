import json
from datetime import datetime


class HotelInvoice:
    def __init__(self, json_file):
        self.json_file = json_file
        self.data = self.load_data()

    def load_data(self):
        try:
            with open(self.json_file, "r", encoding="utf-8") as file:
                return json.load(file)
        except FileNotFoundError:
            raise Exception("bookingData.json not found. Please export bill data from the website.")
        except json.JSONDecodeError:
            raise Exception("Invalid JSON file.")

    def print_header(self):
        print("=" * 50)
        print("        ROYALSTAY HOTEL")
        print("     5-Star Luxury & Comfort")
        print("  Email: info@royalstay.com")
        print("  Phone: +91-9876543210")
        print("=" * 50)

    def print_guest_details(self):
        print("\n--- Guest Details ---")
        print(f"Primary Guest : {self.data.get('primaryName')}")
        print(f"Email         : {self.data.get('email')}")
        print(f"Phone         : {self.data.get('phone')}")
        print(f"Aadhaar       : {self.data.get('aadhaar')}")
        print(f"Guest Type    : {self.data.get('guestType')}")
        print(f"Members       : {self.data.get('members')}")

        member_names = self.data.get("memberNames", [])
        if member_names:
            print("\nMember List:")
            for idx, name in enumerate(member_names, start=1):
                print(f"  Member {idx}: {name}")

    def print_stay_details(self):
        print("\n--- Stay Details ---")
        print(f"Room Type     : {self.data.get('room')}")
        print(f"Bed Type      : {self.data.get('bedType') or 'Standard'}")
        print(f"Nights        : {self.data.get('nights')}")
        print(f"Food Plan     : {self.data.get('food')}")

    def print_charges(self):
        print("\n--- Charges Breakdown ---")
        print(f"Room Charges   : ₹{self.data.get('roomCost')}")
        print(f"AC Charges     : ₹{self.data.get('acCost')}")
        print(f"Heater Charges : ₹{self.data.get('heaterCost')}")
        print(f"Food Charges   : ₹{self.data.get('foodCost')}")
        print(f"GST (12%)      : ₹{round(self.data.get('gst', 0), 2)}")

        print("-" * 50)
        print(f"TOTAL AMOUNT  : ₹{round(self.data.get('finalAmount', 0), 2)}")

    def save_invoice(self):
        filename = f"Hotel_Bill_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(filename, "w", encoding="utf-8") as file:
            file.write("ROYALSTAY HOTEL - FINAL INVOICE\n")
            file.write("=" * 50 + "\n")
            for key, value in self.data.items():
                file.write(f"{key}: {value}\n")
            file.write("=" * 50 + "\n")
            file.write(f"Total Amount: ₹{self.data.get('finalAmount')}\n")

        print(f"\nInvoice saved as: {filename}")

    def generate_invoice(self):
        self.print_header()
        self.print_guest_details()
        self.print_stay_details()
        self.print_charges()
        self.save_invoice()


if __name__ == "__main__":
    invoice = HotelInvoice("bookingData.json")
    invoice.generate_invoice()
 