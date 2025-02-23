'use client';
import IconBell from '@/components/icon/icon-bell';
import { useEffect, useState } from 'react';

export default async () => {
    const [total, setTotal] = useState();
    const getData = async () => {
        try {
            // Melakukan request ke endpoint API
            console.log('fetching to  ' + process.env.NEXT_PUBLIC_BACKEND_URL);
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/rin/get-all-count-downloads');

            // Mengecek apakah respons statusnya 200 OK
            if (response.status === 200) {
                const data = await response.json(); // Mengambil data dari respons sebagai JSON
                console.log('Data received:', data);
                return data; // Mengembalikan data jika berhasil
            } else {
                console.error('Failed to fetch data. Status code:', response.status);
                return null; // Kembalikan null jika status bukan 200
            }
        } catch (error) {
            // Menangani error jika terjadi kesalahan pada request
            console.error('Error fetching data:', error);
            return null;
        }
    };
    useEffect(() => {
        const fetcData = async () => {
            const data = await getData();
            setTotal(data?.total);
        };
        fetcData();
    }, []);

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
            <div className="panel mt-6">Data {total}</div>
        </div>
    );
};
