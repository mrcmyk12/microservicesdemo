import { NextFunction, Request, Response } from "express";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation-error";

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof RequestValidationError) {
		//formatting errors into the common response structure for errors
		const formattedErrors = err.errors.map((error) => {
			return { message: error.msg, field: error.param };
		});
		//sending the user the reformatted error structure
		return res.status(400).send({ errors: formattedErrors });
	}

	if (err instanceof DatabaseConnectionError) {
		return res.status(500).send({ errors: [{ message: err.reason }] });
	}

	res.status(400).send({
		errors: [{ message: "Something went wrong" }]
	});
};
