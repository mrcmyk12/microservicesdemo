import { Request, Response, NextFunction, raw } from "express";
import jwt from "jsonwebtoken";

//setting up interface for what user payload looks like
interface UserPayload {
	id: string;
	email: string;
}

//augmenting the typescript definition of what the user object looks like and adding on currentUser as a property
declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload;
		}
	}
}

export const currentUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	//determining if there was a valid json webtoken present
	if (!req.session?.jwt) {
		return next();
	}

	//try/catch block to determine if the jwt has been tampered with
	try {
		const payload = jwt.verify(
			req.session.jwt,
			process.env.JWT_KEY!
		) as UserPayload;

		req.currentUser = payload;
	} catch (err) {}
	next();
};
