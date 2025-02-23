"use client"
import DatatableRemote from '@/components/datatables/datatable-remote-mantine';
import IconBell from '@/components/icon/icon-bell';
import { title } from 'process';

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
                <DatatableRemote
                    url={process.env.NEXT_PUBLIC_BACKEND_URL + '/rin/list-new-user-affiliation'}
                    cols={[
                        { label: '#', field: '__index', isIndex: true },
                        {
                            label: 'Month/Year',
                            field: 'month_year',
                            render: function  (row,field,rowIndex) {
                                return <span className='label label-info'>{row?.month_year}</span>;
                            },
                        },
                        { label: 'Affiliation', field: 'affiliation' },
                    ]}
                ></DatatableRemote>
            </div>
        </div>
    );
};
