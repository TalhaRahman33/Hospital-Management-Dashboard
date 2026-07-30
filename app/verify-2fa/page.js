import OTPForm from "./components/OTPForm";

export default function Verify2FAPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <OTPForm />
    </main>
  );
}