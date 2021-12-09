import React from "react"

const GeneralContext = React.createContext<{
    trigger: Boolean;
    triggerRender: (status: boolean) => void;
}>({
    trigger: true,
    triggerRender: () => {},
})

export default GeneralContext