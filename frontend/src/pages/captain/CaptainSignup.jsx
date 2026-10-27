import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../../components/logo";
import apiRequest from "../../services/api";

export default function CaptainSignup() {
  const navigate = useNavigate();

  const [captain, setCaptain] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    vehicle: {
      color: "",
      licensePlate: "",
      capacity: "",
      vehicleType: "",
    },
    location: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Updates top-level fields:
  // name, email, password, phone and location
  const handleChange = (event) => {
    const { name, value } = event.target;

    setCaptain((previousCaptain) => ({
      ...previousCaptain,
      [name]: value,
    }));
  };

  // Updates fields inside captain.vehicle
  const handleVehicleChange = (event) => {
    const { name, value } = event.target;

    setCaptain((previousCaptain) => ({
      ...previousCaptain,
      vehicle: {
        ...previousCaptain.vehicle,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const requestBody = {
        ...captain,
        vehicle: {
          ...captain.vehicle,
          capacity: Number(captain.vehicle.capacity),
        },
      };

      const data = await apiRequest("/captains/signup", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      console.log("Captain registration response:", data);

      localStorage.setItem("captainToken", data.token);

      localStorage.setItem(
        "captain",
        JSON.stringify(data.captain)
      );

      navigate("/captains/profile");
    } catch (errorData) {
      console.error("Captain registration error:", errorData);

      setError(
        errorData.message ||
          errorData.error.msg ||
          "Captain registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full rounded border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-rose-400 focus:ring-1 focus:ring-rose-200";

  return (
    <main className="min-h-screen bg-gray-300 px-4 py-6">
      <section className="mx-auto w-full max-w-md rounded bg-white p-5 shadow-sm">
        <div className="">
          <Logo />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-rose-500">
            Become a Captain
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Add your personal and vehicle details to start driving with
            NovaRide.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Full name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={captain.name}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={captain.email}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={captain.password}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Phone number
            </label>

            <input
              id="phone"
              type="tel"
              name="phone"
              value={captain.phone}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter your phone number"
              autoComplete="tel"
              required
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Vehicle details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the vehicle you will use for rides.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="color"
                className="mb-1 block text-sm font-semibold text-gray-700"
              >
                Vehicle colour
              </label>

              <input
                id="color"
                type="text"
                name="color"
                value={captain.vehicle.color}
                onChange={handleVehicleChange}
                className={inputClasses}
                placeholder="For example, Red"
                required
              />
            </div>

            <div>
              <label
                htmlFor="licensePlate"
                className="mb-1 block text-sm font-semibold text-gray-700"
              >
                Licence plate
              </label>

              <input
                id="licensePlate"
                type="text"
                name="licensePlate"
                value={captain.vehicle.licensePlate}
                onChange={handleVehicleChange}
                className={inputClasses}
                placeholder="RJ06AB3110"
                required
              />
            </div>

            <div>
              <label
                htmlFor="capacity"
                className="mb-1 block text-sm font-semibold text-gray-700"
              >
                Capacity
              </label>

              <input
                id="capacity"
                type="number"
                name="capacity"
                value={captain.vehicle.capacity}
                onChange={handleVehicleChange}
                className={inputClasses}
                placeholder="Number of seats"
                min="1"
                max="8"
                required
              />
            </div>

            <div>
              <label
                htmlFor="vehicleType"
                className="mb-1 block text-sm font-semibold text-gray-700"
              >
                Vehicle type
              </label>

              <select
                id="vehicleType"
                name="vehicleType"
                value={captain.vehicle.vehicleType}
                onChange={handleVehicleChange}
                className={inputClasses}
                required
              >
                <option value="">Select vehicle</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="bike">Bike</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Current location
            </label>

            <input
              id="location"
              type="text"
              name="location"
              value={captain.location}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter your city or area"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-rose-500 px-4 py-3 text-lg font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating captain account..." : "Sign up as Captain"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have a captain account?{" "}
          <Link
            to="/login"
            className="font-semibold text-rose-500 hover:underline"
          >
            Login here
          </Link>
        </p>

        <div className="mt-6 border-t border-gray-200 pt-5 text-center">
          <p className="text-sm text-gray-600">
            Looking for a ride instead?
          </p>

          <Link
            to="/users/signup"
            className="mt-3 block w-full rounded border border-rose-500 px-4 py-3 font-semibold text-gray-700 transition hover:bg--50 hover:bg-rose-500 hover:text-white"
          >
            Sign up as a Rider
          </Link>
        </div>

        <p className="mt-8 text-xs leading-5 text-gray-500">
          By proceeding, you agree to receive account and ride-related calls
          and messages from NovaRide.
        </p>
      </section>
    </main>
  );
}