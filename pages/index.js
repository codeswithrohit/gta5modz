import Footer from '@/components/Footer'
import Gameproduct from '@/components/Gameproduct'
import IndexTwo from '@/components/IndexTwo'
import Indexfirest from '@/components/Indexfirest'
import Navbar from '@/components/Navbar'
import Recentlyupdated from '@/components/Recentlyupdated'
import Testimonial from '@/components/Testimonial'
import React from 'react'

const Index = () => {
  return (
    <div className='bg-white' >
      <Indexfirest/>
      <IndexTwo/>
      <Recentlyupdated/>
      <Testimonial/>
      <Gameproduct/>
    </div>
  )
}

export default Index