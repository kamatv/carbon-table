import { Filter } from "@carbon/icons-react";
import { Button, CheckboxGroup,Checkbox, Layer, Popover, PopoverContent, DatePicker, DatePickerInput, Grid, Column } from "@carbon/react";
import React, { useState } from "react";
import "./data-table.scss"

const TableFilterComponent =({
    filters,
    onApplyFilter,
    onResetFilter
}) =>{

    const [isOpen, setIsOpen] = useState(false); //variable to indicate modal open/close 
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]); //save all the selected checkboxes
    const [selectedDate, setSelectedDate] = useState([]); //save the selected date

    //function that handle apply filter function
    const handleApplyFilter = () => {
        setIsOpen(false);
        if (onApplyFilter) {
            const selectedFilters = []
            if(selectedCheckboxes){
                selectedFilters.push(...selectedCheckboxes)
            }
            if(selectedDate && selectedDate.length > 0){ 
                //further enhance filter by validations to check both date ranges are added, etc
                selectedFilters.push({key: "date", options : selectedDate})
            }
          onApplyFilter(selectedFilters);
        }
    };
    
    //function that handle reset filter function
    const handleResetFilter = () => {
        setIsOpen(false);
        setSelectedCheckboxes([])
        setSelectedDate([])
        if (onResetFilter) {
          onResetFilter();
        }
    };

    const handleCheckboxChange = (categoryName, option) => {
        const updatedFilters = [...selectedCheckboxes];
        const categoryIndex = updatedFilters.findIndex(cat => cat.key === categoryName);

        if (categoryIndex === -1) {
            // Category doesn"t exist, add it with the selected option
            updatedFilters.push({ key: categoryName, options: [option] });
        } else {
            const options = updatedFilters[categoryIndex].options;
            const optionExists = options.includes(option);

            const newOptions = optionExists
                ? options.filter(opt => opt !== option)
                : [...options, option];

            if (newOptions.length === 0) {// Remove category if no options left
                updatedFilters.splice(categoryIndex, 1);
            } else {
                updatedFilters[categoryIndex].options = newOptions;
            }
        }

        setSelectedCheckboxes(updatedFilters)
    }
    
    //function that handle date change function
    const handleDateChange = (date) => {
        event.preventDefault()
        event.stopPropagation()
        setSelectedDate(date)
    }

    return    <Layer>
        <Popover
        open={isOpen}
        isTabTip={true}
        onRequestClose={() => setIsOpen(false)}
        align="bottom-end">
            <Button kind="ghost" 
                aria-label="Filtering" 
                onClick={() =>setIsOpen(!isOpen)}>
                <Filter />
            </Button>
            <PopoverContent id={"toolbarId"}>
                <div className="filterContent">
                    <div id="filterTitle" style={{paddingBottom:"1rem"}}>Filters</div>

                    {/* hardcoded date picker and DatePicker Input for filtering */}
                    <DatePicker
                            datePickerType="range"
                            value={selectedDate}
                            onChange={(date) => handleDateChange(date)}
                            >
                            <DatePickerInput
                                id="date-picker-input-id-start"
                                labelText="Start date"
                                placeholder="mm/dd/yyyy"
                                size="md"
                            />
                            <DatePickerInput
                                id="date-picker-input-id-finish"
                                labelText="End date"
                                placeholder="mm/dd/yyyy"
                                size="md"
                            />
                    </DatePicker>

                    {/* dynamic filters added based on filters Array passed thru parent component */}
                    <Grid style={{paddingTop:"1rem"}}>
                        {
                            filters.map(filter => 
                                <Column sm={4} md={8} lg={8} key={filter.key}>
                                    <CheckboxGroup legendText={filter.label}>      
                                        {
                                            filter.options.map(option => 
                                                <Checkbox 
                                                key={option.key}
                                                labelText={option.label} 
                                                id={option.key}
                                                onChange={() => handleCheckboxChange(filter.key, option.key)} 
                                                checked={
                                                    selectedCheckboxes.find(c=> c.key=== filter.key)?.options.includes(option.key)
                                                    ? true: false
                                                }/>
                                            )
                                        }
                                     </CheckboxGroup>
                                </Column>
                            )
                        }
                    </Grid>
                </div>
                <div className="buttonContainer">
                    <Button
                        kind="secondary"
                        title="Reset filters"
                        onClick={handleResetFilter}>
                        Reset filters
                    </Button>
                    <Button
                        kind="primary"
                        title="Reset filters"
                        onClick={handleApplyFilter}>
                        Apply filter
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    </Layer>
}

export default TableFilterComponent