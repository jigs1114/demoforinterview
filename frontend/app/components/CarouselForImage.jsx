'use client'
import React, { useEffect, useState } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

function CarouselForImage(props) {
    console.log(props.imageArray, 'line 7');
    const [imageArray , setImageArray] = useState() || []
    useEffect(()=>{
        setImageArray(props.imageArray)
    },[imageArray])
  return (
    <main>
         <Carousel autoPlay={false} swipeable emulateTouch showArrows={false} showThumbs={false}>

            {/* {imageArray.map((data,i)=>{

                <div key={i}>
                    <img src={data} alt='...' />
                </div>
            })} */}
              
            </Carousel>
    </main>
  )
}

export default CarouselForImage