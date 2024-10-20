import React, { Component } from 'react'

export class Product_ex extends Component {
    render() {
        return (
            <>
                <div className=''>
                    <div className='font-bebas text-9xl text-center text-[#000000]'>
                        Product.
                    </div>

                    <div>
                    <div className='bg-red-600 h-[5px] flex justify-center items-center '></div>  
                    <div className='bg-[#f8f8f8] h-[90px] flex justify-center items-center'>
                        <h1 className='font-bebas text-3xl text-center text-red-600'>
                            DAILY DISCOVER
                        </h1>
                    </div>
                    
                    </div>

                    <div className='p-8 '>
                        <div className='flex flex-row space-x-9 pb-4'>
                            <div className='bg-[#282828] w-[600px] h-[400px]'>Red Box</div>
                            <div className='bg-[#282828] w-[600px] h-[400px]'>Blue Box</div>
                            <div className='bg-[#282828] w-[600px] h-[400px]'>Green Box</div>
                            <div className='bg-[#282828] w-[600px] h-[400px]'>Yellow Box</div>
                        </div>
                        <div className='flex flex-row space-x-9 pb-4'>
                            <div className='bg-[#282828] w-[600px] h-[400px]'>Red Box</div>
                            <div className='bg-[#282828] w-[600px] h-[400px]'>Blue Box</div>
                            <div className='bg-[#282828] w-[600px] h-[400px]'>Green Box</div>
                            <div className='bg-[#282828] w-[600px] h-[400px]'>Yellow Box</div>
                        </div>
                        <h1 className='pt-6 flex justify-center items-center font-prompt text-2xl text-white '> ดูสินค้าเพิ่มเติม </h1>
                    </div>
                </div>
            </>
        )
    }
}

export default Product_ex