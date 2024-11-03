import { Input } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useState } from 'react'

const EditableCell = ({getValue, row, column, table}) => {
    const initValue = getValue()
    const [value, setValue] = useState(initValue)


    const onBlur = () => {
        table.options.meta?.updateData( row.index, column.id, value)
    }
    useEffect(()=>{
        setValue(initValue)
    }, [initValue])
    // console.log({value, initValue})
  return (
    <Input
    value={value}
    onChange={e=>{
        setValue(e.target.value)
    }} 
    onBlur={onBlur}
    variant='filled'
    size='sm'
    w='85%'
    overflow='hidden'
    textOverflow='ellipsis'
    whiteSpace='nowrap'
    >
        
    </Input>
  )
}

export default EditableCell