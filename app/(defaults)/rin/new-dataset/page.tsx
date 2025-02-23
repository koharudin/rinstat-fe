'use client';
import DatatableRemote from '@/components/datatables/datatable-remote-mantine';
import IconBell from '@/components/icon/icon-bell';
import IconXCircle from '@/components/icon/icon-x-circle';
import Tippy from '@tippyjs/react';
import { title } from 'process';
const formatDate = (date: string | number | Date) => {
    if (date) {
        const dt = new Date(date);
        const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
        return day + '/' + month + '/' + dt.getFullYear();
    }
    return '';
};
const randomColor = () => {
    const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
    const random = Math.floor(Math.random() * color.length);
    return color[random];
};

const randomStatus = () => {
    const status = ['PAID', 'APPROVED', 'FAILED', 'CANCEL', 'SUCCESS', 'PENDING', 'COMPLETE'];
    const random = Math.floor(Math.random() * status.length);
    return status[random];
};
const onPageChange = (page: number, setRowsData: () => void) => {
    console.log('Load Data...');
    setRowsData([{}, {}, {}]);
};

export default () => {
    return (
        <div>
            <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconBell />
                </div>
                <span className="ltr:mr-3 rtl:ml-3">Documentation: </span>
                <a href="https://www.npmjs.com/package/mantine-datatable" target="_blank" className="block hover:underline" rel="noreferrer">
                    https://www.npmjs.com/package/mantine-datatable
                </a>
            </div>
            <div className="panel mt-6">
                <DatatableRemote useIndex={true}
                    url={process.env.NEXT_PUBLIC_BACKEND_URL + '/rin/list-new-user-affiliation'}
                    cols={[
                        { accessor: 'month_year', title: 'Month/Year' },
                        { accessor: 'affiliation', title: 'Affiliation', sortable: false },
                    ]}
                ></DatatableRemote>
            </div>
        </div>
    );
};
