import '../styles/globals.css';
import { UserProvider } from '../context/UserContext';
import NavigationBar from '../components/NavigationBar';

export const metadata = {
  title: "What's This?",
  description: 'A forum for your antiques',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <NavigationBar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
