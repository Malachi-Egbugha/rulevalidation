// this method takes care of validation success response
const showSuccessResult = (field_to_validate, condition, condition_value, field, res) => {
    res.status(200).json
        ({

            "message": `field ${field} successfully validated.`,
            "status": "success",
            "data":
            {
                "validation":
                {
                    "error": false,
                    "field": field,
                    "field_value": field_to_validate,
                    "condition": condition,
                    "condition_value": condition_value
                }
            }
        })
};

//this method takes care of validation failure response
const showErrorResult = (field_to_validate, condition, condition_value, field, res) => {
    res.status(400).json
        ({

            "message": `field ${field} failed validation.`,
            "status": "error",
            "data":
            {
                "validation":
                {
                    "error": true,
                    "field": field,
                    "field_value": field_to_validate,
                    "condition": condition,
                    "condition_value": condition_value
                }
            }
        })

}

const read = (req, res, next) => {
    res.json({
        "message": "My Rule-Validation API",
        "status": "success",
        "data": {
            "name": "Malachi Chidiebere Egbugha",
            "github": "@Malachi-Egbugha",
            "email": "malachi.egbugha3.gmail.com",
            "mobile": "08062966594",
            "twitter": "@egbugha3"
        }
    })
};

const validateRule = (req, res, next) => {
    // Destructure variables to use for validation
    const { field_to_validate, condition, condition_value, field } = req.body.rule;
    console.log(field_to_validate)
    console.log(condition)
    console.log(condition_value)
    console.log(field)
    //test for eq (equal to condition value)
    if (condition == "eq")
        field_to_validate == condition_value ? showSuccessResult(field_to_validate, condition, condition_value, field, res) : showErrorResult(field_to_validate, condition, condition_value, field, res);
    //test for neq(not equal to condition value)
    else if (condition == "neq")
        field_to_validate != condition_value
            ? showSuccessResult(field_to_validate, condition, condition_value, field, res)
            : showErrorResult(field_to_validate, condition, condition_value, field, res);
    //test for gt(greater than condition value)
    else if (condition == "gt")
        field_to_validate > condition_value ? showSuccessResult(field_to_validate, condition, condition_value, field, res) : showErrorResult(field_to_validate, condition, condition_value, field, res);
    //test for gte(greater than or equal to condition value)
    else if (condition == "gte")
        field_to_validate >= condition_value
            ? showSuccessResult(field_to_validate, condition, condition_value, field, res)
            : showErrorResult(field_to_validate, condition, condition_value, field, res);

    //test for contains(contain in condition value)
    else if (condition == "contains")
        field_to_validate.includes(condition_value)
            ? showSuccessResult(field_to_validate, condition, condition_value, field, res)
            : showErrorResult(field_to_validate, condition, condition_value, field, res);

};

module.exports = { read, validateRule }
