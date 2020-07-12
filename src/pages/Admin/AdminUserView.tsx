import React, { useEffect, useState } from 'react';
import cogoToast from 'cogo-toast';
import styled from 'styled-components';
import FontedTitle from '../../atomics/Typography/FontedTitle';
import AdminLayout from '../../layouts/AdminLayout';
import useSelect from '../../hooks/useSelect';
import { useProfile } from '../../hooks/useProfile';
import UserApi from '../../api/User';
import Table from '../../components/Table';

const TableWrap = styled.div`
    margin-bottom: 1rem;
`;

const CheckboxWrapStyle = styled.div`
    text-align: center;
`;

const BlockButtonStyle = styled.button`
    margin-bottom: 15px;
    border: none;
    border-radius: 10px 0px 0px 10px;
    width: 150px;
    height: 35px;
    color: #ffffff;
    background: var(--color-red);
    cursor: pointer;
`;

const UnBlockButtonStyle = styled.button`
    margin-bottom: 15px;
    border: none;
    border-radius: 0px 10px 10px 0px;
    width: 150px;
    height: 35px;
    color: #ffffff;
    background: var(--color-blue);
    cursor: pointer;
`;

const AdminUserView: React.FC = () => {
    const [data, setData] = useState<[]>([]);
    const [check, rowManager] = useSelect();
    const profile = useProfile();

    const refreshUser = () => {
        UserApi.all().then((res) => {
            setData(res.data.data);
        });
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const blockUsers = () => {
        const { selected } = check;

        if (Object.keys(selected).length === 0) {
            cogoToast.warn('차단 할 유저를 선택해주세요.');
            return;
        }

        const isReal = window.confirm(`${Object.keys(selected).length}명을 차단 하시겠습니까?`);

        if (!isReal) return;

        let failedFlag = false;

        Object.keys(selected).forEach((key: string) => {
            if (!selected[key]) return;
            if (key === profile!!.email) {
                cogoToast.error('자기 자신은 차단 할 수 없습니다.');
                failedFlag = true;
                return;
            }

            UserApi.block(key).then(() => {
                refreshUser();
                rowManager.uncheckAllRow();
            });
        });

        if (!failedFlag) cogoToast.success(`${Object.keys(selected).length}명 차단 완료`);
    };

    const unBlockUsers = () => {
        const { selected } = check;

        if (Object.keys(selected).length === 0) {
            cogoToast.warn('차단 해제 할 유저를 선택해주세요.');
            return;
        }

        const isReal = window.confirm(`${Object.keys(selected).length}명을 차단 해제 하시겠습니까?`);

        if (!isReal) return;

        Object.keys(selected).forEach((key: string) => {
            if (!selected[key]) return;

            UserApi.unblock(key).then(() => {
                refreshUser();
                rowManager.uncheckAllRow();
            });
        });

        cogoToast.success(`${Object.keys(selected).length}명 차단 해제 완료`);
    };

    const columns = [
        {
            id: 'checkbox',
            accessor: 'checkbox',
            Header: () => {
                return (
                    <CheckboxWrapStyle>
                        <input
                          type="checkbox"
                          checked={check.selectAll === 1}
                          ref={(input) => {
                                if (input) {
                                    // eslint-disable-next-line
                                    input.indeterminate = check.selectAll === 2;
                                }
                            }}
                          onChange={() => rowManager.toggleAllRow(data, 'email')}
                        />
                    </CheckboxWrapStyle>
                );
            },
            Cell: ({ row }: any) => {
                return (
                    <CheckboxWrapStyle>
                        <input
                          type="checkbox"
                          checked={check.selected[row.original.email]}
                          onChange={() => rowManager.toggleRow(row.original.email)}
                        />
                    </CheckboxWrapStyle>
                );
            },
            sortable: false,
            width: 45
        },
        {
            Header: '이메일',
            accessor: 'email',
            width: 250
        },
        {
            Header: '이름',
            accessor: 'name'
        },
        {
            Header: '학년',
            accessor: 'grade'
        },
        {
            Header: '관리자',
            accessor: 'isAdmin',
            Cell: ({ row }: any) => {
                return row.original.isAdmin ? 'YES' : 'NO';
            }
        },
        {
            Header: '차단',
            accessor: 'isBlocked',
            Cell: ({ row }: any) => {
                return row.original.isBlocked ? 'YES' : 'NO';
            }
        },
        {
            Header: '가입 수락일',
            accessor: 'createdAt'
        },
        {
            Header: '정보 변경일',
            accessor: 'updatedAt'
        },
        {
            Header: '가입 요청일',
            accessor: 'registeredAt'
        }
    ];

    return (
        <AdminLayout>
            <FontedTitle>유저 관리</FontedTitle>
            <div>
                <BlockButtonStyle onClick={blockUsers}>차단</BlockButtonStyle>
                <UnBlockButtonStyle onClick={unBlockUsers}>차단 해제</UnBlockButtonStyle>
            </div>

            <TableWrap>
                <Table columns={columns} data={data} />
            </TableWrap>
        </AdminLayout>
    );
};

export default AdminUserView;
