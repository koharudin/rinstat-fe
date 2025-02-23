import React, { ReactNode, useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable'; // Importing DataTable from mantine-datatable
import { Pagination, Loader } from '@mantine/core';

interface ColumnProps {
    field: string;
    label: string;
    render: (row: object, colIndex: number, rowIndex: number) => ReactNode;
}
interface RemoteDataProps {
    url: string;
    cols: ColumnProps[];
}
const RemoteDataTable = (props: RemoteDataProps) => {
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('name'); // Example sorting key

    const fetchData = async () => {
        setLoading(true);
        try {
            // Replace with your backend API URL and adjust query parameters as needed
            const response = await fetch(props.url + `?page=${currentPage}&limit=${pageSize}&sortBy=${sortBy}`);
            const result = await response.json();

            // Assuming the API returns an object like { data: [], totalCount: number }
            setData(result.data);
            setTotalCount(result.meta?.totalData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, sortBy]); // Re-fetch when these dependencies change

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when page size changes
    };

    const handleSortChange = (sort) => {
        // Handle sorting logic (assuming sorting on the 'name' column for example)
        const newSortBy = sort.field;
        setSortBy(newSortBy);
    };

    return (
        <div>
            {loading ? (
                <Loader size="xl" />
            ) : (
                <DataTable columns={props.cols} records={data} recordsPerPage={pageSize} totalRecords={totalCount} onSortChange={handleSortChange} onPageChange={handlePageChange} />
            )}
            <br></br>
            <Pagination total={Math.ceil(totalCount / pageSize)} page={currentPage} onChange={handlePageChange} />
        </div>
    );
};

export default RemoteDataTable;
