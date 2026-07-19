import { Link } from "react-router-dom";
import { FaChartPie, FaWallet, FaBullseye, FaArrowRight } from "react-icons/fa";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-5 bg-white/80 backdrop-blur shadow">
        <h1 className="text-2xl font-bold text-blue-600">
          Expense<span className="text-gray-800">Tracker</span>
        </h1>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl text-gray-700 hover:text-blue-600 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-24 bg-linear-to-br from-blue-50 via-white to-purple-50 grid md:grid-cols-2 gap-12 items-center">
        <div>
          Manage Your Money
          <h1 className="text-6xl font-extrabold leading-tight">
            <span className="text-blue-600"> Smarter</span>
          </h1>
          <p className="text-gray-600 mt-6 text-lg">
            Track expenses, manage savings goals, and understand your spending
            habits with an easy-to-use expense management system.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Register Now
            </Link>

            <Link to="/login" className="border px-6 py-3 rounded-lg">
              Login
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Monthly Overview</h2>

            <FaChartPie className="text-blue-600 text-2xl" />
          </div>

          <div className="mt-8 space-y-5">
            <div className="p-4 rounded-xl bg-green-50 flex justify-between">
              <span>Income</span>

              <b className="text-green-600">₹50,000</b>
            </div>

            <div className="p-4 rounded-xl bg-red-50 flex justify-between">
              <span>Expense</span>

              <b className="text-red-600">₹20,000</b>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 flex justify-between">
              <span>Savings</span>

              <b className="text-blue-600">₹30,000</b>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center">Everything You Need</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <FeatureCard
            title="Track Expenses"
            text="Record and categorize your daily transactions."
            icon={<FaWallet />}
          />

          <FeatureCard
            title="Savings Goals"
            text="Create goals and monitor your progress."
            icon={<FaBullseye />}
          />

          <FeatureCard
            title="Analytics"
            text="Understand your spending patterns."
            icon={<FaChartPie />}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-16 text-center">
        <h2 className="text-3xl font-bold">
          Take Control of Your Finances Today
        </h2>

        <p className="text-gray-600 mt-3">
          Start managing your expenses in a smarter way.
        </p>

        <Link
          to="/register"
          className="inline-block mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg"
        >
          Register
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-5">
        © 2026 Expense Tracker. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, text, icon }) {
  return (
    <div className="bg-white p-7 rounded-2xl shadow hover:shadow-xl transition">
      <div className="text-blue-600 text-3xl mb-4">{icon}</div>

      <h3 className="text-xl font-bold">{title}</h3>

      <p className="text-gray-600 mt-3">{text}</p>
    </div>
  );
}

export default Home;
