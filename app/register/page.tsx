import { registerUser } from "../actions/register";

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">
        Register
      </h1>

      <form
        action={registerUser}
        className="flex flex-col gap-4"
      >
        <input
          name="name"
          placeholder="Name"
          className="border p-2 rounded"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-black text-white p-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}