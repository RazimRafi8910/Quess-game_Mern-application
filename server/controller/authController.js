import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_KEY = process.env.JWT_KEY

export const login = async (req, res,next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(422).json({ success:false, error:true, message: "required cretentials" })
    }

    try {
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({ success:false, error:true, message: "Invalid Email or Passwrod"});
        }

        const authState = await bcrypt.compare(password, user.password);

        if (!authState) {
            return res.status(401).json({ success:false, error:true, message: "Invalid Email or Password" });
        }

        const jwtPayload = {
            user_id: user.id,
            username: user.username,
            role:user.role,
        }

        const token = jwt.sign(jwtPayload, JWT_KEY, {
            expiresIn: 60 * 60 * 24 * 7
        });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: "lax",
            
        })

        const responceUser = {
            username: user.username,
            email: user.email,
            role:user.role,
            id: user._id,
        }

        return res.status(200).json({ success:true, error: false, user: responceUser, message: "User login success" });
    } catch (error) {
        next(error)
    }
}

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: true, message: "needed cretential" });
        }

        // find user by username or email
        const isExistsUser = await User.find({ '$or': [{ email }, { username }] })
        
        if (isExistsUser.length) {
            return res.status(406).json({ error: true, message: "User already exists with username or email, Please Login" })
        }

        const hanshPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hanshPassword,
            role:'user'
        });

        if (!newUser) {
            return res.status(400).json({ error: true, message: "user not created" })
        }

        return res.status(200).json({
            error: false,
            user: newUser,
            message: "user created"
        })

    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    try {
        //access token: for future 
        const accessToken = req.headers['authorization']
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized User" });
        }

        res.clearCookie('token', { httpOnly: true })
        return res.status(200).json({success:true,message:"User Logout success"})
    } catch (error) {
        next(error)
    }
}

export const getUserDetails = async (req,res,next)=>{
    try {
        const user = req.user;
        let userDetails = await User.findById(user.user_id);
        if (!userDetails) {
            return res.status(401).json({ auth: false, message: "User not found" });
        }
        let responseUser = {
            username: userDetails.username,
            email: userDetails.email,
            role:userDetails.role,
            id: userDetails.id,
        }
        return res.status(200).json({ success: true, auth: true, userDetails: responseUser, message: "user found" });
        
    } catch (error) {
        next(error)
    }
}

export const refreshJWTToken = (req, res,next) => {
    const refreshToken = req.cookies['refreshToken']

    if (!refreshToken) return res.status(401).json({ auth: false, message: "Token is required" });

    const result = jwt.verify(refreshToken, JWT_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ auth: false, message: 'Invalid refresh Token' });
        return decoded
    })

    if (result != undefined) {
        let jwtPayload = {
            user_id: result.user_id,
            username: result.username,
            role:result.role,
        }
        let accessToken = jwt.sign(jwtPayload, JWT_KEY, {
            expiresIn:60,
        })
        let newRefreshToken = jwt.sign(jwtPayload, JWT_KEY, {
            expiresIn: 60 * 60 * 24 * 7
        });
        
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: "lax",
        })

        return res.status(200).json({
            auth: true,
            message: "user Token refreshed",
            accessToken
        });
    }
}
