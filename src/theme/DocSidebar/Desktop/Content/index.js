import React from 'react';
import Content from '@theme-original/DocSidebar/Desktop/Content';
import SearchBar from '@theme/SearchBar';

// Search heads the docs sidebar; the tree scrolls beneath it.
export default function ContentWrapper(props) {
  return (
    <>
      <div className="sidebar-search"><SearchBar /></div>
      <Content {...props} />
    </>
  );
}
