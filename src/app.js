import React, { useState } from "react";
import "./style.scss";
import TableComponent from "./components/data-table";
import { Column, Dropdown, Grid } from "@carbon/react";

const tables ={
  "products" : {
    name: "Products",
    dataUrl: "https://dummyjson.com/products",
    filterUrls:[{ key:"category",label: "Category", url: "https://dummyjson.com/products/categories"}],
    headers: [
        {
          key: "title",
          header: "Product Name",
          sortable: true
        },{
            key: "description",
            header: "Description",
        },{
            key: "price",
            header: "Price",
            sortable: true,
        },{
            key: "category",
            header: "Category",
            sortable: true
        },{
            key: "availabilityStatus",
            header: "Availability Status",
            type: "status" //use if status icon need to be added
        }
    ]
  },
  "users" : {
    name: "Users",
    dataUrl: "https://dummyjson.com/users",
    headers: [
        {
          key: "firstName",
          header: "First Name",
          sortable: true
        },{
          key: "lastName",
          header: "Last Name",
          sortable: true
        },{
            key: "birthDate",
            header: "Date of Birth",
            type: "date" // to indicate cell data to formatted to date
        },{
            key: "email",
            header: "Email",
        },{
            key: "university",
            header: "University",
            sortable: true,
        },{
            key: "gender",
            header: "Gender",
            sortable: true
        },{
            key: "bloodGroup",
            header: "Blood Group",
        },{
            key: "role",
            header: "Role"
        }
    ]
  },
  "recipes": {
    name: "Recipes",
    dataUrl: "https://dummyjson.com/recipes",
    filterUrls: [{ key:"tags",label: "Tags", url: "https://dummyjson.com/recipes/tags"}],
    headers: [
        {
          key: "name",
          header: "Recipe Name",
          sortable: true
        },{
            key: "cuisine",
            header: "Cuisine",
        },{
            key: "mealType",
            header: "Meal Type",
            sortable: true,
        }, {
            key: "tags",
            header: "Tags",
            sortable: true
        },{
            key: "difficulty",
            header: "Difficulty Level"
        }
    ]
  }
}

/*
  REFERENCE 
  a. code for more information 
  table - https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/DataTable/stories/dynamic-content/DataTable-dynamic-content.stories.js

  b.storybook foe demo examples
  https://react.carbondesignsystem.com/?path=/docs/components-datatable-selection--overview#programmatic-selection

  c. dummy urls
  https://dummyjson.com/docs/auth
*/

function App() {
  const  [selectedTable, setSelectedTable] = useState("users");

  const dropdownOptions = Object.keys(tables).map((key) => ({
    text: tables[key].name,
    id: key
  }))

  return (
      <div className="appContainer">
        <Grid className="mb02">
          <Column sm={4} md={8} lg={16} xlg={16} max={16}>
            <h2>Carbon Dynamic Data table Demo</h2>
          </Column>
        </Grid>

        <Grid className="mb02">
          <Column sm={4} md={4} lg={4} xlg={4} max={4}>
          {/* dropdown to chose different type of table apis -> api for table data and filters. */}
          <Dropdown
              label="Select the table type"
              titleText="Select the table type"
              type="default"
              id="default"
              selectedItem={dropdownOptions.find(opt=> opt.id === selectedTable)}
              onChange={({ selectedItem }) => setSelectedTable(selectedItem.id)}
              itemToString={(item) => (item ? item.text : "")}
              items={ dropdownOptions }/>
          </Column>
        </Grid>
       

        <Grid className="mb02">
          <Column sm={4} md={8} lg={16} xlg={16} max={16}>
            <TableComponent {...tables[selectedTable]} tableid={selectedTable}/>
          </Column>
        </Grid>
      </div>
  );
}
  
export default App;