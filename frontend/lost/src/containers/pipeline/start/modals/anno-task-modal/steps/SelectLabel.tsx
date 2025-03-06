import { CRow } from '@coreui/react'
import { useEffect, useState } from 'react'
import { Card, CardBody } from 'reactstrap'
import { Label } from 'semantic-ui-react'
import HelpButton from '../../../../../../components/HelpButton'
import LabelsPage from '../../../../../Labels/LabelsPage'

export const SelectLabel = ({ availableLabelTrees, peN, verifyTab }) => {
    const [selectedTree, setSelectedTree] = useState()
    const [selectedNodeIDs, setSelectedNodeIDs] = useState([])
    const [availableLabels, setAvailableLabels] = useState()
    const [selectedLabelTreeIndex, setSelectedLabelTreeIndex] = useState()
    const [areLabelsLoaded, setAreLabelsLoaded] = useState(false)
    const [graphNet, setGraphNet] = useState()
    const [graphData, setGraphData] = useState({
        nodes: [],
        edges: [],
        isLeafArr: [],
    })

    // load already selected labels from redux
    const loadLabelsFromRedux = (labelParents) => {
        const _selectedLabels = []
        labelParents.forEach((labelParent) => {
            const children = availableLabels[labelParent.id].children

            // add all label children ids if available
            if (children !== undefined)
                children.forEach((child) => {
                    _selectedLabels.push(child.idx)
                })
        })

        // prevent update loop
        setAreLabelsLoaded(true)

        setSelectedNodeIDs(_selectedLabels)
    }

    useEffect(() => {
        const element = stateElement.pipelineStart.step1Data.elements.filter(
            (el) => el.peN === peN,
        )[0]

        const _selectedLabelTreeIndex = element.exportData.annoTask.selectedLabelTree
        setSelectedLabelTreeIndex(_selectedLabelTreeIndex)

        // load selected labels from redux in case modal is opened a second time
        if (availableLabels !== undefined && areLabelsLoaded === false) {
            loadLabelsFromRedux(element.exportData.annoTask.labelLeaves)
        }
    }, [stateElement, peN, availableLabels, areLabelsLoaded])

    // allow getting labels from redux when modal closed
    useEffect(() => {
        // on component unmount
        return () => {
            setAreLabelsLoaded(false)
        }
    }, [])

    /**
     * recursive function to get all children from a given nodeID inside a given tree
     * @param {*} branch the tree to search in
     * @param {int} selectedNodeID nodeID to get the children from
     * @returns {Array<int>} children of node
     */
    const findDirectChildren = (branch, selectedNodeID) => {
        // if the current node is the searched node, return all children ids
        if (branch.idx === selectedNodeID)
            return branch.children.map((childNode) => childNode.idx)

        // since we cant return from inside the forEach function
        let children = []

        // check node children if available
        branch.children.forEach((node) => {
            const foundChildren = findDirectChildren(node, selectedNodeID)
            if (foundChildren.length) children = foundChildren
        })

        return children
    }

    // removes a value from array
    const removeFromArr = (array, value) => {
        array.splice(array.indexOf(value), 1)
    }

    /**
     * returns all parent ids from selected labels in redux ready format
     */
    const getParentsOfSelectedLabels = () => {
        // get all parent ids
        const selectedParents = []
        selectedNodeIDs.forEach((nodeID) => {
            const parentID = availableLabels[nodeID].parent_leaf_id

            if (!selectedParents.includes(parentID)) selectedParents.push(parentID)
        })

        // format parent IDs for redux
        const selectedParentData = []
        selectedParents.forEach((parent) => {
            selectedParentData.push({
                id: parent,

                // @TODO not used, but required for backend
                maxLabels: '3',
            })
        })

        return selectedParentData
    }

    // updated the selected nodes when the user has clicked onto a node
    // the children of the clicked node will be toggled (but not children of children)
    const handleNodeClick = (clickedNodeID) => {
        console.log('NODE WITH ID: ', clickedNodeID)
        const nodeChildren = findDirectChildren(selectedTree, parseInt(clickedNodeID))
        console.log('NODE Children: ', nodeChildren)

        // copy without reference to make useState work
        const _selectedNodeIDs = [...selectedNodeIDs]
        console.log('NODE WITH ID: ', clickedNodeID)

        // toggle each child for selectedLabels
        nodeChildren.forEach((child) => {
            // remove node id inside array if it exists, otherwise add it)
            if (_selectedNodeIDs.includes(child)) removeFromArr(_selectedNodeIDs, child)
            else _selectedNodeIDs.push(child)
        })
        console.log('SELECTED NODE IDs: ', _selectedNodeIDs)

        setSelectedNodeIDs(_selectedNodeIDs)
        console.log('SELECTED NODE IDs: ', selectedNodeIDs)
    }

    const mapTreeToGraph = (_graphData, branch, parent) => {
        branch.children.forEach((el) => {
            if (parent) {
                _graphData.edges.push({
                    from: parent,
                    to: el.idx,
                })
            }

            const nodeObj = {
                id: el.idx,
                label: String(el.name),
                color: el.color ? el.color : '#10515F',
                font: { color: '#FFFFFF' },
            }

            if (el.children.length) {
                mapTreeToGraph(_graphData, el, el.idx)
            } else {
                _graphData.isLeafArr.push(el.idx)
            }

            _graphData.nodes.push(nodeObj)
        })

        setGraphData(_graphData)
    }

    /**
     * recursively get all available labels in a flat list
     * label data is accessible via label index
     * @param {LabelTree Object} tree label tree with root label
     * @returns {Object} flat list of objects with label idx as key
     */
    const getAvailableLabelsFlat = (tree) => {
        let result = {}

        // also get root node (others will be overwritten by children key)
        result[tree.idx] = tree

        tree.children.forEach((obj) => {
            if (obj.children) {
                const el = { ...obj, ...{} }
                // delete el.children
                result[el.idx] = el

                // recursively check for children
                obj.children.forEach((child) => {
                    result = {
                        ...result,
                        ...getAvailableLabelsFlat(child),
                    }
                })

                Object.values(obj.children).forEach((v, i) => {
                    result[v.idx] = v
                })
            } else result[obj.idx] = obj
        })

        return result
    }

    useEffect(() => {
        if (selectedLabelTreeIndex === undefined) return

        // get tree with selected index
        const _tree = availableLabelTrees.filter(
            (el) => el.idx === selectedLabelTreeIndex,
        )[0]

        setSelectedTree(_tree)

        // create a flat list of all labels inside tree
        const _availableLabels = getAvailableLabelsFlat(_tree)
        setAvailableLabels(_availableLabels)
    }, [selectedLabelTreeIndex, availableLabelTrees])

    useEffect(() => {
        if (selectedTree === undefined) return

        // copy graphData without reference to make useEffekt work
        const _graphData = { ...graphData }

        _graphData.nodes.push({
            id: selectedTree.idx,
            label: selectedTree.name,
            chosen: true,
            color: selectedTree.color ? selectedTree.color : '#10515F',
            font: { color: '#FFFFFF' },
        })

        mapTreeToGraph(_graphData, selectedTree, selectedTree.idx)
    }, [selectedTree])

    useEffect(() => {
        console.log('UPDATE VERIFY TAB')
        // if (graphNet === undefined) return

        // graphNet.selectNodes(selectedNodeIDs)

        // allow access to settings step
        if (selectedNodeIDs.length) {
            verifyTab(peN, 3, true)
            verifyTab(peN, 4, true)
        }

        // update redux action
        const selectedParentData = getParentsOfSelectedLabels()
        dispatch(updateLabels(peN, selectedParentData))
    }, [selectedNodeIDs, graphNet])

    const getContrastColor = (hexColor) => {
        hexColor = hexColor.replace('#', '')

        const r = parseInt(hexColor.substring(0, 2), 16)
        const g = parseInt(hexColor.substring(2, 4), 16)
        const b = parseInt(hexColor.substring(4, 6), 16)

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

        return luminance > 0.5 ? '#000000' : '#ffffff'
    }
    const buildLabelInfo = () => {
        let html = []
        selectedNodeIDs.forEach((nodeID) =>
            html.push(
                <Label
                    as="a"
                    tag
                    key={nodeID}
                    style={{
                        marginTop: 5,
                        marginLeft: 30,
                        opacity: 1,
                        cursor: 'default',
                        color: getContrastColor(availableLabels[nodeID].color),
                        background: availableLabels[nodeID].color,
                    }}
                >
                    {availableLabels[nodeID].name}
                </Label>,
            ),
        )

        if (html.length === 0) html = '(No labels selected)'

        return (
            <>
                <h4>Labels that will be available in your annotation task:</h4>
                {html}
            </>
        )
    }
    if (graphData.nodes.length === 0) return 'Loading...'
    return (
        <Card className="annotask-modal-card">
            <CardBody>
                <>
                    <CRow className="justify-content-center">
                        <HelpButton
                            id={'choose-label'}
                            text={`Click on the parent label to make all child labels available in the AnnotationTask. 
                    
                    Labels that are active for the AnnotationTask are visualized with a strong border in this view.`}
                        />
                    </CRow>
                    {selectedTree && (
                        <LabelsPage
                            showEdit={false}
                            labelTree={selectedTree}
                            onNodeClick={handleNodeClick}
                            // visLevel={this.props.visLevel}
                            highlightedNodeIds={selectedNodeIDs}
                        ></LabelsPage>
                    )}

                    {buildLabelInfo()}
                </>
            </CardBody>
        </Card>
    )
}
