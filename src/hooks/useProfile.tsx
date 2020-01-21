import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useToken } from './useToken';

interface Profile {
    readonly success: boolean;
    readonly email: string;
    readonly name: string;
    readonly grade: string;
    readonly isAdmin: boolean;
    readonly isBlocked: boolean;
    readonly root: boolean;
}

const context = createContext<Profile>({} as Profile);

export const ProfileProvider: React.FC = ({ children }) => {
    const [profile, setProfile] = useState<Profile>();
    const token = useToken();

    useEffect(() => {
        axios
            .get(`${config.ENDPOINT}/profile`, {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                }
            })
            .then((res) => {
                if (!res.data.success) {
                    const msg = res.data.message;
                    if (msg === 'jwt expired') {
                        token.refreshToken();
                    }
                }
                setProfile(res.data);
            })
            .catch((error) => {
                setProfile({ success: false } as Profile);
                console.log(`유저 정보를 가져오지 못했습니다. ${error}`);
            });
    }, [token]);

    return <context.Provider value={profile!}>{children}</context.Provider>;
};

export const useProfile = () => useContext(context);
