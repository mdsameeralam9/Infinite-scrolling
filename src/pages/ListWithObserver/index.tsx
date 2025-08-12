import React from 'react'
import Card from '../../components/Card';
import "./index.css"
import useDocumentMeta from '../../hooks/useTitle';

const ListWithObserver = () => {
  useDocumentMeta({title:"Scroll | Observer"})
  return (
    <div className='listWithObserver'>
          {[...Array(10).keys()].map(item => (
         <Card />
      ))}
    
    </div>
  )
}

export default ListWithObserver