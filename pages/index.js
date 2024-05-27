import Banner from '@/components/Banner'
import Footer from '@/components/Footer'
import Gameproduct from '@/components/Gameproduct'
import HomeCarousel from '@/components/HomeCarousel'
import IndexTwo from '@/components/IndexTwo'
import Indexfirest from '@/components/Indexfirest'
import Navbar from '@/components/Navbar'
import Recentlyupdated from '@/components/Recentlyupdated'
import Testimonial from '@/components/Testimonial'
import React from 'react'

const Index = ({Productdata,addToCart,membertype,user}) => {
 
  return (
    <div className='bg-white' >
      <HomeCarousel/>
      {/* <Indexfirest/>
      <IndexTwo/> */}
      
      <Recentlyupdated Productdata={Productdata} addToCart={addToCart} membertype={membertype} user={user} />
      <Banner/>
      <Testimonial/>
      <Gameproduct Productdata={Productdata} addToCart={addToCart} membertype={membertype} user={user}  />
    </div>
  )
}

export default Index