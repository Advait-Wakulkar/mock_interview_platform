import Agent from '@/components/Agent'
import React from 'react'

const Interview = () => {
  return (
   <>
   <div className='root-layout'>
    <h3>Interview Generation</h3>
    <Agent userName="You" userId="user1" type="generate"></Agent>
   </div>
   </>
  )
}

export default Interview