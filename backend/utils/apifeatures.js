class Apifeatures{
    constructor(query, queryString){
        this.query= query;
        this.queryString= queryString;
    }
    search(){
       let keyword= this.queryString.keyword ?{
        name:{
            $regex: this.queryString.keyword,
            $options: "i" // case insensitive
        }
       }:{};
        this.query=this.query.find({ ...keyword })
         return this;

    }
   filter() {

  const queryCopy = { ...this.queryString };
  const removeFields = ["keyword", "limit", "page"];
  removeFields.forEach((key) => delete queryCopy[key]);

  const mongoQuery = {};

  Object.keys(queryCopy).forEach((key) => {
    const match = key.match(/(\w+)\[(gt|gte|lt|lte)\]/);
    if (match) {
      const field = match[1]; // e.g., 'price'
      const operator = `$${match[2]}`; // e.g., '$gt'
      if (!mongoQuery[field]) mongoQuery[field] = {};
      mongoQuery[field][operator] = Number(queryCopy[key]);
    } else {
      mongoQuery[key] = queryCopy[key];
    }
  });

  
  this.query = this.query.find(mongoQuery);
  return this;
}
paginate(resultsPerPage) {
  const currentPage = Number(this.queryString.page || 1);
  const skip = resultsPerPage*(currentPage - 1);
  this.query.limit(resultsPerPage).skip(skip);
    return this;
}

}
module.exports= Apifeatures;