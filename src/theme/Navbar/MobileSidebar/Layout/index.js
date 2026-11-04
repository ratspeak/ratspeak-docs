import React from 'react';
import Layout from '@theme-original/Navbar/MobileSidebar/Layout';
import SearchBar from '@theme/SearchBar';

// The phone drawer opens on search, under its header.
export default function LayoutWrapper({header, ...props}) {
  return <Layout {...props} header={<>{header}<div className="drawer-search"><SearchBar /></div></>} />;
}
