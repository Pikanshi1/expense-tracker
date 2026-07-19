const Budget = require("../models/Budget");
const {
  createNotification,
} = require("./notificationController");

const setBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;

    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    let budget = await Budget.findOne({
      user: req.user.id,
      category,
      month,
      year,
    });

    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({
        user: req.user.id,
        category,
        amount,
        month,
        year,
      });
    }

    await createNotification(
  req.user.id,
  "Budget Updated",
  `${category} budget has been updated successfully.`,
  "success"
);

    res.json({
      message: "Budget Saved",
      budget,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBudgets = async (req, res) => {
  try {

    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const budgets = await Budget.find({
      user: req.user.id,
      month,
      year,
    });

    res.json(budgets);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteBudget = async (req,res)=>{

const budget=await Budget.findById(req.params.id);

if(!budget){
return res.status(404).json({
message:"Budget not found"
});
}

await budget.deleteOne();

res.json({
message:"Budget Deleted"
});

};


module.exports = {
  setBudget,
  getBudgets,
  deleteBudget,
};