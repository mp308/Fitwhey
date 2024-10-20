import React from "react";

function Footer() {
  return (
    <>
      <div className="bg-white py-12 text-black">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          {/* Contact Section */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold mb-4">FIXMAX PERFORMANCE</h1>
            <p className="text-sm text-gray-600">268 St. South New York/NY 88944, United States.</p>
            <p className="text-sm text-gray-600">+222-1800-2628</p>
            <p className="text-sm text-gray-600">FIXMAXPERFORMANCE@gmail.com</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-black">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-black">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-black">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-black">Pinterest</a>
            </div>
          </div>

          {/* Hot Categories */}
          <div className="flex flex-col">
            <h1 className="text-lg font-bold mb-4">Hot Categories</h1>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><a href="#">Special Offers</a></li>
              <li><a href="#">Performance</a></li>
              <li><a href="#">T-Shirts</a></li>
              <li><a href="#">Underwear</a></li>
              <li><a href="#">Top Brands</a></li>
              <li><a href="#">Online Exclusive</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col">
            <h1 className="text-lg font-bold mb-4">Customer Service</h1>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Refund Policy</a></li>
              <li><a href="#">Shipping & Return</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Store Locations</a></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="flex flex-col">
            <h1 className="text-lg font-bold mb-4">Sign Up to Newsletter</h1>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email address to get $10 off your first order and free shipping. Updates information on Sales and Offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email..."
                className="p-2 border border-gray-300 rounded-l-md w-full"
              />
              <button className="bg-black text-white px-4 py-2 rounded-r-md">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-8 flex justify-between text-sm text-gray-500 px-6">
          <div>English &nbsp; | &nbsp; United States (USD)</div>
          <div>© 2024 GYMBE. All Rights Reserved</div>
          <div className="flex space-x-4">
            <img src="visa.png" alt="Visa" />
            <img src="mastercard.png" alt="MasterCard" />
            <img src="paypal.png" alt="PayPal" />
            <img src="applepay.png" alt="Apple Pay" />
          </div>
        </div>
      </div>

      <div className="bg-red-600 w-full h-2"></div>
    </>
  );
}

export default Footer;
