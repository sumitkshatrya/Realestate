const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} RealEstate. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with React, Vite, and TailwindCSS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;