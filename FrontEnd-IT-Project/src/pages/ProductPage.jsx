import React from 'react'
import Header from '../component/NavBar'
import Footer from '../component/Footer'
import Product_Main from '../component/Product_Main'

function ProductPage() {
  return (
    <>
    <div className='bg-[#f1eeee] min-h-screen' >
    <Header/>
    <Product_Main/>
    <Footer/>
    </div>
    </> 
  )
}

export default ProductPage