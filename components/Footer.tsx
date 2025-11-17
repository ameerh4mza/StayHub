export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-background shadow-inner mt-8">
      <div className="px-8 py-4 text-center text-sm text-foreground">
        &copy; {currentYear} StayHub. All rights reserved.
      </div>
    </footer>
  );
}
