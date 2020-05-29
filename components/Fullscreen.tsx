import { useState, useEffect } from 'react';
import { FaExpand } from 'react-icons/fa';
import { FaCompress } from 'react-icons/fa';
import { FaChevronLeft } from 'react-icons/fa'
import { useRouter } from 'next/router';

function requestFullscreen() {
    if (document.documentElement.requestFullscreen) {
        return true
      } else if (document.documentElement.mozRequestFullScreen) {
        return true
      } else if (document.documentElement.webkitRequestFullscreen) { 
        return true
      } else if (document.documentElement.msRequestFullscreen) {
        return true
      }

      return false
}

function openFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) { 
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
  }

  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  
export default function() {
    const [isFs, setFs] = useState(false)
    const router = useRouter()

    if (typeof window !== 'undefined') {
        const renderThis = requestFullscreen()
        if(!renderThis) return (null)
    }

    const fullScreen = () => {
        if(isFs === false) {
            openFullscreen()
        } else if(isFs === true) {
            closeFullscreen()
        }
    }

    const fullScreenHandler = (e) => {
        setFs(!!document.fullscreenElement)
    }

    if (typeof window !== 'undefined') {
        useEffect(() => {
            document.addEventListener('fullscreenchange', fullScreenHandler)
            return () => {
                document.removeEventListener('fullscreenchange', fullScreenHandler)
            }
        })
    }

    return (
        <>
        <a onClick={() => fullScreen()}>{isFs ? <FaCompress></FaCompress> : <FaExpand></FaExpand>}</a>
        {isFs ? <a style={{marginTop: 35}} onClick={() => router.back()}> <FaChevronLeft></FaChevronLeft></a> : null}
        <style jsx>{`
a {
    position: absolute;
    top: 20px;
    right: 20px;
    height: 35px;
    width: 35px;
    text-align: center;
    line-height: 35px;
}
        `}</style>
        </>
    )
}