import React, { useState } from 'react';
import './App.css';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
}
    from '@material-ui/core';
import { Paper } from '@material-ui/core'
import XLSX from 'xlsx'

const EXTENSIONS = ['xlsx', 'xls', 'csv']

function App() {
    const [file, setFile] = useState();
    const [colDefs, setColDefs] = useState([])
    const [data, setData] = useState([])
    const [search, setSearch] = useState('')
    const [isUploaded, setIsUploaded] = useState(false)

    const getExention = (file) => {
        const parts = file.name.split('.')
        const extension = parts[parts.length - 1]
        return EXTENSIONS.includes(extension) // return boolean
    }

    const convertToJson = (headers, data) => {
        const rows = []
        data.forEach(row => {
            let rowData = {}
            row.forEach((element, index) => {
                rowData[headers[index]] = element
            })
            rows.push(rowData)

        });
        return rows
    }

    const importExcel = (e) => {
        const file = e.target.files[0]

        const reader = new FileReader()
        reader.onload = (event) => {
            //parse data

            const bstr = event.target.result
            const workBook = XLSX.read(bstr, { type: "binary" })

            //get first sheet
            const workSheetName = workBook.SheetNames[0]
            const workSheet = workBook.Sheets[workSheetName]
            //convert to array
            const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 })
            // console.log(fileData)
            const headers = fileData[0]
            const heads = headers.map(head => ({ title: head, field: head }));
            // const arrheads = Object.values(heads)
            setColDefs(heads)

            //removing header
            fileData.splice(0, 1)

            setData(convertToJson(headers, fileData))
            setIsUploaded(!isUploaded)
        }

        if (file) {
            if (getExention(file)) {
                reader.readAsBinaryString(file)
            }
            else {
                alert("Invalid file input, Select Excel, CSV file")
            }
        } else {
            setData([])
            setColDefs([])
        }
    }
    console.log(colDefs)
    console.log(data)

    const filteredData = data.filter((item) =>
        item['Part #'].toString().includes(search) ||
        // item['Alt.Part#'].toLowerCase().includes(search.toLowerCase()) ||
        item['Name'].toLowerCase().includes(search.toLowerCase()) ||
        item['Brand'].toLowerCase().includes(search.toLowerCase()) ||
        item['Model'].toLowerCase().includes(search.toLowerCase()) ||
        item['Engine'].toLowerCase().includes(search.toLowerCase()) ||
        item['Car'].toLowerCase().includes(search.toLowerCase()) ||
        // item['LOCATION A'].toLowerCase().includes(search.toLowerCase()) ||
        item['LOCATION A STOCK'].toString().includes(search) ||
        item['LOCATION B'].toLowerCase().includes(search.toLowerCase()) ||
        item[["LOC B STOCK "]].toString().includes(search) ||
        item['Unit'].toLowerCase().includes(search.toLowerCase()) ||
        item['Rate'].toString().includes(search) ||
        item['Value'].toString().includes(search)
        // item['Remarks'].toLowerCase().includes(search.toLowerCase())
    );
    console.log("filtereddata", filteredData)

    return (
        <div className="App">
            <div className='header'>
                <div>
                    <input type="file" onChange={importExcel} />
                    {/* <button onClick={importExcel}>IMPORT</button> */}
                </div>
                <div className='search'>
                    <label for="search">User Input:&nbsp;</label>
                    <input type='search' value={search} placeholder='search'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            {isUploaded &&
                <Paper sx={{ width: '100%' }}>
                    <Table stickyHeader sx={{ border: 2 }}>
                        <TableHead className='table-header'>
                            <TableRow sx={{ border: 2 }}>
                                {colDefs.map((col, i) => {
                                    return <TableCell key={i}>{col.title}</TableCell>
                                })
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((item, index) => (
                                < TableRow key={index} sx={{ border: 2 }}>
                                    <TableCell>{item['Part #']}</TableCell>
                                    <TableCell>{item['Alt.Part#']}</TableCell>
                                    <TableCell>{item['Name']}</TableCell>
                                    <TableCell>{item['Brand']}</TableCell>
                                    <TableCell>{item['Model']}</TableCell>
                                    <TableCell>{item['Engine']}</TableCell>
                                    <TableCell>{item['Car']}</TableCell>
                                    <TableCell>{item['location A']}</TableCell>
                                    <TableCell>{item['LOCATION A STOCK']}</TableCell>
                                    <TableCell>{item['LOCATION B']}</TableCell>
                                    <TableCell>{item[["LOC B STOCK "]]}</TableCell>
                                    <TableCell>{item['Unit']}</TableCell>
                                    <TableCell>{item['Rate']}</TableCell>
                                    <TableCell>{item['Value']}</TableCell>
                                    <TableCell>{item['Remarks']}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            }
        </div>
    );
}

export default App;
