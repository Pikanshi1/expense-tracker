import { useForm } from "react-hook-form";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
       login(response.user, response.token);
      
      alert("Login Successful!");


      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Login
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
        >

          <div>
            <label>Email</label>

            <input
              className="w-full border rounded-lg p-3"
              {...register("email", {
                required: "Email is required",
              })}
            />

            <p className="text-red-500">
              {errors.email?.message}
            </p>
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              className="w-full border rounded-lg p-3"
              {...register("password", {
                required: "Password is required",
              })}
            />

            <p className="text-red-500">
              {errors.password?.message}
            </p>
          </div>

          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;