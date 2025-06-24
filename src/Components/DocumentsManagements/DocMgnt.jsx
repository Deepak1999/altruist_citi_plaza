import React, { useEffect, useMemo, useState } from 'react'
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { toast, ToastContainer } from 'react-toastify';
import { usePagination, useTable } from 'react-table';

const DocMgnt = () => {

    const [fileName, setFileName] = useState('');
    const [fileDescription, setFileDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [viewDocumentTableData, setViewDocumentTableData] = useState([]);
    const MAX_FILE_SIZE_MB = 50;

    const handleGetDocumentsFile = async () => {

        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/documents/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const { statusCode, description } = data.statusDescription;

                if (statusCode === 200) {
                    setViewDocumentTableData(data.documentList || []);
                } else {
                    toast.error(description || 'failed to fetch data');
                }
            } else {
                toast.error('failed to fetch data with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error during fetch data: ' + error.message);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            toast.warning('File size exceeds 50 MB limit');
            e.target.value = null;
            return;
        }
        setSelectedFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.error('User ID is missing in localStorage.');
            return;
        }

        if (!selectedFile) {
            toast.warning('Please select a file.');
            return;
        }

        if (selectedFile.size > 50 * 1024 * 1024) {
            toast.warning('File size exceeds 50MB limit.');
            return;
        }

        const formData = new FormData();
        formData.append('name', fileName);
        formData.append('desc', fileDescription);
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`${ApiBaseUrl}/documents/upload`, {
                method: 'POST',
                headers: {
                    userId: userId
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok && data?.statusDescription?.statusCode === 200) {
                toast.success(data?.statusDescription?.description || 'File uploaded successfully!');
                handleReset();
                handleGetDocumentsFile();
            } else {
                toast.warning(data?.statusDescription?.description || 'Failed to upload file.');
            }
        } catch (error) {
            toast.error('Error: ' + error.message);
        }
    };

    const columns = useMemo(() => [
        { Header: 'File Name', accessor: 'docName' },
        { Header: 'File Description', accessor: 'docDesc' },
        { Header: 'Created By', accessor: 'createdBy' },
        {
            Header: 'Created DateTime',
            accessor: 'createdAt',
            Cell: ({ value }) => {
                if (!value) return '-';
                const localDate = new Date(value).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                });
                return localDate;
            }
        },
        {
            Header: 'Action',
            Cell: ({ row }) => {
                const { docName } = row.original;
                return (
                    <div className="d-flex justify-content-center">
                        <a
                            href={`${ApiBaseUrl}/documents/view?fileName=${docName}`}
                            className="btn btn-sm btn-primary me-2"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fa-solid fa-download"></i>
                        </a>
                        <a
                            href={`${ApiBaseUrl}/documents/view?fileName=${docName}`}
                            className="btn btn-sm btn-secondary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fa-solid fa-eye"></i>
                        </a>
                    </div>
                );
            }
        },
    ], []);


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        prepareRow,
        pageOptions,
        state: { pageIndex },
    } = useTable(
        { columns, data: viewDocumentTableData, initialState: { pageIndex: 0, pageSize: 5 } },
        usePagination
    );

    const handleReset = () => {
        setFileName('');
        setFileDescription('');
        setSelectedFile('');
    };

    useEffect(() => {
        handleGetDocumentsFile();
    }, []);

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Save Documents Attachment</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <label className="form-label">File Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={fileName}
                                                onChange={(e) => setFileName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">File Description</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={fileDescription}
                                                onChange={(e) => setFileDescription(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Upload File (Max 20MB)</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={handleFileChange}
                                                accept="*"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary me-3">Submit</button>
                                        <button type="reset" className="btn btn-secondary" onClick={handleReset}>Reset</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">View Documents Details</h5>
                                    {/* <i
                                        className="fa-solid fa-circle-down"
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleDownloadExcel}
                                    >
                                        <span className="ms-2">Download</span>
                                    </i> */}
                                </div>

                                <div className="table-responsive mb-3">
                                    <table {...getTableProps()} className="table table-striped m-0">
                                        <thead>
                                            {headerGroups.map(headerGroup => {
                                                const { key, ...groupProps } = headerGroup.getHeaderGroupProps();
                                                return (
                                                    <tr key={key} {...groupProps}>
                                                        {headerGroup.headers.map(column => {
                                                            const { key, ...colProps } = column.getHeaderProps();
                                                            return (
                                                                <th key={key} {...colProps}>
                                                                    {column.render('Header')}
                                                                </th>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </thead>

                                        <tbody {...getTableBodyProps()}>
                                            {page.map(row => {
                                                prepareRow(row);
                                                const { key, ...rowProps } = row.getRowProps();
                                                return (
                                                    <tr key={key} {...rowProps}>
                                                        {row.cells.map(cell => {
                                                            const { key, ...cellProps } = cell.getCellProps();
                                                            return (
                                                                <td key={key} {...cellProps}>
                                                                    {cell.render('Cell')}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span>
                                        Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
                                    </span>
                                    <div>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => previousPage()}
                                            disabled={!canPreviousPage}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => nextPage()}
                                            disabled={!canNextPage}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </main>
    );
};

export default DocMgnt