import { useGetMeQuery } from '../generated/graphql';

export function Header() {
  const { data: userData } = useGetMeQuery();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">Social Media App</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </a>
            <a href="/explore" className="text-gray-700 hover:text-blue-600 font-medium">
              Explore
            </a>
            <a href="/notifications" className="text-gray-700 hover:text-blue-600 font-medium">
              Notifications
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="btn-primary">
              Create Post
            </button>

            {userData?.me ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {userData.me.displayName[0]}
                </div>
                <span className="text-gray-700 font-medium">
                  {userData.me.displayName}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button className="btn-secondary">
                  Sign In
                </button>
                <button className="btn-primary">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}