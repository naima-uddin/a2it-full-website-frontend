import React from 'react'
import Navbar from '@/components/promotion/promotionNavbar'
import Banner from '@/components/promotion/banner'
import Project from '@/components/promotion/project'
import Package from '@/components/promotion/package'
import Contact from '@/components/promotion/contact'
import FloatingButtons from '@/components/promotion/floatingChatButtons'
import Footer from '@/components/promotion/promotionFooter'
import Digital from '@/components/promotion/digital'
import Service from '@/components/promotion/service'
import Achieve from '@/components/promotion/achieve'
import FAQ from '@/components/promotion/fag'
function page() {
    return (
        <div>
            <Navbar />
            <Banner />
            <Project />
            <Package />
            <Contact />
            <FloatingButtons />
            <Achieve />
            <Digital />
            <Service />
            <FAQ />
            <Footer />
        </div>
    )
}

export default page
