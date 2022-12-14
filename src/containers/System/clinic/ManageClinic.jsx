import './ManageClinic.scss'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
import MarkdownIt from 'markdown-it';
import MdEditor from "react-markdown-editor-lite"
import { CommonUtils } from '../../../utils'
import { createNewClinic } from '../../../services/userService'
import { toast } from 'react-toastify'

const mdParser = new MarkdownIt()
class ManageClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: "",
            descriptionMarkdown: ''
        }
    }

    async componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
    }

    handleOnchangeName = (e) => {
        let name = e.target.value
        this.setState({
            name: name
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text
        })
    }
    handleOnchangeImage = async (e) => {
        let data = e.target.files
        let file = data[0]
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64
            })
        }
    }

    handleSaveNewClinic = async () => {
        let res = await createNewClinic(this.state)
        if (res && res.errCode === 0) {
            toast.success('Add new speciaty succeed!')
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHTML: "",
                descriptionMarkdown: ''
            })
        }
        else {
            toast.error('Something wrongs')
        }
    }




    render() {
        console.log('check state', this.state)
        return (
            <div className='manage-specialty-container'>
                <div className="ms-title"> <FormattedMessage id='manage-clinic.title' /> </div>

                <div className="add-new-specialty row">
                    <div className=" col-6 form-group">
                        <label ><FormattedMessage id='manage-clinic.name' /></label>
                        <input type="text" className='form-control'
                            value={this.state.name}
                            onChange={(e) => this.handleOnchangeName(e)}
                        />

                    </div>
                    <div className="  col-6 form-group">
                        <label ><FormattedMessage id='manage-clinic.image' /></label>
                        <input className="form-control" type='file'
                            onChange={(e) => this.handleOnchangeImage(e)}
                        />
                    </div>
                    <div className=" mark-down col-12">
                        <MdEditor style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />

                    </div>
                    <div className="col-12">
                        <button className="btn-save-specialty"
                            onClick={() => this.handleSaveNewClinic()}
                        > <FormattedMessage id='manage-clinic.save' /></button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
