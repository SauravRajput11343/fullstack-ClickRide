import React from 'react'
import Header from '../../component/Header/Header'
import Intro from '../../component/Intro/Intro'
import Reserve from '../../component/Reserve/Reserve'
import About from '../../component/About/About'
import Vehicle from '../../component/Vehicle/Vehicle'
import Footer from '../../component/Footer/Footer'

export default function Home() {
    return (
        <div>
            <Header />
            <Intro />
            <Reserve />
            <About />
            <Vehicle />
            <Footer />
        </div>
    )
}
