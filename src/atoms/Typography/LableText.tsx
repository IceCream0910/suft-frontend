import React from 'react';
import styled from 'styled-components';

const TextStyle = styled.p`
    font-size: 14px;
    margin-left: 12px;
    margin-bottom: 4px;
    color: var(--color-gray-text);
`;
const LableText: React.FC = ({ children }) => <TextStyle>{children}</TextStyle>;

export default LableText;
