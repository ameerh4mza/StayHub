export default function ErrorCard() {
  return (
    <div className="max-w-9xl bg-card border border-border rounded-lg p-6 m-8 shadow-lg">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Error</h2>
        <p className="text-sm text-mutted text-center">
          An error occurred while fetching the data. Please try again later.
        </p>
      </div>
    </div>
  );
}