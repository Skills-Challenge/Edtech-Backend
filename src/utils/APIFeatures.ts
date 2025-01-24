class APIFeatures {

    query: any;
    queryString: {[ key: string]: any};


    constructor(query: any, queryString: { [key: string]: any}){
        this.query = query;
        this.queryString = queryString;
    }



    filter(): this {
        const queryObj = {...this.queryString}
        const excludedFields = ["page", "sort", "limit","fields"]
        excludedFields.forEach((el) => delete queryObj[el]);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }


    sort(): this{
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort("-createdAt")
        }
        return this;
    }


    limitFields(): this{
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v')
        }
        return this;
    }

    paginate(): this{
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = parseInt(this.queryString.limit, 10) || 6;
        const skip = (page -1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

}

export default APIFeatures;