import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios, { AxiosResponse } from 'axios';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import config from '../config';
import Container from '../utils/ContainerUtils/Container';
import FontedTitle from '../atomics/Typography/FontedTitle';
import FontedMiddleText from '../atomics/Typography/FontedMiddleText';
import useToken from '../hooks/useToken';
import DefaultLayout from '../layouts/DefaultLayout';
import CbtNumberButton from '../atomics/CbtNumberButton';
import CbtAnswer from '../components/CbtAnswer';

const NumberButtonContainer = styled.div`
    margin: 1rem auto;
`;

const ProblemBoxStyle = styled.div`
    margin-bottom: 1rem;
`;

const TitleStyle = styled.div`
    & > p {
        margin-bottom: 0;
    }
`;

const SubTitleStyle = styled.div`
    & > p {
        margin-bottom: 2rem;
    }
`;

interface CbtParams {
    readonly subject: string;
    readonly grade: string;
    readonly times: string;
}

const Cbt: React.FC<RouteComponentProps<CbtParams>> = ({ match }) => {
    const refreshToken = useToken();
    const [isLoading, setBeLoading] = useState(false);
    const [random, setRandom] = useState(0);
    const [overlapRandom, setOverlapRandom] = useState<number[]>([0]);
    const [data, setData] = useState<any[]>([]);
    const [userAnswer, setUserAnswer] = useState('');
    const [count, setCount] = useState(0);

    useEffect(() => {
        const { subject, grade, times } = match.params;

        axios
            .get(`${config.ENDPOINT}/problem/get/${subject}/${grade}/${times}`, {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                }
            })
            .then((res: AxiosResponse) => {
                if (!res.data.success) {
                    if (res.data.message === '토큰이 만료되었습니다.') {
                        refreshToken();
                        return;
                    }

                    alert(res.data.message);
                    return;
                }

                setCount(res.data.problems.length);
                setData(res.data.problems);
            })
            .catch((err) => {
                console.log(err);
            });

        setBeLoading(true);
    }, [match.params, refreshToken]);

    const pickRandomNumber = () => {
        if (overlapRandom.length === count) {
            alert('모든 문제를 풀었습니다. 새로고침하여 새로 시작할 수 있습니다.');
            return;
        }

        let rand = Math.floor(Math.random() * count);

        while (overlapRandom.includes(rand)) {
            rand = Math.floor(Math.random() * count);
        }

        setOverlapRandom((arr) => [...arr, rand]);
        setRandom(rand);
    };

    const checkAnswerUsingValue = (value: string | number) => {
        const answer = isLoading && data[random] !== undefined ? data[random].answer : '';

        if (value.toString() === answer) {
            alert('정답입니다!');
            pickRandomNumber();
        } else {
            alert('오답입니다. 다시 한번 시도해보세요.');
        }

        setUserAnswer('');
    };

    const checkAnswer = () => {
        if (userAnswer === undefined || userAnswer === '') {
            alert('정답을 입력해주세요.');
            return;
        }

        checkAnswerUsingValue(userAnswer);
    };

    let exp = '불러오는 중입니다...';
    const expOfAuthor = isLoading && data[random] !== undefined ? data[random].author : '불러오는 중';

    if (isLoading && data[random] !== undefined) {
        exp = data[random].contents;
    } else if (count === 0) {
        exp = '<h3>해당 카테고리에 맞는 문제가 없습니다.</h3>';
    }

    return (
        <DefaultLayout>
            <Container>
                <TitleStyle>
                    <FontedTitle>{isLoading ? random + 1 : '0'}번 문제</FontedTitle>
                </TitleStyle>
                <SubTitleStyle>
                    <FontedMiddleText>작성자: {expOfAuthor}</FontedMiddleText>
                </SubTitleStyle>

                <ProblemBoxStyle dangerouslySetInnerHTML={{ __html: exp }} />

                <hr />

                <NumberButtonContainer>
                    <CbtNumberButton onClick={() => checkAnswerUsingValue(1)}>1번</CbtNumberButton>
                    <CbtNumberButton onClick={() => checkAnswerUsingValue(2)}>2번</CbtNumberButton>
                    <CbtNumberButton onClick={() => checkAnswerUsingValue(3)}>3번</CbtNumberButton>
                    <CbtNumberButton onClick={() => checkAnswerUsingValue(4)}>4번</CbtNumberButton>
                    <CbtNumberButton onClick={() => checkAnswerUsingValue(5)}>5번</CbtNumberButton>
                </NumberButtonContainer>

                <CbtAnswer
                  answerValue={userAnswer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserAnswer(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter') checkAnswer();
                    }}
                  onButtonClick={checkAnswer}
                />
            </Container>
        </DefaultLayout>
    );
};

export default withRouter(Cbt);
