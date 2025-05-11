import App from "./app";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Mobile message */}
      <div className="md:hidden flex flex-col items-center justify-center h-screen">
        Mobile view is not supported yet
        <div className="text-sm text-muted-foreground">
          Please use a desktop browser for the full experience.
        </div>
      </div>

      {/* Desktop view */}
      <App />
    </div>
  );
}
