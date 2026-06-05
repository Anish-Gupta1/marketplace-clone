import { loginUser } from "../actions/login";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">
        Login
      </h1>

      <form
        action={loginUser}
        className="flex flex-col gap-4"
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="border p-2 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}