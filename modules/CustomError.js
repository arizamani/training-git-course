
class CustomError extends Error{
    constructor(exception,option) {
        super();
        this.exception = exception;
        this.cause = option.cause;
    }

    numberOfException() {
        if(Array.isArray(this.exception)){
            return this.exception.length;
        }else if (!this.exception || this.exception == null ){
            return 0;
        }
    }

    arrayOfException() {
        const n = this.numberOfException();
        if(n > 0) {
            return this.exception; 
        }else{
            return null;
        }   
    }
}

module.exports = CustomError;