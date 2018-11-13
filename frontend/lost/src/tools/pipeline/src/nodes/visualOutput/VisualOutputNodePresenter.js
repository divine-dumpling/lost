import BaseNodePresenter from '../BaseNodePresenter'
import VisualOutputNodeModel from './VisualOutputNodeModel'

import VisualOutputRunningView from './views/VisualOutputRunningView'
import VisualOutputStartView from './views/VisualOutputStartView'

import VisualOutputRunningModal from './modals/VisualOutputRunningModal'
import VisualOutputStartModal from './modals/VisualOutputStartModal'


export default class VisualOutputNodePresenter extends BaseNodePresenter {
    constructor(graph, data, mode) {        
        super(graph)
        // create model
        this.model = new VisualOutputNodeModel(data,mode)
        // create view
        switch(mode){
            case 'running':
                this.view = new VisualOutputRunningView(this.model)
                this.modal = new VisualOutputRunningModal(this.model)
                break
            case 'start':
                this.view = new VisualOutputStartView(this.model) 
                this.modal = new VisualOutputStartModal(this.model) 
                break
            default: throw new Error(`no node view available for ${data.type}`)
        }
    }
    /**
     * @override
     */
    initViewBinding(){
        if(this.view instanceof VisualOutputRunningView){
            this.model.state.on('update', text => {
                this.view.parentNode.querySelector(`[data-ref='state']`).setAttribute('class', `panel-footer 
                    ${ text === 'script_error'   ? 'bg-red'      : '' }
                    ${ text === 'pending'        ? 'bg-blue'     : '' }
                    ${ text === 'in_progress'    ? 'bg-orange'   : '' }
                    ${ text === 'finished'       ? 'bg-green'    : '' }`)
                this.view.parentNode.querySelector(`[data-ref='state-text']`).textContent = text.replace('_', ' ')
            })
        }
    }
    /**
     * @override
     */
    initModelBinding(){
    }
}