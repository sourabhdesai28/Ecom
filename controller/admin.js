const Admin = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment')
require('dotenv').config()
const secreteKey = process.env.JWT_SECRET

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = {
      email: email,
      password: hashedPassword,
    }

    const signUp = await Admin.create(user)

    if (!signUp) {
      return res.status(404).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    res.status(200).json({
      signUp,
      message: 'User created successfully',
      success: true,
    })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await Admin.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(404).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      secreteKey,
      { expiresIn: '1h' },
    )

    res.status(200).json({
      token,
      message: 'Login successful',
      success: true,
    })
  } catch (error) {
    next(error)
  }
}

//subscription-check
exports.subscription = async (req, res, next) => {
  try {
    const admin = await Admin.findOne()

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    const subscriptionStartDate = moment(admin.createdAt)
    const currentDate = moment()

    const remainingDays = Math.max(
      0,
      subscriptionStartDate.add(1, 'year').diff(currentDate, 'days'),
    )

    const totalDays = 365

    return res.json({ remainingDays, totalDays })
  } catch (error) {
    next(error)
  }
}
