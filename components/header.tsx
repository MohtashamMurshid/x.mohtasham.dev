import SignOutButton from "./SignOutButton";

export default function header() {
  return (
    <header className="sticky top-0 z-10 bg-black text-white p-4 border-b border-gray-800 flex flex-row justify-between items-center font-mono">
      <h1 className="text-xl font-bold tracking-tight">[X]•clone</h1>
      <SignOutButton />
    </header>
  );
}
