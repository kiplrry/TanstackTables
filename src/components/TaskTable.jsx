import { Box, Button, ButtonGroup, Icon, Text } from "@chakra-ui/react";
import DATA from "../data"
import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, getSortedRowModel, getPaginationRowModel } from '@tanstack/react-table'
import EditableCell from "./EditableCell";
import StatusCell from "./StatusCell";
import DateCell from "./DateCell"
import SortIcon from './icons/SortIcon'
import Filters from "./Filters";


const columns = [
  {
    accessorKey: 'task',
    header: 'Task',
    size: 255,
    cell: EditableCell,
    enableColumnFilter: true,
    filterFn: 'includesString'

  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: StatusCell,
    enableColumnFilter: true,
    filterFn: (row, columnId, filterStatuses) => {
      if( filterStatuses.length === 0 ) return true;
      const status = row.getValue(columnId)
      return filterStatuses.includes(status?.id)

    },
    enableSorting: false
  },
  {
    accessorKey: 'due',
    header: 'Due',
    cell: DateCell
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: EditableCell
  },
]

const TaskTable = () => {
  const  [data, setData] = useState(DATA)
  const [columnFilters, setColumnFilters] = useState([])


  const table = useReactTable({
    data,
    columns,
    state : {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onChange',
    meta: {
      updateData: (rowIndex, columnId, value) => setData(prevData=>(
        prevData.map((row, index)=>(
          index === rowIndex ? {
            ...prevData[rowIndex], [columnId] : value
          } : row
        ))
      ))
    }
  })
  console.log(columnFilters)
  return <Box>
    <Filters 
      columnFilters = {columnFilters}
      setColumnFilters = {setColumnFilters}
    />
    <Box className='table' w={table.getTotalSize()}>
    {table.getHeaderGroups().map(headerGroup => 
      <Box className='tr' key={headerGroup.id}>
      {headerGroup.headers.map(
        header => <Box className='th' key={header.id} w={header.getSize()}>
          {header.column.columnDef.header}
          {
            header.column.getCanSort() && <Icon 
            as={SortIcon}
            mx={3}
            fontSize={14}
            onClick={
              header.column.getToggleSortingHandler()
            }
            />
          }
          {
            {
              asc: " 🔼",
              desc: " 🔽",
            }[header.column.getIsSorted()]
          }
          <Box 
          onMouseDown = {
            header.getResizeHandler()
          }

          onTouchStart = {
            header.getResizeHandler()
          }

          className= {
            `resizer ${header.column.getIsResizing() ? "isResizing" : ""}`
          }> </Box>
          </Box>
      )
      }
      </Box>
      )
    }
    {
      table.getRowModel().rows.map(row => 
      (<Box className='tr' key={row.id}>
        {row.getAllCells().map(cell => 
          (<Box className='td' key={cell.id} w={cell.column.getSize()}>
            {
            flexRender(cell.column.columnDef.cell, cell.getContext())
            }
          </Box>)
          )}
      </Box>
      ))}
    </Box>
    <br/>
    <Text  mb={4}>
      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
    </Text>
    <ButtonGroup size='sm' isAttached variant='outline'>
      <Button 
        onClick={table.previousPage}
        isDisabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </Button>
      <Button 
        onClick={table.nextPage}
        isDisabled={!table.getCanNextPage()}
      >
        {'>'}
      </Button>
    </ButtonGroup>
  </Box>;
};
export default TaskTable;
