import React from 'react';
import SquareButton from './index';

export default {
    title: 'Atomics',
    component: SquareButton
};

export const SquareButtonStory = () => {
    return <SquareButton>내용</SquareButton>;
};

SquareButtonStory.story = {
    name: 'SquareButton'
};
