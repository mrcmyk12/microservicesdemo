import express, { Request, Response } from "express";
import "express-async-errors";
import { User } from "../models/user";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validate-request";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request-error";

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
	validateRequest,
	async (req: Request, res: Response) => {
		//returns errors from the validation method
		const errors = validationResult(req);

		//determine if errors exist in the isEmpty method
		if (!errors.isEmpty()) {
			throw new RequestValidationError(errors.array());
		}

		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError("Email in use");
		}

		const user = User.build({ email, password });
		await user.save();

		//generate json webtoken
		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email
			},
			process.env.JWT_KEY!
		);

		//store it on session object
		req.session = {
			jwt: userJwt
		};

		res.status(201).send(user);
	}
);

export { router as signUpRouter };
