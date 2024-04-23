import Footer from '@/components/Footer'
import Gameproduct from '@/components/Gameproduct'
import IndexTwo from '@/components/IndexTwo'
import Indexfirest from '@/components/Indexfirest'
import Navbar from '@/components/Navbar'
import Recentlyupdated from '@/components/Recentlyupdated'
import Testimonial from '@/components/Testimonial'
import React from 'react'

const Index = ({Productdata,addToCart}) => {
  console.log("home product",Productdata)
  return (
    <div className='bg-white' >
      <Indexfirest/>
      <IndexTwo/>
      <Recentlyupdated Productdata={Productdata} addToCart={addToCart} />
      <Testimonial/>
      <Gameproduct/>
    </div>
  )
}

export default Index