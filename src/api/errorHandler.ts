import { AxiosError } from 'axios';
import Error from '../error/Error';

const serverErrorHandler = (code: Error, message: string) => {
    alert('서버 오류가 발생하였습니다. 잠시후 다시 시도해주세요.\n문제가 지속될 경우 관리자에게 알려주세요.');
    console.log('ERROR', code, message);
};

// eslint-disable-next-line import/prefer-default-export
export const DefaultErrorHandler = (err: AxiosError) => {
    const { code, message } = err.response!.data;

    if (code === Error.JWT_EXPIRED) {
        return;
    }

    if (code === Error.JWT_INVALID) {
        return;
    }

    if (code === Error.REFRESH_EXPIRED) {
        return;
    }

    if (code === Error.SERVER_ERROR) {
        serverErrorHandler(code, message);
        return;
    }

    console.log(`ERROR ${code} ${message}`);
};
