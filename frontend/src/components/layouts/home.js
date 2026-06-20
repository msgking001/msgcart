import { Fragment } from "react/jsx-runtime";
import MetaData from "../MetaData";
import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import { getProducts } from "../../actions/productsActions";
import Loader from "./Loader";
import Product from "../product/product";
import {toast} from 'react-toastify';
import Pagination from 'react-js-pagination';
export default function Home() {
  const dispatch= useDispatch();
  const {products,loading,error,productsCount,resultsPerPage}= useSelector((state) => state.productsState)
  const[currentPage,setCurrentPage]=useState(1);
 
  const setCurrentPageNo=(pageno)=>{
    setCurrentPage(pageno)
  }
  useEffect(()=>{
    if(error){
      return toast.error(error)
       }
       dispatch(getProducts())
  },[error,dispatch])
    return(
      <Fragment>
        {loading ? <Loader/>:
        <Fragment>
          <MetaData title={'Buy Best products'}/>
             <h1 id="products_heading">Latest Products</h1>

    <section id="products" className="container mt-5">
      <div className="row">
        { products && products.map(product=>(       
        <Product key={product._id} product={product}/>
      ))
        }
 

        </div>
    </section>
    <div className="d-flex justify-content-center mt-5">
      <Pagination
          activePage={currentPage}
          onChange={setCurrentPageNo}
          totalItemsCount={productsCount}
          itemsCountPerPage={resultsPerPage}
          nextPageText={'Next'}
          firstPageText={'First'}
          lastPageText={'Last'}
          itemClass={'page-item'}
          linkClass={'page-link'}
          
      />
    </div>
        </Fragment>
}
        </Fragment>

    )
}