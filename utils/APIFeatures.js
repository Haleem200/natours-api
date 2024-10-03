class APIFeatures{
    constructor(query, queryString){
        this.query = query
        this.queryString = queryString
    }

    filter(){
        const queryObj = {...this.queryString}
        const excludedFields = ['page', 'limit','sort', 'fields'] //will handle these separately
        excludedFields.forEach(el => delete queryObj[el])
        
        
        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(queryString))
        return this;
    }
    sort(){
        if(this.queryString.sort){
            this.query = this.query.sort(this.queryString.sort);
            console.log(this.queryString.sort);
        }
        /*else{
            query = query.sort('-createdAt')  //default sorting due to date
        }*/
        return this
    }
    limitFields(){
        if(this.queryString.fields){
            this.query = this.query.select(this.queryString.fields)
        }
        return this
    }
    paginate(){
        const page = this.queryString.page *  1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this
    }    
}

module.exports = APIFeatures