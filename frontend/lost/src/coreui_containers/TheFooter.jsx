import { CFooter } from '@coreui/react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useInterval } from 'react-use'
import Swal from 'sweetalert2'
import actions from '../actions'
import * as styles from '../components/styles'
import useInactive from '../hooks/useInactive'

const TheFooter = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(actions.loadSettings())
    }, [])

    const navigate = useNavigate()
    const version = useSelector((state) => state.lost.version)
    const autoLogoutWarnTime = useSelector(
        (state) => state.lost.settings.autoLogoutWarnTime,
    )
    const autoLogoutTime = useSelector((state) => state.lost.settings.autoLogoutTime)
    const isDevMode = useSelector((state) => state.lost.settings.isDevMode)
    const timer = useInactive(autoLogoutTime, true)
    let seconds = timer % 60
    seconds = seconds > 9 ? seconds : `0${seconds}`
    const minutes = parseInt(timer / 60)

    useInterval(() => {
        dispatch(
            actions.checkExpireDate(
                new Date(Date.now() - (autoLogoutTime - timer) * 1000).getTime(),
            ),
        )
    }, 2000)

    const renderAutologoutTimerFooter = () => {
        if (isDevMode) {
            return (
                <div className="ml-auto">
                    <p style={{ margin: 0 }}>
                        {' '}
                        Auto logout in{' '}
                        <span>
                            {minutes}:{seconds}
                        </span>
                    </p>
                    <p style={{ margin: 0, ...styles.centered }}>
                        Warntime: {parseInt(autoLogoutWarnTime / 60)}:
                        {autoLogoutWarnTime % 60 < 10
                            ? `0${autoLogoutWarnTime % 60}`
                            : autoLogoutWarnTime % 60}
                    </p>
                </div>
            )
        }
        return null
    }

    const renderAutologoutModal = () => {
        if (timer === 0) {
            navigate('/logout#timeout')
        } else if (timer < autoLogoutWarnTime) {
            return Swal.fire({
                title: 'You will be logged out soon!',
                text: `You will be logged out in ${minutes}:${seconds}.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: 'primary',
                confirmButtonText: 'OK',
            })
        }
        return null
    }

    return (
        <CFooter className="mt-2">
            <div>
                <span className="ml-1">
                    Powered by{' '}
                    <a
                        href="https://github.com/l3p-cv/lost"
                        target="_blank"
                        rel="noreferrer"
                    >
                        LOST Community
                    </a>
                </span>
            </div>
            {/* {renderAutologoutTimerFooter()} */}
            {renderAutologoutModal()}
            <div className="mfs-auto">
                <span className="ml-auto">
                    <span style={{ marginRight: 20 }}>
                        {/* {isDevMode ? 'React Development Mode' : ''} */}
                    </span>
                    <b>Version </b>
                    <small>{version}</small>
                </span>
            </div>
        </CFooter>
    )
}

export default React.memo(TheFooter)
