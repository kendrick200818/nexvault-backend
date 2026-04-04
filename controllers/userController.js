const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { country, idType } = req.body;
    const profilePic = req.file ? req.file.filename : undefined;

    const updateData = {};
    if (country) updateData.country = country;
    if (idType) updateData.idType = idType;
    if (profilePic) updateData.profilePic = profilePic;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Process deposit
exports.deposit = async (req, res) => {
  try {
    const { amount, method, transactionId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid deposit amount' });
    }

    if (!method || !['usdt', 'bank'].includes(method)) {
      return res.status(400).json({ message: 'Invalid deposit method' });
    }

    // Update user balance
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { totalBalance: amount } },
      { new: true }
    ).select('-password');

    // Send notification to customer care
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const adminEmails = ['kingsleyomogo4@gmail.com', 'kendrickomogo0@gmail.com'];
    for (const adminEmail of adminEmails) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: 'New Deposit Notification',
        text: `New deposit received:\n\nUser: ${user.name} (${user.email})\nAmount: $${amount}\nMethod: ${method.toUpperCase()}\nTransaction ID: ${transactionId || 'N/A'}\nNew Balance: $${user.totalBalance}`
      });
    }

    res.json({
      message: 'Deposit processed successfully',
      newBalance: user.totalBalance,
      amount: amount
    });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bank withdrawal request
exports.withdrawBank = async (req, res) => {
  try {
    const { country, bankType, bankName, accountHolder, accountNumber, swiftCode, amount } = req.body;

    // Validate required fields
    if (!country || !bankType || !bankName || !accountHolder || !accountNumber || !swiftCode || !amount) {
      return res.status(400).json({ message: 'All bank details and amount are required' });
    }

    // Validate amount
    if (amount < 50) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is $50' });
    }

    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check balance
    if (user.totalBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create withdrawal request (you might want to create a separate Withdrawal model)
    const withdrawalRequest = {
      userId: req.user.id,
      userName: user.name,
      userEmail: user.email,
      type: 'bank',
      amount: amount,
      bankDetails: {
        country,
        bankType,
        bankName,
        accountHolder,
        accountNumber,
        swiftCode
      },
      status: 'pending',
      requestedAt: new Date()
    };

    // Here you would typically save to a database and notify admin
    // For now, we'll just log it and deduct from balance
    console.log('Bank withdrawal request:', withdrawalRequest);

    // Deduct from user balance
    user.totalBalance -= amount;
    await user.save();

    // Send notification to admin (you would implement this)
    // await notifyAdmin(withdrawalRequest);

    res.json({
      message: 'Bank withdrawal request submitted successfully. Admin will process your request.',
      withdrawalId: Date.now().toString(),
      amount: amount
    });
  } catch (error) {
    console.error('Bank withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};