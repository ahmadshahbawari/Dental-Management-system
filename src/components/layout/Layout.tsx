import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function Layout() {
  return (
    // Full viewport height, no overflow on the root
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar: fixed height, no shrink, independent scroll if needed */}
      <Sidebar />

      {/* Right column: topbar + scrollable main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* TopBar stays sticky at the top of the right column */}
        <TopBar />

        {/* Main content scrolls independently */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
