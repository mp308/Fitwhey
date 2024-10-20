import React from 'react'
import Header from '../component/NavBar'
import Footer from '../component/Footer'

import ShowOrders from '../component/ShowOrders'


function StatusPage() {
  return (
    <>
  <div className='bg-[#f1eeee] min-h-screen flex flex-col'>
    <Header />
    <div className="flex-grow"> {/* ทำให้ ShowOrders ใช้พื้นที่ที่เหลือ */} 
      <ShowOrders />
    </div>
    <Footer />
  </div>
</>

  )
}

export default StatusPage