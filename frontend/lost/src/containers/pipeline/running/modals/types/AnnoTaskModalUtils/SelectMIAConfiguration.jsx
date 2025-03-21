import {
    CCol,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CFormInput,
    CFormSwitch,
    CRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import HelpButton from '../../../../../../components/HelpButton'

export const SelectMIAConfiguration = ({ ...props }) => {
    const [configuration, setConfiguration] = useState()

    useEffect(() => {
        setConfiguration(props.configuration)
    }, [props])

    const changeValue = (key, value) => {
        const newConfiguration = { ...configuration }
        switch (key) {
            case 'show-proposed-label':
                newConfiguration.showProposedLabel = value
                break
            case 'anno-type':
                newConfiguration.type = value
                break
            case 'draw-anno':
                newConfiguration.drawAnno = value
                break
            case 'add-context':
                newConfiguration.addContext = value
                break
            default:
                break
        }

        setConfiguration(newConfiguration)
        props.onUpdate(newConfiguration)
    }
    return (
        <>
            {configuration ? (
                <>
                    <CRow style={{ margin: '5px' }}>
                        <CCol sm="12">
                            <h4>MIA Configuration</h4>
                            <CRow>
                                <CCol sm="12">
                                    <CFormSwitch
                                        className={'mx-1'}
                                        variant={'3d'}
                                        color={'primary'}
                                        checked={configuration.showProposedLabel}
                                        onChange={(e) =>
                                            changeValue(
                                                'show-proposed-label',
                                                !configuration.showProposedLabel,
                                            )
                                        }
                                    />
                                    <b
                                        style={{
                                            marginLeft: '20px',
                                        }}
                                    >
                                        Show proposed label
                                        <HelpButton
                                            id="show-proposed-label"
                                            text={'Show proposed label (if given)'}
                                        />
                                    </b>
                                </CCol>
                            </CRow>
                            <h4>Annotation Type</h4>
                            <CRow>
                                <CCol sm="12">
                                    <CRow style={{ marginLeft: '5px' }}>
                                        <CDropdown>
                                            <CDropdownToggle color="primary">
                                                {configuration.type}
                                            </CDropdownToggle>
                                            <CDropdownMenu>
                                                <CDropdownItem
                                                    href="#"
                                                    onClick={(e) =>
                                                        changeValue(
                                                            'anno-type',
                                                            'annoBased',
                                                        )
                                                    }
                                                >
                                                    annoBased
                                                </CDropdownItem>
                                                <CDropdownItem
                                                    href="#"
                                                    onClick={(e) =>
                                                        changeValue(
                                                            'anno-type',
                                                            'imageBased',
                                                        )
                                                    }
                                                >
                                                    imageBased
                                                </CDropdownItem>
                                            </CDropdownMenu>
                                        </CDropdown>
                                        <b
                                            style={{
                                                marginLeft: '20px',
                                            }}
                                        >
                                            Annotation type
                                            <HelpButton
                                                id="anno-type"
                                                text={
                                                    'Weather annotation requests are based on whole images or two_d annotations (in example from a previous SIA annotation step)'
                                                }
                                            />
                                        </b>
                                    </CRow>
                                </CCol>
                                {configuration.type === 'annoBased' ? (
                                    <>
                                        <CCol sm="12" style={{ marginTop: '15px' }}>
                                            <CFormSwitch
                                                className={'mx-1'}
                                                variant={'3d'}
                                                color={'primary'}
                                                checked={configuration.drawAnno}
                                                onChange={(e) =>
                                                    changeValue(
                                                        'draw-anno',
                                                        !configuration.drawAnno,
                                                    )
                                                }
                                            />
                                            <b
                                                style={{
                                                    marginLeft: '20px',
                                                }}
                                            >
                                                Draw Anno
                                                <HelpButton
                                                    id="draw-anno"
                                                    text={
                                                        'Weather to draw two_d annnotations into the image'
                                                    }
                                                />
                                            </b>
                                        </CCol>
                                        <CCol sm="12">
                                            <CRow
                                                style={{
                                                    marginLeft: '5px',
                                                    marginTop: '10px',
                                                }}
                                            >
                                                <CFormInput
                                                    type="number"
                                                    min={0.0}
                                                    step={0.01}
                                                    max={1.0}
                                                    style={{ maxWidth: '20%' }}
                                                    value={configuration.addContext}
                                                    onChange={(e) =>
                                                        changeValue(
                                                            'add-context',
                                                            e.currentTarget.value,
                                                        )
                                                    }
                                                />
                                                <b
                                                    style={{
                                                        marginLeft: '20px',
                                                    }}
                                                >
                                                    Add Context
                                                    <HelpButton
                                                        id="add-context"
                                                        text={`Add some amount of pixels will be added around the annotation when the
                                                        annotation is cropped.
                                                        The number of pixels that are add is calculated relative to the
                                                        image size.
                                                        So if you set addContext to 0.1,
                                                        10 percent of the image size will be added to the crop.
                                                        This setting is useful to provide the annotator some more visual
                                                        context during the annotation step. `}
                                                    />
                                                </b>
                                            </CRow>
                                        </CCol>
                                    </>
                                ) : (
                                    ''
                                )}
                            </CRow>
                        </CCol>
                    </CRow>
                </>
            ) : (
                ''
            )}
        </>
    )
}

export default SelectMIAConfiguration
