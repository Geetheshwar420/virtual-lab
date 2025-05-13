import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Key, Hash, FileSignature, Shield, FileKey } from 'lucide-react';

const categories = [
  { name: 'Symmetric', icon: Lock, path: '/symmetric', subcategories: [
    { name: 'AES', path: '/symmetric/aes' },
    { name: 'DES', path: '/symmetric/des' }
  ]},
  { name: 'Asymmetric', icon: Key, path: '/asymmetric', subcategories: [
    { name: 'RSA', path: '/asymmetric' }
  ]},
  { name: 'Hash Functions', icon: Hash, path: '/hash', subcategories: [
    { name: 'SHA-256', path: '/hash/sha256' },
    { name: 'MD5', path: '/hash/md5' }
  ]},
  { name: 'Digital Signatures', icon: FileSignature, path: '/signatures', subcategories: [
    { name: 'ECDSA', path: '/signatures' }
  ]},
];

export function Navigation() {
  const [openCategory, setOpenCategory] = React.useState<string | null>(null);

  return (
    <nav className="bg-white dark:bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-8">
          {categories.map(({ name, icon: Icon, path, subcategories }) => (
            <div key={path} className="relative group">
              <button
                onClick={() => setOpenCategory(openCategory === name ? null : name)}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
              </button>
              
              {subcategories && openCategory === name && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  {subcategories.map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setOpenCategory(null)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}