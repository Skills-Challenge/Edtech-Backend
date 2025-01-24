import { Request, Response } from 'express';
import { comparePassword } from '../utils/bcrypt';
import { verifyToken } from '../utils/jwt';
import { sendEmail } from '../utils/nodemailer';
import User from '../models/user.model';
import UserService from '../services/user.service';
import { generateVerificationCode } from '../utils';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Everything about your users
 */
export default class UserController {

  /**
   * @swagger
   * /user/update:
   *  put:
   *    description: Update user profile
   *    parameters:
   *       - in: body
   *         name: user
   *         description: Update user profile
   *         schema:
   *            type: object
   *            required:
   *               - name
   *               - email
   *            properties:
   *                name:
   *                  type: string
   *                email:
   *                  type: string
   *    responses:
   *      200:
   *       description: User updated successfully
   *      400:
   *       description: validation errors
   *      401:
   *        description: Unauthorized
   *      500:
   *       description: Internal Server Error
   */

  public static updateProfile = async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { id } = await verifyToken(token);
      const user = await UserService.findUserById(id);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      await user.save();

      res.status(200).json({ message: 'success', user: user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  /**
   * @swagger
   * /user/update-password:
   *   put:
   *    description: Update user password
   *    parameters:
   *      - in: body
   *        name: user
   *        description: Update user password
   *        schema:
   *         type: object
   *         required:
   *            - currentPassword
   *            - newPassword
   *         properties:
   *             currentPassword:
   *                type: string
   *             newPassword:
   *                type: string
   *    responses:
   *         200:
   *          description: Password updated successfully
   *         400:
   *          description: Invalid credentials
   *         401:
   *          description: Unauthorized
   *         500:
   *          description: Internal Server Error
   */

  public static updatePassword = async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { id } = await verifyToken(token);
      const user = await UserService.findUserById(id);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      user.password = newPassword;
      await user.save();
      res.status(200).json({ message: 'success' });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  };
  /**
   * @swagger
   * /user/send-verification-code:
   *  post:
   *    description: Send verification code to user email
   *    parameters:
   *        - in: body
   *          name: user
   *          description: Send verification code to user email
   *          schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *    responses:
   *      200:
   *       description: Verification code sent successfully
   *      400:
   *       description: Email not found
   *      401:
   *       description: Unauthorized
   *      500:
   *       description: Internal Server Error
   */
  public static sendVerificationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          message: 'Email is required',
        });
      }

      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          message: 'Invalid Email',
        });
      }
      // generate verification code of 6 digits
      let verificationCode = generateVerificationCode();
      user.verificationCode!.code = verificationCode.toString();
      user.verificationCode!.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await user.save();
      const { sent } = await sendEmail({
        to: email,
        body: `your verification code is : ${verificationCode.toString()}`,
        subject: ' Verify your account',
      });
      if (sent) {
        res.status(200).json({
          message: 'success',
        });
      } else {
        res.status(500).json({
          message: 'Failed to send verification code',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  };


  /**
   * @swagger
   * /user/validate-verification-code:
   *  post:
   *   description: Validate verification code
   *   parameters:
   *     - in: body
   *       name: user
   *       description: Validate verification code
   *       schema:
   *         type: object
   *         required:
   *          - code
   *          - email
   *         properties:
   *           code:
   *             type: string
   *           email:
   *             type: string
   *   responses:
   *       200:
   *        description: Verification code validated successfully
   *       400:
   *        description: Invalid verification code
   *       401:
   *        description: Unauthorized
   *       500:
   *        description: Internal Server Error
  */

  public static validateVerificationCode = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { code, email } = req.body;
      if (!code || !email) {
        return res.status(400).json({
          missingFields: {
            code: !code ? 'missing' : 'present',
            email: !email ? 'missing' : 'present',
          },
        });
      }

      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          message: 'Invalid email ',
        });
      }
      // check if code has expired
      // @ts-ignore
      if (user.verificationCode!.expiresAt.getTime() < Date.now()) {
        return res.status(400).json({
          expired: true,
          message: 'Verification code has expired',
        });
      }
      if (user.verificationCode!.code !== code) {
        return res.status(400).json({
          invalidCode: true,
          message: 'Invalid verification code',
        });
      }
      user.verificationCode!.code = 'default';
      user.verificationCode!.expiresAt = new Date(0);

      await user.save();

      res.status(200).json({
        message: 'success',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  };

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     description: Reset user password
 *     parameters:
 *       - in: body
 *         description: Reset user password
 *         name: user
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid email
 *       500:
 *         description: Internal Server Error
 */

  public static resetPassword = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          missingFields: {
            email: !email ? 'missing' : 'present',
            password: !password ? 'missing' : 'present',
          },
        });
      }
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          message: 'Invalid email',
        });
      }
      user.password = password;
      await user.save();

      res.status(200).json({
        message: 'success',
      });
    } catch (error) {
      console.log(error);
    }
  };
}
