import { Fragment } from "react/jsx-runtime";
import MetaData from "../MetaData";
import { useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux'
import { getProducts } from "../../actions/productsActions";
import Loader from "./Loader";
import Product from "../product/product";
export default function Home() {
  const dispatch= useDispatch();
  const {products,loading}= useSelector((state) => state.productsState)
  console.log(products)
  useEffect(()=>{
       dispatch(getProducts())
  },[])
    return(
      <Fragment>
        {loading ? <Loader/>:
        <Fragment>
          <MetaData title={'Buy Best products'}/>
             <h1 id="products_heading">Latest Products</h1>

    <section id="products" className="container mt-5">
      <div className="row">
        { products && products.map(product=>(       
        <Product product={product}/>
      ))
        }
 

        </div>
    </section>
        </Fragment>
}
        </Fragment>

    )
}