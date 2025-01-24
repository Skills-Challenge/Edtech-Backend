import { Request, Response } from 'express';
import { comparePassword } from '../utils/bcrypt';
import { generateToken, verifyToken } from '../utils/jwt';
import UserService from '../services/user.service';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Everything about your Users
 */
export default class AuthController {

  /**
   * @swagger
   * /auth/login:
   *  post:
   *   description: login user
   *   parameters:
   *     - in: body
   *       name: user
   *       description: user to login
   *       schema:
   *         type: object
   *         required:
   *           - email
   *           - password
   *         properties:
   *            email:
   *              type: string
   *            password:
   *              type: string
   *
   *   responses:
   *      200:
   *        description: Login successful
   *      400:
   *        description: Invalid email or password
   *      500:
   *        description: Internal Server Error
   */
  public static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("Here is the email: ", email);
    try {
      const user = await UserService.findUser(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await comparePassword(password, user.password!);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = await generateToken({ id: user._id });

      res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'none',
        secure: true,
        domain:
          process.env.HOST === 'localhost'
            ? 'localhost'
            : process.env.PROD_DOMAIN,
      });
      res.status(200).json({ message: 'success', user: user, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * @swagger
   * auth/signup:
   *  post:
   *    description: Create a new users
   *    parameters:
   *      - in: body
   *        name: user
   *        description: The user to register.
   *        schema:
   *          type: object
   *          required:
   *            - name
   *            - email
   *            - password
   *          properties:
   *            name:
   *              type: string
   *            email:
   *              type: string
   *            password:
   *              type: string
   *    responses:
   *      201:
   *        description: User created successfully
   *      400:
   *        description: User already exists
   *      500:
   *        description: Internal Server Error
   */

  public static signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const user = await UserService.findUser(email);
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const newUser = await UserService.createUser(name, email, password);

      const token = await generateToken({
        id: newUser._id,
      });
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'none',
        secure: true,
        domain:
          process.env.HOST === 'development'
            ? 'localhost'
            : process.env.PROD_DOMAIN,
      });

      res.status(201).json({ message: 'success', user: newUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * @swagger
   * /auth/me:
   *   get:
   *    descriptions: Get Logged in user
   *    responses:
   *     200:
   *       description: User details
   *     400:
   *       description: Unauthorized
   *     500: 
   *       description: Internal server error
   */

  public static getCurrentUser = async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { id } = await verifyToken(token);
      if (!id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const user = await UserService.findUserById(id);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      res.status(200).json({ user: user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * @swagger
   * /auth/logout:
   *  post:
   *    description: Logout user
   *    responses:
   *         200:
   *           description: Logout successful
   *         401:
   *           description: Unauthorized
   *         500:
   *           description: Internal server error
   */

  public static logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain:
          process.env.HOST === 'localhost'
            ? 'localhost'
            : process.env.PROD_DOMAIN,
      });

      res.status(200).json({ message: 'success' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
