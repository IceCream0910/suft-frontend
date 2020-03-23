import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import CenterContainer from '../../../utils/ContainerUtils/CenterContainer';
import ErrorTitle from '../../../atomics/Typography/ErrorTitle';

const WarningStyle = styled.div`
    text-align: center;
`;

const NoPermissionError: React.FC = () => {
    return (
        <CenterContainer>
            <WarningStyle>
                <FontAwesomeIcon icon={faTimes} size="10x" />
                <br />
                <br />
                <ErrorTitle>403 권한없음!</ErrorTitle>
                <h1>해당 페이지에 접근할 권한이 없어요</h1>
                <h3>로그인이 되어있지 않거나 관리자가 아니에요</h3>
            </WarningStyle>
        </CenterContainer>
    );
};

export default NoPermissionError;
