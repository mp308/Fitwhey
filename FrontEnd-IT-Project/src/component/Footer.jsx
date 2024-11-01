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
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="text-gray-400 hover:text-black">Facebook</a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="text-gray-400 hover:text-black">Instagram</a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter" className="text-gray-400 hover:text-black">Twitter</a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Pinterest" className="text-gray-400 hover:text-black">Pinterest</a>
            </div>
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
         

            {/* Payment Icons */}
            <div className="flex space-x-4 items-center mt-4">
              <img src="visa.png" alt="Visa" className="w-8 h-8" />
              <img src="mastercard.png" alt="MasterCard" className="w-8 h-8" />
              <img src="paypal.png" alt="PayPal" className="w-8 h-8" />
              <img src="applepay.png" alt="Apple Pay" className="w-8 h-8" />
            </div>
          </div>

          {/* Map Section */}
          <div className="flex justify-center md:justify-end">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d804.8156349419604!2d99.9783718323039!3d14.024530964034232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2ff840365e223%3A0x186beebdd6a65428!2z4Liq4Liy4LiC4Liy4Lin4Li04LiK4Liy4LmA4LiX4LiE4LmC4LiZ4LmC4Lil4Lii4Li14Liq4Liy4Lij4Liq4LiZ4LmA4LiX4LioIOC4hOC4k-C4sOC4qOC4tOC4peC4m-C4qOC4suC4quC4leC4o-C5jOC5geC4peC4sOC4p-C4tOC4l-C4ouC4suC4qOC4suC4quC4leC4o-C5jA!5e0!3m2!1sth!2sth!4v1729845712873!5m2!1sth!2sth"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-md"
            ></iframe>
          </div>
        </div>

        <div className="container mx-auto mt-8 flex justify-between text-sm text-gray-500 px-6">
          <div>English &nbsp; | &nbsp; United States (USD)</div>
          <div>© 2024 GYMBE. All Rights Reserved</div>
        </div>
      </div>

      <div className="bg-red-600 w-full h-2"></div>
    </>
  );
}

export default Footer;
