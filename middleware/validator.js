const Joi = require('joi');

const validateBody = (schema) => {
    return (req, res, next) => {
        const result = schema.validate(req.body);
        //check if validation error ocurred
        if (result.error) {
            //check is error field was passed and send response
            if (!(result.error._original.hasOwnProperty("rule"))) {
                return res.status(400)
                    .json({
                        "message": "rule is required.",
                        "status": "error",
                        "data": null

                    });

            }
            //check error for all required field and send response
            else if (result.error.details[0].type.split(".")[1] == 'required') {
                return res.status(400)
                    .json({
                        "message": `${result.error.details[0].context.key} is required.`,
                        "status": "error",
                        "data": null

                    });

            }
            //check if rule field is an object and send response
            else if (result.error.details[0].type == 'object.base' && (result.error.details[0].context.key) == 'rule') {

                return res.status(400)
                    .json({
                        "message": "rule should be an object.",
                        "status": "error",
                        "data": null

                    });



            }
            //check error for field type of all field
            else if (result.error.details[0].type.split(".")[1] == 'base') {
                return res.status(400)
                    .json({
                        "message": `${result.error.details[0].context.key} should be a|an ${result.error.details[0].type.split(".")[0]}.`,
                        "status": "error",
                        "data": null

                    });


            }
            //check for error for invalid payload
            else {
                console.log(result.error.details[0].message)
                return res.status(400)
                    .json({
                        "message": "Invalid JSON payload passed.",
                        "status": "error",
                        "data": null

                    });

            }


        }
        next();
    }
};

//this method checks 
const fieldValidation = (req, res, next) => {
    //check field specified in rule is one or two level
    const fieldCheck = req.body.rule.field.includes(".");
    //extract the data field of req.body
    const data = req.body.data;
    //declare a new variable field
    let field;
    //check if field specified in the rule is one or two level
    if (fieldCheck) {
        //if field is two level split with reference to . , convert to array of two element and assign to field 
        field = req.body.rule.field.split(".");

    }
    else {
        //if field is one level, convert to array of one element and assign to field 
        field = [req.body.rule.field];

    }
    // this check If the field specified in the rule object is missing from the data passed and return response if misssing
    if (!(data.hasOwnProperty(field[0]))) {
        return res.status(400)
            .json({
                "message": `field ${field[0]} is missing from data.`,
                "status": "error",
                "data": null
            });
    }
    // this check to ensure that The data field is either an array, obect or string
    else if (!(typeof data[field[0]] == 'array' || typeof data[field[0]] == 'object' || typeof data[field[0]] == 'string')) {
        return res.status(400)
            .json({
                "message": "Invalid JSON payload passed.",
                "status": "error",
                "data": null
            });
    }
    // this check If the field specified in two level rule object is missing from the data passed and sreturn response if misssing
    else if (field.length == 2 && !(typeof data[field[0]] == 'object') && !(data[field[0]].hasOwnProperty(field[1]))) {
        return res.status(400)
            .json({
                "message": `field ${field[1]} is missing from data.`,
                "status": "error",
                "data": null
            });
    }
    //when all validation has been check, pass the field to be validate to the req.body.rule to be validated in the controller
    else {
        if (field.length == 2) {
            req.body.rule.field_to_validate = data[field[0]][field[1]];
        }
        else {
            req.body.rule.field_to_validate = data[field[0]];
        }
    }
    next();
};

// this defines the schema use by Joi for validation
const schemas = {
    authSchema: Joi.object({
        rule: Joi.object({
            field: Joi.string().required(),
            condition: Joi.string().required().valid('eq', 'neq', 'gt', 'gte', 'contains'),
            condition_value: Joi.any().required()
        }).required(),
        data: Joi.any().required()
    })
};

module.exports = { validateBody, fieldValidation, schemas };
