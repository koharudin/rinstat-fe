'use client';
import { map } from 'lodash';
import { Fragment, ReactNode, useEffect, useState } from 'react';

interface ColsPropType {
    label: string;
    isIndex?: boolean;
    field: string;
    render?: (row: object, field: string, rowIndex: number) => ReactNode;
}
interface TablePropsType {
    url: string;
    cols: ColsPropType[];
}

const Pagination = ({ currentPage_,totalPages, onPageChange  }) => {
    const [currentPage, setCurrentPage] = useState(currentPage_);
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
      onPageChange(page); // Call the function passed from parent to handle data change
    };
  
    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxPagesToShow = 10;
      const half = Math.floor(maxPagesToShow / 2);
      let startPage = currentPage - half;
      let endPage = currentPage + half;
  
      // Adjust the start and end if the range goes beyond the total pages
      if (startPage < 1) {
        startPage = 1;
        endPage = maxPagesToShow;
      }
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - maxPagesToShow + 1;
      }
  
      // Ensure at least one page is shown
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    };
  
    return (
      <div className="pagination">
        {/* First Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
          className="page-btn"
        >
          First
        </button>
  
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="page-btn"
        >
          Previous
        </button>
  
        {/* Page Number Buttons */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`page-btn ${page === currentPage ? "active" : ""}`}
          >
            {page}
          </button>
        ))}
  
        {/* Next Button */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="page-btn"
        >
          Next
        </button>
  
        {/* Last Button */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="page-btn"
        >
          Last
        </button>
      </div>
    );
  };
export default (props: TablePropsType) => {
    const { cols, url } = props;
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPage,setTotalPage] = useState();

    const getData = async (page: number, searchField: string) => {
        setIsLoading(true);
        try {
            const params = {
                page: page,
                key: searchField,
            };
            // Construct the query string from params
            const queryString = new URLSearchParams(params).toString();

            // Append the query string to the base URL
            const fullUrl = `${url}?${queryString}`;
            // Melakukan request ke endpoint API
            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', // Sending data as JSON
                },
            });

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
        } finally {
            setIsLoading(false);
        }
    };
    const getDataPost = async (page: number, searchField: string) => {
        try {
            // Melakukan request ke endpoint API
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Sending data as JSON
                },
                body: {
                    page: page,
                    key: searchField,
                },
            });

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
        const fetchData = async () => {
            const result = await getData(1, 's');
            setData(result?.data);
            setMeta(result?.meta);
            setCurrentPage(result?.meta?.currentPage);
            setTotalPage(result?.meta?.totalPage);
        };
        fetchData();
    }, []);
    return (
        <div className="datatable">
            <div className="row">
                {JSON.stringify(meta)}
                <table className="datatable">
                    <thead>
                        <tr>
                            {props.cols.map((c, k) => {
                                if (c.isIndex) {
                                    return <th>No</th>;
                                }

                                return <th>{c?.label}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td style={{ textAlign: 'center' }} colSpan={cols.length}>
                                    Sedang Loading...
                                </td>
                            </tr>
                        )}
                        {!isLoading && data && data.length == 0 && (
                            <tr>
                                <td style={{ textAlign: 'center' }} colSpan={cols.length}>
                                    Data tidak ditemukan
                                </td>
                            </tr>
                        )}
                        {!isLoading && data && data.length > 0 && (
                            <>
                                {data?.map((r, rk) => {
                                    return (
                                        <tr key={rk}>
                                            {cols.map((c, ck) => {
                                                if (c?.field == '__index') {
                                                    return <td key={ck}>{rk + 1}</td>;
                                                } else if (c?.render) {
                                                    return <td key={ck}>{c.render(r, c.field, rk)}</td>;
                                                } else {
                                                    return <td key={ck}>{r[c.field]}</td>;
                                                }
                                            })}
                                        </tr>
                                    );
                                })}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="row">
                <Pagination currentPage_={currentPage} totalPages={totalPage} onPageChange={(page)=>{
                    getData(page,"x");
                }} />
            </div>
        </div>
    );
};
