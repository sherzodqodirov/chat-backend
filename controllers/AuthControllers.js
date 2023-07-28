import UserModel from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        const {firstname, lastname, email, password} = req.body;

        const errors = {};

        if (!firstname) {
            errors.firstname = {message: 'First name is required'};
        }
        if (!lastname) {
            errors.lastname = {message: 'Last name is required'};
        }
        if (!email) {
            errors.email = {message: 'Email is required'};
        }
        if (!password) {
            errors.password = {message: 'Password is required'};
        }
        if (!req.file) {
            errors.file = {message: 'Image file is required'};
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }
        console.log(req.file)
        const isUsed = await UserModel.findOne({email});

        if (isUsed) {
            return res.status(300).json({message: 'User already registered'});
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = await UserModel.create({
            firstname,
            lastname,
            email,
            password: hash,
            profilePicture: `http://localhost:${process.env.PORT}/static/${req.file.filename}`,
        });

        const token = jwt.sign({newUser}, process.env.JWT_SECRET, {expiresIn: '30d'});

        return res.status(201).json({
            token,
            message: 'User registered',
        });
    } catch (e) {
        return res.status(500).json({message: 'Error registering user'});
    }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const errors = {};

        if (!email) {
            errors.email = {message: 'Email is required'};
        }

        if (!password) {
            errors.password = {message: 'Password is required'};
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        const user = await UserModel.findOne({email});

        if (!user) {
            return res.status(401).json({message: 'Email not found'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({message: 'Incorrect password'});
        }

        const token = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '30d'});

        return res.status(200).json({
            token,
            message: 'Login success',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Error logging in'});
    }
};

export const allUsers=async (req, res) => {
    try {
        const {id}=req.params

        const userData=await UserModel.find({ _id: {$ne: id} } )

        if (!userData){
            return res.status(404).json({message: 'Users not found'});
        }

        return res.status(200).json(userData);
    }catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Error users '});
    }
}
export const oneUser=async (req, res) => {
    try {
        const {id}=req.params

        const userData=await UserModel.findOne({ _id:  id } )

        if (!userData){
            return res.status(404).json({message: 'Users not found'});
        }

        return res.status(200).json(userData);
    }catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Error users '});
    }
}

