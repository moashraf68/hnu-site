import PublicLayout from "./(public)/layout";
import HomePage, { metadata } from "./(public)/page";

export { metadata };

export default function RootHomePage() {
  return (
    <PublicLayout>
      <HomePage />
    </PublicLayout>
  );
}
