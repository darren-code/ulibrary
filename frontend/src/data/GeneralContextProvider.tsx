import React, { useState } from 'react'
import GeneralContext from './general-context'

const GeneralContextProvider: React.FC = (props) => {
    const [trigger, setTrigger] = useState<Boolean>(true)

    const triggerRender = (status: boolean) => {
        setTrigger(status)
    }

    return (
        <GeneralContext.Provider value={{ 
            trigger,
            triggerRender}}>
        {props.children}
        </GeneralContext.Provider>
    )
}

export default GeneralContextProvider
