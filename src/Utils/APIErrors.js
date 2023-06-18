class API_Errors extends Error {


    constructor(message, statusCode) {

        super(message);

        this.message = message;
        this.statusCode = statusCode;

    };


};



export default API_Errors;