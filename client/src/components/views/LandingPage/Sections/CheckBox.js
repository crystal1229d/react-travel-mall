import { Collapse, Checkbox } from 'antd'
import React, { useState } from 'react'

const { Panel } = Collapse;

function CheckBox(props) {

    const [Checked, setChecked] = useState([])

    const handleToggle = (value) => {

        // 클릭한 것의 Index 를 구하고
        const currentIndex = Checked.indexOf(value)

        // 전체 Checked된 State에서 현재 클릭한 Checkbox가 이미 있다면
        const newChecked = [...Checked]

        if (currentIndex === -1) {
            // 빼주고
            newChecked.push(value)
        } else {
            // State에 넣어준다
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked)
        props.handleFilters(newChecked)

    }
    
    const renderCheckboxLists = () => (
        props.list && props.list.map((value, index) => (
            <React.Fragment key={index} >
                <Checkbox onChange={() => handleToggle(value._id)} checked={Checked.indexOf(value._id) === -1 ? false: true} />
                <span>{value.name}</span>
            </React.Fragment>
        ))
    )
    

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="Continents" key="1">
                    {renderCheckboxLists()}
                </Panel>
            </Collapse>    
        </div>
    )
}

export default CheckBox
