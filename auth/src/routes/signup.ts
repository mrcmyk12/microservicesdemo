import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation-error";

const router = express.Router();

router.post(
	"/api/users/signup",
	[
		//Express validator to check email and password validity
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4 and 20 characters")
	],
	(req: Request, res: Response) => {
		//returns errors from the validation method
		const errors = validationResult(req);

		//determine if errors exist in the isEmpty method
		if (!errors.isEmpty()) {
			throw new RequestValidationError(errors.array());
		}

		const { email, password } = req.body;

		console.log("Creating User...");

		throw new DatabaseConnectionError();

		res.send({});
	}
);

export { router as signUpRouter };
