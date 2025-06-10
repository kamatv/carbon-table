// eslint-disable-next-line
import { Download } from "@carbon/icons-react";
import { Button, DataTable, InlineLoading, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableHeader, TableRow, TableToolbar, TableToolbarAction, TableToolbarContent, 
    TableToolbarMenu, TableToolbarSearch 
} from "@carbon/react";
import React, { useEffect, useState } from "react";
import TableFilterComponent from "./data-table-filter";

/*
    tableid -> identify the table 
    name -> name of the table
    dataUrl -> to get table data
    filterUrls -> Array of objects with Url, label(for filter heading), and key(should match header key, preferable) to get options for the filter.
    headers -> Array of objects with key, header(name of the header),
         sortable (column has sort functionality), type (indicate type of cell)
*/

const TableComponent =({
    tableid,
    name,
    headers,
    dataUrl, 
    filterUrls,
}) =>{
    const [loading, setLoading ] =useState(true)
    const [rows, setRows ] =useState([])    //Has all the data from initial api call
    const [filteredRows, setFilteredRows ] =useState([]) //Has filtered data; filtering by component
    const [filters, setFilters ] = useState([])     //Has filter data for displaying in the popover
    const [selectedfilters, setSelectedFilters ] = useState([]) //Has filters selected by user

    const getTableData = async () => {
         setLoading(true)
        //function to do api call to fetch table data based on the dataUrl provides, also check if filters are selected
        try{
            let url = dataUrl
            if(selectedfilters.length > 0){
                //format and append filters as per required as query params to url for filtering.
                /* Sample api to show change in data on adding a filter - added additonal query params for reference */
                if(tableid === "products"){
                    url+="/category/smartphones?sortBy=title&order=asc"; 
                }
            };
            const response = await fetch(url);
            const jsondata = await response.json();
            setRows(jsondata[tableid] )//To be updated as per response.
            setFilteredRows(jsondata[tableid] ) //since we want to filter based on already fetched data.
            setLoading(false)
        }catch(error){
            console.log("Error Fetching data ",error);
        }      
    }

    const getFilterOptions = async () => {
        //function to do api call to fetch filter options based on the filterUrls provides

        const filters = []
        //for each filter url fetch the options and add to the filter
        const filterPromises = filterUrls.map(async item => {
            const response = await fetch(item.url);
            const filterData = await response.json();

            if(filterData && filterData.length > 0){
                const filter = filterData?.slice(0, 7) //.filter(s => (typeof s === "string")? s : s.slug.includes("men"))
                .map((d, id) => ({
                    ...d,
                    id: id,
                    key: (typeof d === "string")? d : d.slug,
                    label: (typeof d === "string")? d : d.name
                }));

                return {
                    key: item.key,
                    label: `Select ${item.key}`,
                    options: filter
                };
            }
            
        });

        const results = await Promise.all(filterPromises);
        filters.push(...results);
        return filters
    }

    useEffect(()=>{
       
        const filters = []
        getTableData();

        if(filterUrls && filterUrls.length>0){
            //do api and update filters options
            getFilterOptions().then(filterOps => filters.push(...filterOps))
        }

        if(name === "Users" || name === "Products" ){
            //append custom gender filters
            filters.push({
                key:"gender",
                label: "Gender",
                options: [{
                    key:"male",
                    label: "Male"
                },{
                    key:"female",
                    label: "Female"
                }]
            })
        }

        setFilters(filters);
    },[tableid])

    useEffect(()=>{
        //call api to update the table data based on filters.
        /* Method1: (reuse) call the fetch table data api function - (prefered for single api with filters in query params */
        if(tableid === "products"){ //example: filter on selected filters in products table - single api.
            getTableData()
        }

        /* Method2: filter based api calls for fitlering - multiple api calls for each filter selected  */
        if(tableid === "recipes"){
            if(selectedfilters.length > 0){
                //SAMPLE CODE: currently works for only one filter category ie "tags"; will require another loop to iterate thru others
                const tagOptions = selectedfilters.find(item => item.key ==='tags').options
                if(tagOptions && tagOptions.length>0){
                    const promises = tagOptions.map(opt => fetch(`${dataUrl}/tag/${opt}`).then(res => res.json()) )
                    Promise.all(promises)
                    .then(results => {
                        const recipes = results.map(res => res.recipes)
                        console.log("resurecipesrecipeslts. ",recipes)
                        let filteredRows = [].concat(...recipes); // Combine all into one array if each is an array
                        setFilteredRows(filteredRows)
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    })
                }
            }else{
                setFilteredRows(...rows)
            }
        }

        /* Method3: sample filtering based on current table data available */
        if(tableid === "users"){ //example: filter on date of birth range in users table.
            if(selectedfilters.length > 0){
                let filteredRows = [...rows]
                //for each filter, further filter the data where filter.key == headername
                selectedfilters.forEach(filter => {
                    filteredRows = filteredRows.filter(row => {
                        if(filter.key === 'date'){ //check range for date of birth
                            //NOTE: Hardcoded 'birthDate' as key due to mismatch in filter key and header/data key
                            const birthDate = new Date(row['birthDate'])
                            return birthDate >= filter.options[0] && birthDate <= filter.options[1]
                        }else{
                          return filter.options.includes(row[filter.key])  
                        }
                    })
                })
                setFilteredRows(filteredRows)
            }else{
                //refresh data with saved table data or re-fetch all data
                setFilteredRows(rows)
            }
        }  

    },[selectedfilters])

    const onInputChange =(searchtext) =>{
        console.log("search with text : ", searchtext)
        // make api call or filter on the existing data.
    }

    const handleToolbarAction= (action)=>{
        console.log("handleToolbarAction action ", action)
        if(action === "download"){
            downloadCSV(rows, `${name}_list`)
        }
    }

    const handleTableFilter= (selectedFilters)=>{
        setSelectedFilters(selectedFilters);
    }

    const handleOnResetFilter= ()=>{
        console.log("Resting filters!!!!")
        setSelectedFilters([])
    }

    const downloadCSV = (data, fileName) => {
        const headers = Object.keys(data[0]); // Extract headers from the first object
        const rows = data.map(obj => headers.map(header => obj[header]).join(",")); // Extract row values
        const csvContent = [headers.join(","), ...rows].join("\n"); // Combine headers and rows
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (<>
        {
            name && <h3>{name} - Table ( {filteredRows.length} )</h3>
        }
        { loading 
        ? <div style={{textAlign:"center", padding:"4rem"}}>
            {/* this shows loading animation when data is being fetch */}
            <InlineLoading
            description="Loading"
            iconDescription="Loading data..."
            />
        </div>
        :<>
            <TableContainer>
                <TableToolbar>
                    {/* 
                        Use <TableBatchActions/> and set of <TableBatchAction/> to integrate batch actions on row silection.
                    */}
                    <TableToolbarContent>
                        <TableToolbarSearch 
                            placeholder={"text to search"} 
                            onChange={onInputChange} />
                        <Button kind="ghost" onClick={() =>handleToolbarAction("download")}>
                            <Download></Download>
                        </Button>
                        {/* add more buttons with custon icons as per required on toolbar and provide the action as handleToolbarAction() to reuse function */}

                        {/* overflow menu with pre defined icon also available with the carbon table */}
                        <TableToolbarMenu> 
                            <TableToolbarAction onClick={() =>handleToolbarAction("add_row")}>
                                Add row
                            </TableToolbarAction>
                            <TableToolbarAction onClick={() =>handleToolbarAction("add_header")}>
                                Add header
                            </TableToolbarAction>
                        </TableToolbarMenu>
                        <TableFilterComponent filters={filters} 
                            onApplyFilter={(selectedFilters) => handleTableFilter(selectedFilters)}
                            onResetFilter={() => handleOnResetFilter()} />
                    </TableToolbarContent>
                </TableToolbar>
                <Table aria-label="data table" experimentalAutoAlign>
                    <TableHead>
                        <TableRow>
                            {/* use <TableSelectAll/> with required properties & function to integrate the batch action on row selection */}
                            {headers && headers.map((header) => (
                                <TableHeader key={header.key} isSortable={header.sortable}>
                                {header.header}
                                </TableHeader>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* if filtering is purely api response based, directly use "rows" variable */}
                        {filteredRows?.map((row) => (                                
                            <TableRow key={row.id} >
                                {/* use <TableSelectRow/> with required properties & function to integrate the batch action on row selection */}
                                {
                                headers && headers.map((header)  => (
                                    <TableCell key={`${row.id}_${header.key}`}>
                                        {
                                        (header.type === "date") 
                                            ? new Date(row[header.key]).toDateString()
                                            :row[header.key]
                                        }
                                    </TableCell>
                                ))
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                    {/* use <Pagination/> to with required properties & function to integrate pagination functionality  */}
                </Table>   
            </TableContainer>
            {
                rows.length === 0 && <div style={{background:"#f4f4f4", textAlign:"center", padding:"4rem"}}>
                    No data Availabile
                </div>
            }
        </>
        }
    </>)
}

export default TableComponent