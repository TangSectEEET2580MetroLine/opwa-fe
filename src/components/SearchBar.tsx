import React from 'react';

type SearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder || "Search..."}
    style={{ width: '100%', padding: 8, marginBottom: 16, borderRadius: 6, border: '1px solid #d0d7de' }}
  />
);

export default SearchBar;