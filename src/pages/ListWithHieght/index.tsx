import React from 'react'
import Card from '../../components/Card';
import "./index.css"
import useDocumentMeta from '../../hooks/useTitle';


const ListWithHieght = () => {
  useDocumentMeta({title:"Scroll | Hieght"})
  return (
    <div className='listWithHieght'>
      {[...Array(10).keys()].map(item => (
         <Card />
      ))}
    
    </div>
  )
}

export default ListWithHieght