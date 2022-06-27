import express, { Request, Response } from "express";
//method from express to validate information in the body of a request
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
	"/api/users/signin",
	[
		//using express-validator to make sure the password and email are valid entries
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.notEmpty()
			.withMessage("You must supply a password")
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			throw new BadRequestError("Invalid Credentials");
		}

		const passwordsMatch = await Password.compare(
			existingUser.password,
			password
		);

		if (!passwordsMatch) {
			throw new BadRequestError("Invalid Credentials");
		}

		//generate json webtoken
		const existingUserJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email
			},
			process.env.JWT_KEY!
		);

		//store it on session object
		req.session = {
			jwt: existingUserJwt
		};

		res.status(200).send(existingUser);
	}
);

export { router as signInRouter };
