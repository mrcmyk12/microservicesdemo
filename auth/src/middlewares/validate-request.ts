import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

export const validateRequest = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	//returns errors from the express-validator method
	const errors = validationResult(req);

	//check to see if the validationResult method return is empty
	if (!errors.isEmpty()) {
		throw new RequestValidationError(errors.array());
	}

	next();
};
