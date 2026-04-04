const User = require('../models/User');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user balance (admin only)
exports.updateBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { btc, eth, usdt } = req.body;

    // Calculate total balance
    const btcValue = parseFloat(btc) * 50000; // Approximate BTC price
    const ethValue = parseFloat(eth) * 3000;  // Approximate ETH price
    const usdtValue = parseFloat(usdt);
    const totalBalance = btcValue + ethValue + usdtValue;

    const user = await User.findByIdAndUpdate(id, {
      balance: { btc: parseFloat(btc), eth: parseFloat(eth), usdt: parseFloat(usdt) },
      totalBalance: totalBalance
    }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};