import { useState, createRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function({children, maxHeight = 200}) {
    const [collapsed, setCollapsed] = useState(true)
    const [showCollapsed, setShowCollapsed] = useState(true)
    const [max, setMax] = useState(maxHeight)
    const childrenRef = createRef<HTMLDivElement>()

    useEffect(() => {
        setMax(childrenRef.current.getBoundingClientRect().height)

        if(childrenRef.current.getBoundingClientRect().height < maxHeight) {
            setShowCollapsed(false)
        } else {
            setShowCollapsed(true)
        }
    }, [(childrenRef.current && childrenRef.current.getBoundingClientRect())])

    useEffect(() => {
        if(collapsed === false) {
            window.scroll({top: childrenRef.current.offsetTop, left: 0, behavior: 'smooth' })
        }
    }, [collapsed])

    return (
        <>
            <div className="collapse" style={{'transition': 'all .125s ease-in', 'maxHeight': max+'px'}}>
                <div ref={childrenRef}>
                {children}
                </div>
            </div>
            {showCollapsed ? (
    <span style={{display: 'block', textAlign: 'center', outline: '1px solid #fff', cursor:'pointer'}} onClick={() => setCollapsed(!collapsed)}>{collapsed ? <>Expand <FaChevronDown></FaChevronDown></> : <>Hide <FaChevronUp></FaChevronUp></>}</span>
            )
            : (null)}
            {collapsed === true ? (<style jsx>{`
            .collapse {
                max-height: ${maxHeight}px !important;
                overflow: hidden;
            }
            `}</style>) : null}
        </>
    )
}