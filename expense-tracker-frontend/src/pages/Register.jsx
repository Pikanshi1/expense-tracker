import { useForm } from "react-hook-form";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);

      console.log(response);

      alert("Registration Successful!");

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
        >

          <div>
            <label>Name</label>

            <input
              className="w-full border rounded-lg p-3"
              placeholder="Enter Name"
              {...register("name", {
                required: "Name is required",
              })}
            />

            <p className="text-red-500 text-sm">
              {errors.name?.message}
            </p>
          </div>

          <div>
            <label>Email</label>

            <input
              className="w-full border rounded-lg p-3"
              placeholder="Enter Email"
              {...register("email", {
                required: "Email is required",
              })}
            />

            <p className="text-red-500 text-sm">
              {errors.email?.message}
            </p>
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              className="w-full border rounded-lg p-3"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message:
                    "Password should be at least 6 characters",
                },
              })}
            />

            <p className="text-red-500 text-sm">
              {errors.password?.message}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            Register
          </button>

        </form>

      </div>
    </div>
  );
}

export default Register;