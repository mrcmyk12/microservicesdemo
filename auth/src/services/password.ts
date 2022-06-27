import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

//the scrypt function is a callback function and this code makes it become a promise
//based function
const scryptAsync = promisify(scrypt);

export class Password {
	static async toHash(password: string) {
		//generates random string
		const salt = randomBytes(8).toString("hex");
		const buf = (await scryptAsync(password, salt, 64)) as Buffer;

		return `${buf.toString("hex")}.${salt}`;
	}

	static async compare(storedPassword: string, suppliedPassword: string) {
		const [hashedPassword, salt] = storedPassword.split(".");
		const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

		return buf.toString("hex") === hashedPassword;
	}
}
